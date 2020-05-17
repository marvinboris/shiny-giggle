<?php

namespace App\Http\Controllers\Admin;

use App\Admin;
use App\Http\Controllers\Controller;
use App\Mail\VerificationCode;
use App\User;
use Carbon\Carbon;
use Illuminate\Foundation\Auth\ThrottlesLogins;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    //
    /**
     * This trait has all the login throttling functionality.
     */
    use ThrottlesLogins;

    //Your other code here...

    /**
     * Username used in ThrottlesLogins trait
     *
     * @return string
     */
    public function username()
    {
        return 'email';
    }

    protected function guard()
    {
        return Auth::guard('admin');
    }

    /**
     * Login the admin.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function login(Request $request)
    {
        $input = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);
        $admin = Admin::where('email', $input['email'])->first();

        if ($admin) {
            if (Hash::check($input['password'], $admin->password)) {
                $code = User::generateNewRef();
                Mail::to($admin->email)->send(new VerificationCode($code));
                $hash = Crypt::encryptString(json_encode([
                    'id' => $admin->id,
                    'code' => $code,
                ]));
                return response()->json([
                    'hash' => $hash
                ]);
            }
        }
        return response()->json([
            'message' => [
                'type' => 'danger',
                'content' => 'These credentials do not match our records.'
            ]
        ], 403);
    }

    public function resend(Request $request)
    {
        $data = json_decode(Crypt::decryptString($request->hash));
        $admin = Admin::findOrFail($data->id);

        $code = User::generateNewRef();
        Mail::to($admin->email)->send(new VerificationCode($code));
        $hash = Crypt::encryptString(json_encode([
            'id' => $admin->id,
            'code' => $code,
        ]));

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Verification code successfully sent.'
            ],
            'hash' => $hash
        ]);
    }

    public function verify(Request $request)
    {
        $input = $request->validate([
            'code' => 'required|string'
        ]);

        $data = json_decode(Crypt::decryptString($request->hash));
        if ($input['code'] === $data->code) {
            $admin = Admin::findOrFail($data->id);
            $tokenResult = $admin->createToken('Admin Personal Access Token');
            $token = $tokenResult->token;
            $token->expires_at = Carbon::now()->addMinutes(15);
            $token->save();
            return response()->json([
                'access_token' => $tokenResult->accessToken,
                'token_type' => 'Bearer',
                'expires_at' => Carbon::parse(
                    $tokenResult->token->expires_at
                )->toDateTimeString(),
                'userData' => array_merge($admin->toArray(), [
                    'notifications' => $admin->unreadNotifications()->orderBy('created_at', 'desc')->limit(5)->get(),
                ])
            ]);
        }
        return response()->json([
            'message' => 'Verification code is invalid.'
        ], 403);
    }
}
