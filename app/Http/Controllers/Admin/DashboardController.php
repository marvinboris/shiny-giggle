<?php

namespace App\Http\Controllers\Admin;

use App\Admin;
use App\ContactUs;
use App\Deposit;
use App\Guest;
use App\Http\Controllers\Controller;
use App\LimoPayment;
use App\Plan;
use App\PlanUser;
use App\Transaction;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    //
    public function  index()
    {
        // $user = request()->user();
        $user = Admin::first();

        $users = User::orderBy('id', 'desc')->limit(5)->get();
        $guests = Guest::get();

        $paidAmount = 0;
        foreach (Deposit::get() as $deposit) {
            if ($deposit->status === 2) $paidAmount += $deposit->amount;
        }

        $subscribers = count(User::get()) + count($guests);
        $notifications = count($user->unreadNotifications);
        $paidPoints = 0;

        $contacts = [];
        foreach (ContactUs::latest()->limit(5)->get() as $contact) {
            $contacts[] = array_merge($contact->toArray(), [
                'user' => $contact->user
            ]);
        }

        $packages = [];
        $plans = Plan::get();
        foreach ($plans as $plan) {
            $packages['today'][$plan->slug] = [];
            $packages['weekly'][$plan->slug] = [];
            $packages['monthly'][$plan->slug] = [];
            $packages['yearly'][$plan->slug] = [];
        }
        foreach (PlanUser::where('created_at', '>=', Carbon::now()->subDay())->get() as $plan_user) {
            if ($plan_user->user) {
                $transaction = Deposit::whereData(json_encode(['plan_user_id' => $plan_user->id]))->first();
                $packages['today'][$plan_user->plan->slug][] = array_merge($plan_user->plan->toArray(), [
                    'amount' => $transaction->amount
                ]);
            }
        }
        foreach (PlanUser::where('created_at', '>=', Carbon::now()->subWeek())->get() as $plan_user) {
            if ($plan_user->user) {
                $transaction = Deposit::whereData(json_encode(['plan_user_id' => $plan_user->id]))->first();
                $packages['weekly'][$plan_user->plan->slug][] = array_merge($plan_user->plan->toArray(), [
                    'amount' => $transaction->amount
                ]);
            }
        }
        foreach (PlanUser::where('created_at', '>=', Carbon::now()->subMonth())->get() as $plan_user) {
            if ($plan_user->user) {
                $transaction = Deposit::whereData(json_encode(['plan_user_id' => $plan_user->id]))->first();
                $packages['monthly'][$plan_user->plan->slug][] = array_merge($plan_user->plan->toArray(), [
                    'amount' => $transaction->amount
                ]);
            }
        }
        foreach (PlanUser::where('created_at', '>=', Carbon::now()->subYear())->get() as $plan_user) {
            if ($plan_user->user) {
                $transaction = Deposit::whereData(json_encode(['plan_user_id' => $plan_user->id]))->first();
                $packages['yearly'][$plan_user->plan->slug][] = array_merge($plan_user->plan->toArray(), [
                    'amount' => $transaction->amount
                ]);
            }
        }

        return response()->json([
            'blocksData' => [
                'paidAmount' => $paidAmount,
                'subscribers' => $subscribers,
                'notifications' => $notifications,
                'paidPoints' => $paidPoints,
            ],
            'totalUsers' => $users->toArray(),
            'contacts' => $contacts,
            'packages' => $packages,
            'plans' => $plans,
        ]);
    }
}
