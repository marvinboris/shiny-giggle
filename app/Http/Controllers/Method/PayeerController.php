<?php

namespace App\Http\Controllers\Method;

use App\Deposit;
use App\Http\Controllers\Controller;
use App\Http\Controllers\UtilController;
use App\Method;
use App\Plan;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class PayeerController extends Controller
{
    public static function generateWidgetData($input)
    {
        $user = UtilController::user(request()->user());

        $payload = [
            'status' => 'success',
            'link' => null
        ];

        $hash = Crypt::encrypt([
            'user' => $user,
            'amount' => $input['amount'],
            'plan_id' => $input['plan_id'],
            'plan_name' => $input['plan_name'],
            'type' => $input['type'] ?? 'plan',
        ]);

        $payload['link'] = route('payeer.proceed') . '?hash=' . $hash;

        return $payload;
    }

    public function proceed(Request $request)
    {
        $data = Crypt::decrypt($request->hash);

        $payload = [
            'status' => 'success',
            'link' => null
        ];

        $user = $data['user'];
        $type = $data['type'];
        $plan_id = $data['plan_id'];
        $plan_name = $data['plan_name'];
        $amount = $data['amount'];

        $plan = Plan::find($plan_id);

        $method = Method::whereSlug('payeer')->first();
        $payeer = Deposit::create([
            'user_id' => $user->id,
            'method_id' => $method->id,
            'amount' => $amount,
            'status' => 1,
            'type' => $type,
        ]);

        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, "https://payeer.com/ajax/api/api.php?invoiceCreate");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);

        curl_setopt($ch, CURLOPT_POST, TRUE);

        $account = env('PAYEER_ACCOUNT');
        $apiId = env('PAYEER_API_ID');
        $apiPass = env('PAYEER_API_PASS');
        $action = 'invoiceCreate';
        $lang = 'en';
        $m_shop = env('PAYEER_MERCHANT_ID');
        $m_orderid = $payeer->id;
        $m_amount = $amount;
        $m_curr = 'USD';
        $m_desc = 'limocalc.com - ' . $payeer->id . ' - ' . $plan_name;

        curl_setopt(
            $ch,
            CURLOPT_POSTFIELDS,
            'account=' . $account .
                '&apiId=' . $apiId .
                '&apiPass=' . $apiPass .
                '&action=' . $action .
                '&lang=' . $lang .
                '&m_shop=' . $m_shop .
                '&m_orderid=' . $m_orderid .
                '&m_amount=' . $m_amount .
                '&m_curr=' . $m_curr .
                '&m_desc=' . $m_desc
        );

        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Content-Type: application/x-www-form-urlencoded"
        ]);

        $response = curl_exec($ch);
        curl_close($ch);

        $response = json_decode($response);

        if (+$response->auth_error === 0) {
            // User will be redirected to complete their payment
            return $response->url;
        }

        $payload['status'] = 'failure';
        $payload['link'] = implode(". ", $response->errors);

        return redirect('/plans/' . $plan->slug . '/payment/mobile');
    }
}
