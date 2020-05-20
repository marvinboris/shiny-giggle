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
    //
    public function sales_report()
    {
        $salesReport = [];
        foreach (Deposit::all() as $transaction) {
            if ($transaction->user) {
                $object = array_merge($transaction->toArray(), [
                    'user' => $transaction->user,
                    'method' => $transaction->method,
                ]);
                if ($transaction->type === 'plan' && $transaction->status === 2) {
                    $plan_user = PlanUser::find($transaction->data->plan_user_id);
                    if (!$plan_user) dd($transaction->id);
                    $object = array_merge($object, [
                        'plan' => $plan_user->plan,
                        'code' => $plan_user->code
                    ]);
                }
                $salesReport[] = $object;
            }
        }

        return response()->json([
            'salesReport' => $salesReport
        ]);
    }

    public function limo_payments()
    {
        $limoPayments = [];
        foreach (LimoPayment::all() as $limoPayment) {
            $limoPayments[] = array_merge($limoPayment->toArray(), [
                'user' => $limoPayment->user
            ]);
        }

        return response()->json([
            'limoPayments' => $limoPayments
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
        $deposits = [];
        foreach (Deposit::whereType('credits')->get() as $deposit) {
            $deposits[] = array_merge($deposit->toArray(), [
                'user' => $deposit->user,
                'method' => $deposit->method,
            ]);
        }

        return response()->json([
            'deposits' => $deposits
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
