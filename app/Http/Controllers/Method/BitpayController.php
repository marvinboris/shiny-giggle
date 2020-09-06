<?php

namespace App\Http\Controllers\Method;

use App\Deposit;
use App\Guest;
use App\Http\Controllers\Controller;
use App\Http\Controllers\UtilController;
use App\Method;
use App\Plan;
use App\PlanUser;
use App\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Vrajroham\LaravelBitpay\LaravelBitpay;

class BitpayController extends Controller
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

        $payload['link'] = route('bitpay.proceed') . '?hash=' . $hash;

        return $payload;
    }

    public function proceed(Request $request)
    {
        $data = Crypt::decrypt($request->hash);

        $user = $data['user'];
        $type = $data['type'];
        $plan_id = $data['plan_id'];
        $plan_name = $data['plan_name'];
        $amount = $data['amount'];

        $method = Method::whereSlug('bitcoin')->first();
        $bitcoin = Deposit::create([
            'user_id' => $user->id,
            'method_id' => $method->id,
            'amount' => $amount,
            'status' => 1,
            'type' => $type,
        ]);

        // Create instance of invoice
        $invoice = LaravelBitpay::Invoice();

        // Set item details (Only 1 item)
        $invoice->setItemDesc($plan_name);
        $invoice->setItemCode($plan_id);
        $invoice->setPrice($amount);

        // Please make sure you provide unique orderid for each invoice
        $invoice->setOrderId($bitcoin->id); // E.g. Your order number

        // Create Buyer Instance
        $buyer = LaravelBitpay::Buyer();
        $buyer->setName($user->name());
        $buyer->setEmail($user->email);
        $buyer->setAddress1($user->phone);
        $buyer->setNotify(true);

        // Add buyer to invoice
        $invoice->setBuyer($buyer);

        // Set currency
        $invoice->setCurrency('USD');

        // Set redirect url to get back after completing the payment. GET Request
        $invoice->setRedirectURL(route('bitpay.notify.get'));

        // Optional config. setNotificationUrl()
        // By default, package handles webhooks and dispatches BitpayWebhookReceived event as described above.
        // If you want to handle webhooks your way, you can provide url below. 
        // If handled manually, BitpayWebhookReceived event will not be dispatched.    
        // $invoice->setNotificationUrl('Your custom POST route to handle webhooks');

        // Create invoice on bitpay server.
        $invoice = LaravelBitpay::createInvoice($invoice);

        // You can save invoice ID from server, for your your reference
        $invoiceId = $invoice->getId();

        $bitcoin->update(['data' => json_encode([
            'invoice_id' => $invoiceId,
            'plan_id' => $plan_id
        ])]);

        $paymentUrl = $invoice->getUrl();
        // Redirect user to following URL for payment approval.
        return redirect()->to($paymentUrl);
    }

    public function notify(Request $request)
    {
        dd($request->all());

        $input = $request->all();
        foreach ($input as $key => $value) {
            $input[$key] = htmlspecialchars($value);
        }

        $bitpay = Deposit::where('data->invoice_id', $input['invoice_id'])->first();

        $user = $bitpay->user;
        $initalStatus = $bitpay->status;
        $bitpay->update([
            'status' => $request->status === 'confirmed' ? 2 : 1,
        ]);

        $type = $bitpay->type;
        $plan_id = $bitpay->data->plan_id;
        $plan = Plan::find($plan_id);

        if ($initalStatus === 0 && $request->status === 'confirmed') {
            $code = Plan::code();
            PlanUser::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'points' => $plan->points,
                'code' => $code,
                'expiry_date' => Carbon::now()->addWeeks($plan->validity)
            ]);
            $plan_user_id = PlanUser::whereCode($code)->first()->toArray()['id'];

            $data = (array) $bitpay->data;

            if ($type === 'plan') {
                $data['plan_user_id'] = $plan_user_id;
            }

            $bitpay->update([
                'data' => json_encode($data),
            ]);

            return redirect('/user/subscription/plans?status=1&code=' . $code);
        }

        return redirect('/plans/' . $plan->slug . '/payment/btc');
    }
}
