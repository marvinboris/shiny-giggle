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
        $notifications = count(ContactUs::whereStatus(0)->get());
        $paidPoints = 0;

        $financeTrackerData = [];
        $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        $dayOfWeek = Carbon::today()->dayOfWeek;
        if ($dayOfWeek > 0) {
            for ($i = 1; $i <= $dayOfWeek; $i++) {
                $subDays = $dayOfWeek - $i;
                $silver = 0;
                $gold = 0;
                $diamond = 0;
                foreach (PlanUser::whereDate('created_at', Carbon::today()->subDays($subDays))->get() as $plan_user) {
                    if ($plan_user->user) {
                        // $transaction = Deposit::whereData(json_encode(['plan_user_id' => $plan_user->id]))->first();
                        switch ($plan_user->plan->slug) {
                            case 'silver-plan':
                                $silver++;
                                // $silver += $transaction->amount;
                                break;

                            case 'gold-plan':
                                $gold++;
                                // $gold += $transaction->amount;
                                break;

                            case 'diamond-plan':
                                $diamond++;
                                // $diamond += $transaction->amount;
                                break;
                        }
                    }
                }
                $financeTrackerData[] = [
                    'name' => $days[$i],
                    'silver' => $silver,
                    'gold' => $gold,
                    'diamond' => $diamond,
                ];
            }

            for ($i = $dayOfWeek + 1; $i <= 7; $i++) {
                $day = $i;
                if ($i === 7) $day = 0;
                $financeTrackerData[] = ['name' => $days[$day], 'silver' => 0, 'gold' => 0, 'diamond' => 0];
            }
        } else {
            for ($i = 0; $i < 7; $i++) {
                $subDays = 6 - $i;
                $silver = 0;
                $gold = 0;
                $diamond = 0;
                foreach (PlanUser::whereDate('created_at', Carbon::today()->subDays($subDays))->get() as $plan_user) {
                    if ($plan_user->user) {
                        // $transaction = Deposit::whereData(json_encode(['plan_user_id' => $plan_user->id]))->first();
                        switch ($plan_user->plan->slug) {
                            case 'silver-plan':
                                $silver++;
                                // $silver += $transaction->amount;
                                break;

                            case 'gold-plan':
                                $gold++;
                                // $gold += $transaction->amount;
                                break;

                            case 'diamond-plan':
                                $diamond++;
                                // $diamond += $transaction->amount;
                                break;
                        }
                    }
                }
                $day = $i;
                if ($subDays === 0) $day = 0;
                $financeTrackerData[] = [
                    'name' => $days[$day],
                    'silver' => $silver,
                    'gold' => $gold,
                    'diamond' => $diamond,
                ];
            }
        }

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
                'paidAmount' => round($paidAmount),
                'subscribers' => $subscribers,
                'notifications' => $notifications,
                'paidPoints' => $paidPoints,
            ],
            'totalUsers' => $users->toArray(),
            'financeTrackerData' => $financeTrackerData,
            'contacts' => $contacts,
            'packages' => $packages,
            'plans' => $plans,
        ]);
    }
}
