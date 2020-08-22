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
    private function get($filter)
    {
        $page = +request()->page;
        $show = request()->show;
        $search = request()->search;

        $total = 0;

        $data = [];
        $filteredData = [];

        switch ($filter) {
            case 'plans':
                $filteredData = Plan::latest();

                $filteredData = $filteredData
                    ->when($search, function ($query, $search) {
                        if ($search !== "")
                            $query
                                ->where('name', 'LIKE', "%$search%")
                                ->orWhere('slug', 'LIKE', "%$search%");
                    });

                $total = $filteredData->count();

                if ($show !== 'All') $filteredData = $filteredData->skip(($page - 1) * $show)->take($show);

                $filteredData = $filteredData->get();

                foreach ($filteredData as $item) {
                    $data[] = array_merge($item->toArray(), []);
                }
                break;

            case 'details':
                $filteredData = PlanUser::latest();

                $filteredData = $filteredData
                    ->when($search, function ($query, $search) {
                        if ($search !== "")
                            $query
                                ->where('name', 'LIKE', "%$search%")
                                ->orWhere('slug', 'LIKE', "%$search%")
                                ->orWhere('ref', 'LIKE', "%$search%");
                    });

                $total = $filteredData->count();

                if ($show !== 'All') $filteredData = $filteredData->skip(($page - 1) * $show)->take($show);

                $filteredData = $filteredData->get();

                foreach ($filteredData as $item) {
                    $data[] = array_merge($item->toArray(), [
                        'user' => $item->user,
                        'plan' => $item->plan,
                    ]);
                }
                break;
        }

        return [
            'data' => $data,
            'total' => $total,
        ];
    }

    //
    public function index()
    {
        $data = $this->get('plans');

        $plans = $data['data'];
        $total = $data['total'];

        return response()->json([
            'plans' => $plans,
            'total' => $total,
        ]);
    }

    public function details()
    {
        $data = $this->get('details');

        $plans = $data['data'];
        $total = $data['total'];

        return response()->json([
            'plans' => $plans,
            'total' => $total,
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
        $plan_user_id = PlanUser::whereCode($code)->first()->toArray()['id'];

        Deposit::create([
            'user_id' => $user->id,
            'method_id' => Method::whereSlug('admin')->first()->id,
            'amount' => $plan->price,
            'status' => 2,
            'fees' => 0,
            'type' => 'plan',
            'data' => json_encode(['plan_user_id' => $plan_user_id])
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

        $code = Plan::code();
        $purchase = PlanUser::create([
            'plan_id' => $plan->id,
            'user_id' => $user->id,
            'points' => $request->points,
            'code' => $code,
            'expiry_date' => Carbon::now()->addWeeks($plan->validity)
        ]);
        $plan_user_id = PlanUser::whereCode($code)->first()->toArray()['id'];
        Deposit::create([
            'user_id' => $user->id,
            'method_id' => Method::whereSlug('admin')->first()->id,
            'amount' => $plan->price,
            'status' => 2,
            'fees' => 0,
            'type' => 'plan',
            'data' => json_encode(['plan_user_id' => $plan_user_id])
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
