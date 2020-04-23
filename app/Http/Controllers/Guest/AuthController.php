<?php

namespace App\Http\Controllers\Guest;

use App\Guest;
use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    //
    use ThrottlesLogins;

    public function username()
    {
        return 'email';
    }

    public function guard()
    {
        return Auth::guard('outer');
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
            'code' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = Guest::where('plan_code', $request->code)->first();

        if (!$user)
            return response()->json([
                'message' => 'Unauthorized'
            ], 401);

        $tokenResult = $user->createToken('Personal Access Token');
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
            'userData' => $user
        ]);
    }

    /**
     * Create guest and token
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function signup(Request $request)
    {
        $request->validate([
            'email' => 'required|email|unique:guests',
            'name' => 'required|string',
            'phone' => 'required|string',
            'country' => 'required|string',
            'code' => 'required|numeric',
            'password' => 'required|digits:4|confirmed',
            'terms' => 'accepted'
        ]);

        $guest = Guest::create([
            'email' => $request->email,
            'name' => $request->name,
            'phone' => $request->code . $request->phone,
            'country' => $request->country,
            'password' => Hash::make($request->password)
        ]);

        $tokenResult = $guest->createToken('Personal Access Token');
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
            'userData' => $guest
        ]);
    }

    /**
     * Logout the guest.
     *
     * @return \Illuminate\Http\RedirectResponse
     */
    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json([
            'message' => 'Successfully logged out'
        ]);
    }

    /**
     * Get the authenticated User
     *
     * @return [json] user object
     */
    public function user(Request $request)
    {
        $user = $request->user();
        return response()->json(['data' => $user, 'role' => $user->role()]);
    }
}
