<?php

namespace App\Http\Controllers\User;

use App\Deposit;
use App\Http\Controllers\Controller;
use App\Mail\ResetLink;
use App\Mail\VerificationLink;
use App\Method;
use App\Notifications\PlanUser as NotificationsPlanUser;
use App\Plan;
use App\PlanUser;
use App\Promotion;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    /**
     * Create user
     *
     * @param  [string] name
     * @param  [string] email
     * @param  [string] password
     * @param  [string] password_confirmation
     * @return [string] message
     */
    public function signup(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'username' => 'required|string|unique:users|alpha_dash',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|confirmed',
            'country' => 'required',
            'terms' => 'accepted'
        ]);
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->code . $request->phone,
            'password' => Hash::make($request->password),
            'country' => $request->country,
            'sponsor' => $request->sponsor ?? User::first()->ref,
            'ref' => User::ref(),
            'ip' => $request->ip()
        ]);
        $user->email_verified_at = time();
        $user->save();
        $user = User::find($user->id);
        // $link = url('/api/email/verify/' . $user->id) . '/' . Crypt::encryptString($user->toJson());
        // Mail::to($user->email)->send(new VerificationLink($link));

        $promotions = Promotion::whereDate('start_time', '<=', Carbon::now())->whereDate('end_time', '>=', Carbon::now())->whereStatus(1)->get();
        foreach ($promotions as $promotion) {
            foreach ($promotion->plans as $plan) {
                $code = Plan::code();
                $purchase = PlanUser::create([
                    'plan_id' => $plan->id,
                    'user_id' => $user->id,
                    'points' => $plan->points,
                    'total' => $plan->points,
                    'code' => $code,
                    'expiry_date' => Carbon::now()->addWeeks($plan->validity)
                ]);
                $plan_user_id = PlanUser::whereCode($code)->first()->toArray()['id'];

                Deposit::create([
                    'user_id' => $user->id,
                    'method_id' => Method::whereSlug('admin')->first()->id,
                    'amount' => $plan->price,
                    'status' => 2,
                    'fees' => 0,
                    'type' => 'plan',
                    'data' => json_encode(['plan_user_id' => $plan_user_id])
                ]);

                $user->notify(new NotificationsPlanUser($purchase));
            }
        }

        return response()->json([
            'message' => 'Successfully created user!',
            'email' => $request->email
        ], 201);
    }

    /**
     * Login user and create token
     *
     * @param  [string] email
     * @param  [string] password
     * @param  [boolean] remember_me
     * @return [string] access_token
     * @return [string] token_type
     * @return [string] expires_at
     */
    public function login(Request $request)
    {
        $request->validate([
            'ref' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = null;
        if (filter_var($request->ref, FILTER_VALIDATE_EMAIL)) $user = User::whereEmail($request->ref)->first();
        else $user = User::whereUsername($request->ref)->first();

        $credentials = ['email' => $user->email, 'password' => $request->password];
        if (!$user->email_verified_at) return response()->json([
            'message' => [
                'type' => 'danger',
                'content' => 'Please, check your mailbox and click on the activation link.'
            ]
        ], 403);
        if ($user->is_active === 0) return response()->json([
            'message' => [
                'type' => 'danger',
                'content' => 'Your account is not active. Please, contact the administrator.'
            ]
        ], 403);

        if (!Auth::attempt($credentials))
            return response()->json([
                'message' => [
                    'type' => 'danger',
                    'content' => 'Unauthorized'
                ]
            ], 401);

        $user->update([
            'ip' => $request->ip(),
            'last_login' => now()
        ]);
        $tokenResult = $user->createToken('User Personal Access Token');
        $token = $tokenResult->token;
        // if ($request->remember_me)
        $token->expires_at = Carbon::now()->addWeeks(1);
        $token->save();
        return response()->json([
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse(
                $tokenResult->token->expires_at
            )->toDateTimeString(),
            'userData' => array_merge($user->toArray(), [
                'notifications' => $user->unreadNotifications()->latest()->limit(5)->get(),
                'plans' => $user->plans,
                'messages' => $user->contact_us()->whereStatus(0)->latest()->limit(5)->get()
            ])
        ]);
    }

    public function forgot(Request $request)
    {
        $request->validate([
            'email' => 'exists:users'
        ]);

        $user = User::whereEmail($request->email)->first();
        $link = url('/auth/reset/' . $user->id) . '/' . Crypt::encryptString($user->toJson());
        Mail::to($request->email)->send(new ResetLink($link));

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Reset password link successfully sent.'
            ]
        ]);
    }

    public function reset(Request $request, $id, $code)
    {
        $request->validate([
            'password' => 'required|confirmed'
        ]);

        $user = User::find($id);
        if (Crypt::decryptString($code) === $user->toJson()) {
            $user->password = Hash::make($request->password);
            $user->save();

            return response()->json([
                'message' => [
                    'type' => 'success',
                    'content' => 'Your password has been successfully reset.'
                ]
            ]);
        }

        return response()->json([
            'message' => [
                'type' => 'danger',
                'content' => 'Failure.'
            ]
        ]);
    }
}
