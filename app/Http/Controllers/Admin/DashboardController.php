<?php

namespace App\Http\Controllers\Admin;

use App\Deposit;
use App\Guest;
use App\Http\Controllers\Controller;
use App\LimoPayment;
use App\Transaction;
use App\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    //
    public function  index()
    {
        $user = request()->user();

        $users = User::orderBy('id', 'desc')->limit(5)->get();
        $guests = Guest::get();

        $paidAmount = 0;
        foreach (Deposit::get() as $deposit) {
            if ($deposit->status === 2) $paidAmount += $deposit->amount;
        }

        $subscribers = count(User::get()) + count($guests);
        $notifications = count($user->unreadNotifications);
        $paidPoints = 0;

        return response()->json([
            'blocksData' => [
                'paidAmount' => $paidAmount,
                'subscribers' => $subscribers,
                'notifications' => $notifications,
                'paidPoints' => $paidPoints,
            ],
            'totalUsers' => $users->toArray()
        ]);
    }
}
