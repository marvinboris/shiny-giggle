<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    //
    public function  index()
    {
        $users = User::get();

        return response()->json([
            'totalUsers' => $users->toArray()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'username' => 'required|string|unique:users|alpha_dash',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|confirmed',
            'country' => 'required',
        ]);
        User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->code . $request->phone,
            'password' => Hash::make($request->password),
            'country' => $request->country,
            'sponsor' => $request->sponsor ?? User::first()->ref,
            'ref' => User::ref(),
            'email_verified_at' => time()
        ]);
        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successfully created user.'
            ],
        ], 201);
    }
}
