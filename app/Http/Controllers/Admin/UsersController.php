<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;

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
}
