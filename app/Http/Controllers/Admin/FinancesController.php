<?php

namespace App\Http\Controllers\Admin;

use App\Deposit;
use App\Http\Controllers\Controller;
use App\Method;
use App\Notifications\Deposit as NotificationsDeposit;
use App\Transaction;
use App\User;
use Illuminate\Http\Request;

class FinancesController extends Controller
{
    //
    public function sales_report()
    {
        $salesReport = [];
        foreach (Transaction::all() as $transaction) {
            $salesReport[] = array_merge($transaction->toArray(), [
                'transactionable' => $transaction->transactionable,
                'plan' => $transaction->plan,
            ]);
        }

        return response()->json([
            'salesReport' => $salesReport
        ]);
    }

    public function index()
    {
        $deposits = [];
        foreach (Deposit::all() as $deposit) {
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
            'method_id' => Method::where('name', 'Admin')->first()->id,
            'amount' => $request->amount,
            'user_id' => $user->id,
            'fees' => 0,
            'status' => 2
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
