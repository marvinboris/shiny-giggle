<?php

namespace App\Http\Controllers;

use App\Admin;
use App\Guest;
use App\User;
use Illuminate\Http\Request;

class UtilController extends Controller
{
    public static function user($user)
    {
        switch ($user->token()->name) {
            case 'User Personal Access Token':
                $user = User::find($user->id);
                break;
            case 'Admin Personal Access Token':
                $user = Admin::find($user->id);
                break;
            case 'Guest Personal Access Token':
                $user = Guest::find($user->id);
                break;
        }
        return $user;
    }
}
