<?php

use App\Admin;
use App\Deposit;
use App\Guest;
use App\LimoPayment;
use App\Method;
use App\PlanUser;
use App\Transaction;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:api')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::fallback(function () {
    return response()->json([
        'message' => 'Page Not Found'
    ], 404);
});

Route::middleware('web')->get('email/verify/{id}/{code}', function ($id, $code) {
    $user = User::findOrFail($id);
    if ($user->email_verified_at) {
        request()->session()->flash('already_verified', 'Account already activated. Please login.');
    } else {
        $string = $user->toJson();
        if ($string === Crypt::decryptString($code)) {
            $time = json_decode($string)->created_at;
            $now = time();
            if ($now - strtotime($time) < 24 * 60 * 60) {
                $user->email_verified_at = $now;
                request()->session()->flash('activated', 'Account activation successful.');
                $user->save();
            } else request()->session()->flash('not_verified', 'Your activation link has expired. Please, contact the administrator.');
        } else request()->session()->flash('not_verified', 'Your activation link is incorrect. Please, contact the administrator.');
    }

    return redirect('/auth/login');
});

Route::namespace('Guest')->prefix('guest')->name('guest.')->group(function () {
    Route::post('login', 'AuthController@login')->name('login');
    Route::post('signup', 'AuthController@signup')->name('signup');
});

Route::namespace('Admin')->prefix('admin')->name('admin.')->group(function () {
    Route::post('login', 'AuthController@login')->name('login');
    Route::post('resend', 'AuthController@resend')->name('resend');
    Route::post('verify', 'AuthController@verify')->name('verify');

    Route::middleware('auth:admin')->group(function () {
        Route::get('dashboard', 'DashboardController@index')->name('dashboard');

        Route::prefix('users')->name('users.')->group(function () {
            Route::post('{id}/delete', 'UsersController@delete')->name('delete');
            Route::post('{id}', 'UsersController@update')->name('update');
            Route::post('', 'UsersController@store')->name('store');
            Route::get('{id}', 'UsersController@show')->name('show');
            Route::get('', 'UsersController@index')->name('index');
        });

        Route::prefix('finances')->name('finances.')->group(function () {
            Route::get('sales-report', 'FinancesController@sales_report')->name('sales-report');

            Route::prefix('limo-payments')->name('limo-payments.')->group(function () {
                Route::post('{id}', 'FinancesController@limo_payment_edit')->name('update');
                Route::get('{id}', 'FinancesController@limo_payment')->name('show');
                Route::get('', 'FinancesController@limo_payments')->name('index');
            });

            Route::prefix('credits')->name('credits.')->group(function () {
                Route::post('', 'FinancesController@store')->name('store');
                Route::get('', 'FinancesController@index')->name('index');
            });
        });

        Route::prefix('plans')->name('plans.')->group(function () {
            Route::post('calculations', 'PlansController@calculations')->name('calculations');
            Route::post('deposit', 'PlansController@deposit')->name('deposit');
            Route::post('', 'PlansController@store')->name('store');
            Route::get('', 'PlansController@index')->name('index');
        });
    });
});

Route::namespace('User')->prefix('user')->name('user.')->group(function () {
    Route::post('login', 'AuthController@login')->name('login');
    Route::post('signup', 'AuthController@signup')->name('signup');

    Route::middleware('auth:api')->group(function () {
        Route::get('dashboard', 'DashboardController@index')->name('dashboard');

        Route::prefix('calculate')->name('calculate.')->group(function () {
            Route::get('plans', 'CalculateController@userPlans')->name('plans');
            Route::get('{code}', 'CalculateController@getCalculateFromCode')->name('get');
            Route::post('', 'CalculateController@makeCalculation')->name('post');
        });
    });
});

