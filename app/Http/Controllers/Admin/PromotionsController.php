<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Plan;
use App\Promotion;
use Illuminate\Http\Request;

class PromotionsController extends Controller
{
    private function data()
    {
        $page = +request()->page;
        $show = request()->show;
        $search = request()->search;

        $total = 0;

        $promotions = [];
        $filteredData = Promotion::latest();

        $filteredData = $filteredData
            ->when($search, function ($query, $search) {
                if ($search !== "")
                    $query
                        ->where('start_time', 'LIKE', "%$search%")
                        ->orWhere('end_time', 'LIKE', "%$search%");
            });

        $total = $filteredData->count();

        if ($show !== 'All') $filteredData = $filteredData->skip(($page - 1) * $show)->take($show);

        $filteredData = $filteredData->get();

        foreach ($filteredData as $promotion) {
            $promotions[] = $promotion->toArray() + [];
        }

        return [
            'promotions' => $promotions,
            'total' => $total,
        ];
    }


    //
    public function  index()
    {
        $data = $this->data();

        $promotions = $data['promotions'];
        $total = $data['total'];

        return response()->json([
            'promotions' => $promotions,
            'total' => $total,
        ]);
    }

    public function info()
    {
        $plans = [];
        foreach (Plan::all() as $plan) {
            $plans[] = array_merge($plan->toArray(), []);
        }

        $statuses = [
            [
                'name' => 'Active',
                'value' => 1,
            ],
            [
                'name' => 'Inactive',
                'value' => 0,
            ],
        ];

        return response()->json([
            'plans' => $plans,
            'statuses' => $statuses,
        ]);
    }

    public function show($id)
    {
        $promotion = Promotion::find($id);
        if (!$promotion) return response()->json([
            'message' => [
                'type' => 'danger',
                'content' => 'Promotion not found.'
            ]
        ], 404);

        $promotionPlans = [];
        foreach ($promotion->plans as $plan) {
            $promotionPlans[] = $plan->id;
        }

        $promotion = array_merge($promotion->toArray(), [
            'plans' => $promotionPlans
        ]);

        $plans = [];
        foreach (Plan::all() as $plan) {
            $plans[] = array_merge($plan->toArray(), []);
        }

        $statuses = [
            [
                'name' => 'Active',
                'value' => 1,
            ],
            [
                'name' => 'Inactive',
                'value' => 0,
            ],
        ];

        return response()->json([
            'promotion' => $promotion,
            'plans' => $plans,
            'statuses' => $statuses,
        ]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after:start_time',
            'status' => 'required|numeric',
            'plans.*' => 'required|exists:plans,id',
        ]);

        $input = $request->all();

        $promotion = Promotion::create($input);

        $promotion->plans()->sync($request->plans);

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successful created promotion.'
            ]
        ]);
    }


    public function update(Request $request, $id)
    {
        $request->validate([
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after:start_time',
            'status' => 'required|numeric',
            'plans.*' => 'required|exists:plans,id',
        ]);
        $promotion = Promotion::find($id);
        if (!$promotion) return response()->json([
            'message' => [
                'type' => 'danger',
                'content' => 'Promotion not found.'
            ]
        ], 404);

        $input = $request->all();

        $promotion->update($input);

        $promotion->plans()->sync($request->plans);

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successful updated promotion.'
            ]
        ]);
    }

    public function destroy($id)
    {
        $promotion = Promotion::find($id);
        if (!$promotion) return response()->json([
            'message' => [
                'type' => 'danger',
                'content' => 'Promotion not found.'
            ]
        ], 404);

        $promotion->delete();

        $data = $this->data();

        $promotions = $data['promotions'];
        $total = $data['total'];

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successfully deleted promotion.'
            ],
            'promotions' => $promotions,
            'total' => $total,
        ], 201);
    }
}
