<?php

namespace App\Http\Controllers\Method;

use App\Deposit;
use App\Guest;
use App\User;
use App\Transaction;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Method;
use App\Notifications\PlanUser as NotificationsPlanUser;
use App\Plan;
use App\PlanUser;
use Carbon\Carbon;
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
            // 'amount' => 1,
            'amount' => $input['amount'] * 620,
            'item_ref' => $input['plan_id'],
            'payment_ref' => time(),
            'country' => 'XAF',
            'logo' => asset('images/email/logo.png'),
            'email' => $user->email,
            'user' => $user->role(),
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

        $user = null;
        $role = $input['user'] ?? 'guest';
        if ($role === 'guest') $user = Guest::where('email', $input['email'])->first();
        else $user = User::where('email', $input['email'])->first();

        if (!$user) {
            error_log('No user found !');
            die('No user found !');
        }

        $transaction = Transaction::where("tx_id", $input['payment_ref'])->first();
        $deposit = null;

        $plan = Plan::findOrFail(+$request->item_ref);

        if (!$transaction) {
            $transaction = Transaction::create([
                'amount' => $plan->price,
                'tx_id' => $input['payment_ref'],
                'tx_hash' => $input['transaction_id'],
                'plan_id' => +$request->item_ref,
                'vendor' => 'monetbil',
                'method' =>  $request->operator ? $input['operator'] : 'MTN',
                'type' => 'plan',
                'status' => 'pending',
                'currency' => $request->currency ? $input['current'] : 'USD',
                'address' => $request->phone
            ]);
            $deposit = Deposit::create([
                'user_id' => $user->id,
                'method_id' => Method::whereSlug('mobile')->first()->id,
                'amount' => $plan->price,
                'status' => 0,
                'fees' => 0,
                'type' => $transaction->type
            ]);
            $user->transactions()->save($transaction);
        }

        if ($request->currency) $transaction->currency = $input['currency'];
        if ($request->transaction_id) $transaction->tx_hash = $input['transaction_id'];

        $transaction->vendor = self::$settings['vendor'];

        if ($request->operator) $transaction->method = $input['operator'];
        if ($request->phone) $transaction->address = $input['phone'];
        if ($request->amount) $transaction->amount = $plan->amount;

        $code = Plan::code();
        if ('success' === $input['status']) {
            if ($role === 'guest') $user->update(['plan_id' => $plan->id, 'plan_code' => $code, 'points' => $plan->points]);
            else {
                PlanUser::create([
                    'plan_id' => $plan->id,
                    'user_id' => $user->id,
                    'points' => $plan->points,
                    'code' => $code,
                    'expiry_date' => Carbon::now()->addWeeks($plan->validity)
                ]);
                $pivot = PlanUser::whereCode($code)->first();
                $plan_user_id = $pivot->toArray()['id'];
                $transaction->data = json_encode(['code' => $pivot->code]);
                $deposit->update([
                    'status' => 2,
                    'data' => json_encode(['plan_user_id' => $plan_user_id])
                ]);
                $user->notify(new NotificationsPlanUser($pivot));
            }
            $transaction->status = 'completed';
        } else $transaction->status = $input['status'];

        $transaction->save();

        if ('success' === $input['status'])
            return redirect('/user/subscription/plans?status=1&code=' . $code);

        return redirect('/plans/' . $plan->slug . '/payment/mobile');
    }
}
