<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Method;
use App\Notifications\PlanUser as NotificationsPlanUser;
use App\Deposit;
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

        $code = Plan::code();
        $purchase = PlanUser::create([
            'plan_id' => $plan->id,
            'user_id' => $user->id,
            'points' => $plan->points,
            'code' => $code,
            'expiry_date' => Carbon::now()->addWeeks($plan->validity)
        ]);
        $plan_user = PlanUser::whereCode($code)->first();
        Deposit::create([
            'user_id' => $user->id,
            'method_id' => Method::whereSlug('admin')->first()->id,
            'amount' => $plan->price,
            'status' => 2,
            'fees' => 0,
            'type' => 'plan',
            'data' => json_encode(['plan_user_id' => $plan_user->id])
        ]);

        $user->notify(new NotificationsPlanUser($purchase));

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successful plan deposit.'
            ]
        ]);
    }

    public function calculations(Request $request)
    {
        $request->validate([
            'ref' => 'required|exists:users',
            'id' => 'required|exists:plans',
            'points' => 'required|numeric',
        ]);

        $user = User::whereRef($request->ref)->first();
        $plan = Plan::whereId($request->id)->first();

        $purchase = PlanUser::create([
            'plan_id' => $plan->id,
            'user_id' => $user->id,
            'points' => $request->points,
            'code' => Plan::code(),
            'expiry_date' => Carbon::now()->addWeeks($plan->validity)
        ]);
        Deposit::create([
            'user_id' => $user->id,
            'method_id' => Method::whereSlug('admin')->first()->id,
            'amount' => $plan->price,
            'status' => 2,
            'fees' => 0,
            'type' => 'plan',
            'data' => json_encode(['plan_user_id' => $purchase->id])
        ]);

        $user->notify(new NotificationsPlanUser($purchase));

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successful calculations deposit.'
            ]
        ]);
    }
}