Route::middleware('auth:admin,api,outer')->group(function () {
    Route::get('logout', function () {
        request()->user()->token()->revoke();
        return response()->json([
            'message' => 'Successfully logged out.'
        ]);
    })->name('logout');

    Route::get('user', function () {
        $user = request()->user();
        switch ($user->token()->name) {
            case 'User Personal Access Token':
                $user = User::find($user->id);
                break;
            case 'Admin Personal Access Token':
                $user = Admin::find($user->id);
                break;
            case 'Guest Personal Access Token':
                $user = Guest::find($user->id);
                break;
        }

        $role = $user->role();

        $data = array_merge($user->toArray(), [
            'notifications' => $user->unreadNotifications()->latest()->limit(5)->get(),
        ]);
        if ($role === 'user') $data = array_merge($data, ['plans' => $user->plans]);
        return response()->json(['data' => $data, 'role' => $role]);
    });

    Route::prefix('notifications')->name('notifications.')->group(function () {
        Route::get('', function () {
            $user = request()->user();
            switch ($user->token()->name) {
                case 'User Personal Access Token':
                    $user = User::find($user->id);
                    break;
                case 'Admin Personal Access Token':
                    $user = Admin::find($user->id);
                    break;
                case 'Guest Personal Access Token':
                    $user = Guest::find($user->id);
                    break;
            }

            $notifications = [];
            foreach ($user->notifications()->latest()->get() as $notification) {
                $notifications[] = array_merge($notification->toArray(), [
                    'data' => $notification->data
                ]);
            }

            return response()->json([
                'notifications' => $notifications
            ]);
        })->name('index');

        Route::get('{notification}', function ($id) {
            $user = request()->user();
            switch ($user->token()->name) {
                case 'User Personal Access Token':
                    $user = User::find($user->id);
                    break;
                case 'Admin Personal Access Token':
                    $user = Admin::find($user->id);
                    break;
                case 'Guest Personal Access Token':
                    $user = Guest::find($user->id);
                    break;
            }

            $notification = $user->notifications()->find($id);
            $notification->markAsRead();
            return response()->json([
                'notification' => $notification
            ]);
        })->name('show');
    });

    Route::name('export.')->prefix('export')->group(function () {
        Route::name('xlsx')->post('xlsx', 'ExportController@xlsx');
        Route::name('csv')->post('csv', 'ExportController@csv');
        Route::name('pdf')->post('pdf', 'ExportController@pdf');
    });

    Route::get('plans', 'PlansController@index');
    Route::get('plans/{plan}/payment', 'PlansController@payment')->name('plans.payment');
    Route::post('plans/payment/limo', 'PlansController@limo')->name('plans.payment.limo');
    Route::post('plans/{plan}/payment/{method}', 'PlansController@confirm')->name('plans.payment.confirm');
    Route::get('calculate', 'PlansController@getCalculate')->name('calculate.get');
    Route::post('calculate', 'PlansController@makeCalculation')->name('calculate.post');
});

Route::namespace('Method')->group(function () {
    Route::get('monetbil/notify', 'MonetbilController@notify')->name('monetbil.notify.get');
    Route::post('monetbil/notify', 'MonetbilController@notify')->name('monetbil.notify.post');
});



Route::get('limo-payments-update', function () {
    $plan_users = PlanUser::get();
    foreach (LimoPayment::get() as $limo_payment) {
        foreach ($plan_users as $plan_user) {
            $created_at = $plan_user->created_at->timestamp;
            $updated_at = $limo_payment->updated_at->timestamp;
            if ($created_at >= $updated_at && $created_at <= $limo_payment->updated_at->addSeconds(10)->timestamp) $limo_payment->update(['data' => json_encode(['plan_user_id' => $plan_user->id])]);
        }
    }
});

Route::get('deposits-update', function () {
    $methods = [];
    foreach (Method::get() as $method) {
        $methods[$method->slug] = $method->id;
    }

    $transactionStatuses = [
        'completed' => 2,
        'failure' => 1,
        'pending' => 0
    ];
    foreach (Transaction::get() as $transaction) {
        $plan_user = PlanUser::whereCode($transaction->data->code)->first();
        $deposit = Deposit::where('data', json_encode(['plan_user_id' => $plan_user->id]))->first();
        if (!$deposit) Deposit::create([
            'user_id' => $transaction->transactionable_id,
            'method_id' => $methods['mobile'],
            'amount' => $transaction->amount,
            'status' => $transactionStatuses[$transaction->status],
            'type' => $transaction->type,
            'data' => json_encode(['plan_user_id' => $plan_user->id])
        ]);
    }

    foreach (LimoPayment::get() as $transaction) {
        $plan_user = PlanUser::find($transaction->data->plan_user_id);
        $deposit = Deposit::where('data', json_encode(['plan_user_id' => $plan_user->id]))->first();
        if (!$deposit) Deposit::create([
            'user_id' => $transaction->user_id,
            'method_id' => $methods['limo'],
            'amount' => $transaction->amount,
            'status' => $transaction->status + 1,
            'type' => $transaction->type,
            'data' => json_encode(['plan_user_id' => $plan_user->id])
        ]);
    }

    foreach (PlanUser::get() as $plan_user) {
        $deposit = Deposit::where('data', json_encode(['plan_user_id' => $plan_user->id]))->first();
        if (!$deposit) Deposit::create([
            'user_id' => $plan_user->user_id,
            'method_id' => $methods['admin'],
            'amount' => $plan_user->plan->price,
            'status' => 2,
            'type' => 'plan',
            'data' => json_encode(['plan_user_id' => $plan_user->id])
        ]);
    }
    dd([
        'plan_user' => count(PlanUser::get()),
        'deposit' => count(Deposit::get()),
    ]);
});

Route::get('test', 'Admin\FinancesController@sales_report');
