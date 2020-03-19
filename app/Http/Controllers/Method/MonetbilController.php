<?php

namespace App\Http\Controllers\Method;

use App\Guest;
use App\User;
use App\Transaction;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Plan;
use Illuminate\Support\Facades\Auth;

class MonetbilController extends Controller
{
    protected static $settings;

    public function __construct()
    {
        self::$settings = [
            'vendor' => 'monetbil',
            'base_url' => 'https://api.monetbil.com/widget/v2.1/',
            'apikey' => env('MONETBIL_SERVICE_KEY'),
        ];
    }

    /**
     * Generate data necessary for the widget
     * @param Array
     * @return Array
     */
    public static function generateWidgetData($input)
    {
        $payload = [
            'status' => 'success',
            'link' => null
        ];

        $user = request()->user();

        $json = [
            'amount' => $input['amount'] * 620,
            'item_ref' => $input['plan_id'],
            'payment_ref' => time(),
            'country' => 'XAF',
            // 'logo' => asset('/images/Groupe 130@2x.png'),
            'email' => $user->email,
            'country' => 'CM',
            'return_url' => route('monetbil.notify.get')
        ];

        $client = new Client();

        $response = $client->request('POST', self::$settings['base_url'] . self::$settings['apikey'], [
            'headers' => [
                'Content-Type' => 'application/x-www-form-urlencoded'
            ],
            'form_params' => $json
        ]);

        $response = json_decode($response->getBody()->getContents());

        if (1 === +$response->success) {
            // User will be redirected to complete their payment
            $payload['link'] = $response->payment_url;
        } else {
            $payload['status'] = 'failure';
            $payload['link'] = 'Error during the process, please retry.';
        }

        return $payload;
    }

    /**
     * Get notified about the transaction
     * @param Request
     * @return \Illuminate\Http\Response
     */
    public function notify(Request $request)
    {
        $input = $request->all();
        foreach ($input as $key => $value) {
            $input[$key] = htmlspecialchars($value);
        }

        $user = Guest::where('email', $input['email'])->first();
        if (!$user) $user = User::where('email', $input['email'])->first();

        if (!$user) {
            error_log('No user found !');
            die('No user found !');
        }

        $transaction = Transaction::where("tx_id", $input['payment_ref'])->first();

        $plan = Plan::findOrFail(+$request->item_ref);

        if (!$transaction) {
            $transaction = Transaction::create([
                'amount' => $plan->price,
                'tx_id' => $input['payment_ref'],
                'tx_hash' => $input['transaction_id'],
                'plan_id' => +$request->item_ref,
                'vendor' => 'monetbil',
                'method' =>  $request->operator ? $input['operator'] : 'MTN',
                'type' => 'deposit',
                'status' => 'pending',
                'currency' => 'USD',
                'address' => $input['phone']
            ]);
            $user->transactions()->save($transaction);
        }

        if ($request->currency) $transaction->currency = $input['currency'];
        if ($request->transaction_id) $transaction->tx_hash = $input['transaction_id'];

        $transaction->vendor = self::$settings['vendor'];

        if ($request->operator) $transaction->method = $input['operator'];
        if ($request->phone) $transaction->address = $input['phone'];
        if ($request->amount) $transaction->amount = $plan->amount;

        if ('success' === $input['status']) {
            $user->update(['plan_id' => $plan->id, 'points' => $plan->points]);
            $request->session()->flash('success', 'Successful transaction.');
            $transaction->status = 'completed';
        } else if ('cancelled' === $input['status']) {
            $request->session()->flash('danger', 'Transaction cancelled.');
            $transaction->status = $input['status'];
        } else if ('failed' === $input['status']) {
            $request->session()->flash('danger', 'Transaction failed.');
            $transaction->status = $input['status'];
        }

        $transaction->save();

        if ('success' === $input['status'])
            return redirect()
                ->url('/deposit');

        return redirect()
            ->url('/payment');
    }
}
