<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Plan;
use Carbon\Carbon;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    //
    public function index()
    {
        $user = request()->user();

        $purchasedPlans = [];
        foreach ($user->plans as $plan) {
            if ($plan->pivot->points > 0 && time() < Carbon::createFromDate($plan->pivot->expiry_date)->timestamp)
                $purchasedPlans[] = $plan;
        }

        $calculations = $user->calculations();
        $notifications = count($user->unreadNotifications);

        $paidAmount = 0;
        foreach ($purchasedPlans as $plan) {
            $paidAmount += $plan->price;
        }

        $plans = [];
        $links = [];

        foreach (Plan::get() as $plan) {
            $plans[] = array_merge($plan->toArray(), [
                'durations' => count($plan->durations),
                'packs' => count($plan->packs),
                'periods' => count($plan->periods),
            ]);
            $links[] = route('plans.payment', $plan->slug);
        }

        return response()->json([
            'blocksData' => [
                'purchasedPlans' => count($purchasedPlans),
                'calculations' => $calculations,
                'notifications' => $notifications,
                'paidAmount' => $paidAmount,
            ],
            'purchasedPlans' => $purchasedPlans,
            'buyablePlans' => [
                'plans' => $plans,
                'links' => $links
            ]
        ]);
    }
}
