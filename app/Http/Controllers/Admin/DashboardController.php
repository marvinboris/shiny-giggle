<?php

namespace App\Http\Controllers\Admin;

use App\Guest;
use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    //
    public function  index()
    {
        $user = request()->user();

        $users = User::orderBy('created_at', 'desc')->get();
        $guests = Guest::get();

        $paidAmount = 0;
        foreach ($users as $user) {
            $paidAmount += $user->paidAmount();
        }
        foreach ($guests as $guest) {
            $paidAmount += $guest->plan->price;
        }

        $subscribers = count($users) + count($guests);
        $notifications = count($user->unreadNotifications);
        $paidPoints = 0;

        return response()->json([
            'blocksData' => [
                'paidAmount' => $paidAmount,
                'subscribers' => $subscribers,
                'notifications' => $notifications,
                'paidPoints' => $paidPoints,
            ],
            'totalUsers' => $users
        ]);
    }
}
