<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Mail\VerificationLink;
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
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'country' => $request->country,
            'sponsor' => $request->sponsor ?? User::first()->ref,
            'ref' => User::ref()
        ]);
        $user = User::find($user->id);
        $link = url('/api/email/verify/' . $user->id) . '/' . Crypt::encryptString($user->toJson());
        Mail::to($user->email)->send(new VerificationLink($link));
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
        if (!Auth::attempt($credentials))
            return response()->json([
                'message' => [
                    'type' => 'danger',
                    'content' => 'Unauthorized'
                ]
            ], 401);
            
        $tokenResult = $user->createToken('User Personal Access Token');
        $token = $tokenResult->token;
        if ($request->remember_me)
            $token->expires_at = Carbon::now()->addWeeks(1);
        $token->save();
        return response()->json([
            'access_token' => $tokenResult->accessToken,
            'token_type' => 'Bearer',
            'expires_at' => Carbon::parse(
                $tokenResult->token->expires_at
            )->toDateTimeString(),
            'userData' => array_merge($user->toArray(), ['plans' => $user->plans])
        ]);
    }
}
