<?php

namespace App\Http\Controllers\Admin;

use App\Deposit;
use App\Http\Controllers\Controller;
use App\LimoPayment;
use App\Method;
use App\Notifications\Deposit as NotificationsDeposit;
use App\Notifications\LimoPaymentStatus;
use App\Plan;
use App\PlanUser;
use App\Transaction;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;

class FinancesController extends Controller
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
            case 'sales_report':
                $filteredData = Deposit::latest();

                $filteredData = $filteredData
                    ->join('users', 'users.id', '=', 'deposits.user_id')
                    ->select('deposits.*')
                    ->when($search, function ($query, $search) {
                        if ($search !== "")
                            $query
                                ->where('type', 'LIKE', "%$search%")
                                ->orWhere('first_name', 'LIKE', "%$search%")
                                ->orWhere('last_name', 'LIKE', "%$search%")
                                ->orWhere('ref', 'LIKE', "%$search%");
                    });

                $total = $filteredData->count();

                if ($show !== 'All') $filteredData = $filteredData->skip(($page - 1) * $show)->take($show);

                $filteredData = $filteredData->get();

                foreach ($filteredData as $item) {
                    if ($item->user) {
                        $object = array_merge($item->toArray(), [
                            'user' => $item->user,
                            'method' => $item->method,
                        ]);
                        if ($item->type === 'plan' && $item->status === 2) {
                            $plan_user = PlanUser::find($item->data->plan_user_id);
                            if (!$plan_user) dd($item->id);
                            $object = array_merge($object, [
                                'plan' => $plan_user->plan,
                                'code' => $plan_user->code
                            ]);
                        }
                        $data[] = $object;
                    }
                }
                break;

            case 'limo_payments':
                $filteredData = LimoPayment::latest();

                $filteredData = $filteredData
                    // ->join('users', 'users.id', '=', 'limo_payments.user_id')
                    // ->select('limo_payments.*')
                    ->when($search, function ($query, $search) {
                        if ($search !== "")
                            $query
                                ->where('name', 'LIKE', "%$search%")
                                ->orWhere('limo_id', 'LIKE', "%$search%");
                    });

                $total = $filteredData->count();

                if ($show !== 'All') $filteredData = $filteredData->skip(($page - 1) * $show)->take($show);

                $filteredData = $filteredData->get();

                foreach ($filteredData as $item) {
                    $data[] = array_merge($item->toArray(), [
                        'user' => $item->user
                    ]);
                }
                break;

            case 'credits':
                $filteredData = Deposit::whereType('credits')->latest();

                $filteredData = $filteredData
                    ->join('users', 'users.id', '=', 'deposits.user_id')
                    ->join('methods', 'methods.id', '=', 'deposits.method_id')
                    ->select('deposits.*')
                    ->when($search, function ($query, $search) {
                        if ($search !== "")
                            $query
                                ->where('name', 'LIKE', "%$search%")
                                ->where('first_name', 'LIKE', "%$search%")
                                ->where('last_name', 'LIKE', "%$search%")
                                ->orWhere('ref', 'LIKE', "%$search%");
                    });

                $total = $filteredData->count();

                if ($show !== 'All') $filteredData = $filteredData->skip(($page - 1) * $show)->take($show);

                $filteredData = $filteredData->get();

                foreach ($filteredData as $item) {
                    $data[] = array_merge($item->toArray(), [
                        'user' => $item->user,
                        'method' => $item->method,
                    ]);
                }
                break;
        }

        return [
            'data' => $data,
            'total' => $total,
        ];
    }


    public function sales_report()
    {
        $data = $this->get('sales_report');

        $salesReport = $data['data'];
        $total = $data['total'];

        return response()->json([
            'salesReport' => $salesReport,
            'total' => $total,
        ]);
    }

    public function limo_payments()
    {
        $data = $this->get('limo_payments');

        $limoPayments = $data['data'];
        $total = $data['total'];

        return response()->json([
            'limoPayments' => $limoPayments,
            'total' => $total,
        ]);
    }

    public function limo_payment($id)
    {
        $limoPayment = LimoPayment::find($id);
        if (!$limoPayment) return response()->json([
            'message' => [
                'type' => 'danger',
                'content' => 'Payment not found.'
            ]
        ], 404);

        return response()->json([
            'limoPayment' => $limoPayment
        ]);
    }

    public function limo_payment_edit(Request $request, $id)
    {
        $limoPayment = LimoPayment::find($id);
        if (!$limoPayment) return response()->json([
            'message' => [
                'type' => 'danger',
                'content' => 'Payment not found.'
            ]
        ], 404);
        // $user = User::find($limoPayment->user_id);
        $user = $limoPayment->user;
        $initalStatus = $limoPayment->status;
        $limoPayment->update([
            'status' => +$request->status,
            // 'feedback' => $request->feedback
        ]);
        if ($initalStatus === 0 && +$request->status === 2) {
            $plan = Plan::wherePrice($limoPayment->amount)->first();

            $code = Plan::code();
            PlanUser::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'points' => $plan->points,
                'code' => $code,
                'expiry_date' => Carbon::now()->addWeeks($plan->validity)
            ]);
            $plan_user_id = PlanUser::whereCode($code)->first()->toArray()['id'];
            Deposit::create([
                'user_id' => $user->id,
                'method_id' => Method::whereSlug('limo')->first()->id,
                'amount' => $limoPayment->amount,
                'status' => 2,
                'fees' => 0,
                'type' => 'plan',
                'data' => json_encode(['plan_user_id' => $plan_user_id])
            ]);
            $user->notify(new LimoPaymentStatus($limoPayment));
        }

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successfully updated payment status.'
            ]
        ]);
    }

    public function index()
    {
        $data = $this->get('credits');

        $deposits = $data['data'];
        $total = $data['total'];

        return response()->json([
            'deposits' => $deposits,
            'total' => $total,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
        $request->validate([
            'ref' => 'required|exists:users',
            'amount' => 'required|numeric',
        ]);

        $user = User::where('ref', $request->ref)->first();

        $deposit = Deposit::create([
            'method_id' => Method::whereName('Admin')->first()->id,
            'amount' => $request->amount,
            'user_id' => $user->id,
            'fees' => 0,
            'status' => 2,
            'type' => 'credits'
        ]);

        $user->update(['credits' => $user->credits + $request->amount]);
        $user->notify(new NotificationsDeposit($deposit));

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successful deposit.'
            ]
        ]);
    }
}
