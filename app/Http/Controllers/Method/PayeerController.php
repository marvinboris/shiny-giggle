<?php

namespace App\Http\Controllers\Method;

use App\Deposit;
use App\Http\Controllers\Controller;
use App\Method;
use Illuminate\Http\Request;

class PayeerController extends Controller
{
    public static function generateWidgetData($input)
    {
        $request = request();

        $payload = [
            'status' => 'success',
            'link' => null
        ];

        $user = $request->user();
        $method = Method::whereSlug('payeer')->first();
        $payeer = Deposit::create([
            'user_id' => $user->id,
            'method_id' => $method->id,
            'amount' => $input['amount'],
            'status' => 0,
            'type' => $input['type'] ?? 'plan',
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
        $m_amount = $input['amount'];
        $m_curr = 'USD';
        $m_desc = 'limocalc.com - ' . $payeer->id . ' - ' . $input['plan_name'];

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
            $payload['link'] = $response->url;
        } else {
            $payload['status'] = 'failure';
            $payload['link'] = 'Error during the process, please retry.';
        }

        return $payload;
    }
}
