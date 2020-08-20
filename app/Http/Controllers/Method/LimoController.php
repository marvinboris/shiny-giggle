<?php

namespace App\Http\Controllers\Method;

use App\Deposit;
use App\Http\Controllers\Controller;
use App\Http\Controllers\UtilController;
use App\LimoPayment;
use App\Method;
use App\Plan;
use App\PlanUser;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;

class LimoController extends Controller
{
    public static function generateWidgetData($input)
    {
        $amount = 0.01;
        // $amount = $input['amount'];
        $product_model = $input['type'];

        // Products List
        $products = array();
        $datapush = [
            'product_name' => $input['plan_name'],
            'product_qty' => $product_model === 'plan' ? 1 : $input['qty'], // leave it if not available
            'product_model' => $product_model, // leave it if not available
            'product_price' => $amount,
        ];

        //Push data here
        array_push($products, $datapush);
        $jsonencode_products = json_encode($products);

        $email = @$input['email'];
        $products = $jsonencode_products;
        $total_qty = $product_model === 'plan' ? 1 : $input['qty'];
        $total_price = $amount;
        $callback = route('limo.notify.get');
        $token = md5(@$email . @$product_model . time());
        $vhut = hash('sha256', "VXTNULL$token" . 'TaReQ');

        //set POST variables
        $url = "https://www.liyeplimal.net/limoney/authcheck";
        $fields = array(
            'email' => urlencode($email),
            'products' => urlencode($jsonencode_products),
            'total_qty' => urlencode($total_qty),
            'total_price' => urlencode($total_price),
            'callback' => urlencode($callback),
            'token' => urlencode($token),
            'domain' => urlencode('limocalc'), //limocalc 
        );

        $fields_string = '';
        //url-ify the data for the POST
        foreach ($fields as $key => $value) {
            $fields_string .= $key . '=' . $value . '&';
        }
        $fields_string = rtrim($fields_string, '&');

        //open connection
        $ch = curl_init();

        //set the url, number of POST vars, POST data
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HEADER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
        curl_setopt($ch, CURLOPT_POST, count($fields));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);

        //execute post
        curl_exec($ch);

        if (curl_errno($ch)) {
            $payload['status'] = 'failure';
            $payload['link'] = "Error: " . curl_error($ch);
        } else {
            $request = request();
            $user = UtilController::user($request->user());

            $hash = Crypt::encrypt([
                'user' => $user,
                'product_model' => $product_model,
                'plan_id' => $input['plan_id'],
                'vhut' => $vhut,
                'amount' => $amount,
                'link' => "https://www.liyeplimal.net/limoney/login/?token=$token",
            ]);

            // User will be redirected to complete their payment
            $payload['link'] = route('limo.proceed') . '?hash=' . $hash;
        }

        return $payload;
    }

    public function proceed()
    {
        $request = request();

        $hashData = Crypt::decrypt($request->hash);

        $user = $hashData['user'];
        $product_model = $hashData['product_model'];
        $plan_id = $hashData['plan_id'];
        $vhut = $hashData['vhut'];
        $amount = $hashData['amount'];
        $link = $hashData['link'];

        $data = [
            'type' => $product_model,
        ];

        if ($product_model === 'plan') $data['plan_id'] = $plan_id;

        LimoPayment::create([
            'user_id' => $user->id,
            'transfer_no' => time(),
            'date' => now(),
            'name' => $user->name(),
            'email' => $user->email,
            'limo_id' => $vhut,
            'amount' => $amount,
            'phone' => $user->phone,
            'status' => 0,
            'data' => json_encode($data)
        ]);

        return redirect($link);
    }

    public function notify(Request $request)
    {
        $input = $request->all();
        foreach ($input as $key => $value) {
            $input[$key] = htmlspecialchars($value);
        }

        $limoPayment = LimoPayment::where('limo_id', $input['vhut'])->first();

        $user = $limoPayment->user;
        $initalStatus = $limoPayment->status;
        $limoPayment->update([
            'status' => $request->success === 'true' ? 2 : 1,
            // 'feedback' => $request->feedback
        ]);

        $type = $limoPayment->data->type;
        $plan_id = $limoPayment->data->plan_id;
        $plan = Plan::find($plan_id);

        if ($initalStatus === 0 && $request->success === 'true') {
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

            $data = [
                'type' => $type,
            ];

            if ($type === 'plan') {
                $data['plan_id'] = $plan_id;
                $data['plan_user_id'] = $plan_user_id;
            }

            $limoPayment->update([
                'data' => json_encode($data),
            ]);

            return redirect('/user/subscription/plans?status=1&code=' . $code);
        }

        return redirect('/plans/' . $plan->slug . '/payment/mobile');
    }
}
