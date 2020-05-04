<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Notifications\PlanUser as NotificationsPlanUser;
use App\Plan;
use App\PlanUser;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class PlansController extends Controller
{
    //
    public function index()
    {
        return response()->json([
            'plans' => Plan::get()
        ]);
    }

    public function store(Request $request)
    {
        Plan::create([
            'name' => $request->name,
            'points' => $request->points,
            'validity' => $request->validity,
            'price' => $request->price
        ]);
        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successfully created plan.'
            ],
        ], 201);
    }

    public function deposit(Request $request)
    {
        $request->validate([
            'ref' => 'required|exists:users',
            'id' => 'required|exists:plans',
        ]);

        $user = User::whereRef($request->ref)->first();
        $plan = Plan::whereId($request->id)->first();

        $purchase = PlanUser::create([
            'plan_id' => $plan->id,
            'user_id' => $user->id,
            'points' => $plan->points,
            'code' => Plan::code(),
            'expiry_date' => Carbon::now()->addWeeks($plan->validity)
        ]);

        $user->notify(new NotificationsPlanUser($purchase));

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successful plan deposit.'
            ]
        ]);
    }
}
