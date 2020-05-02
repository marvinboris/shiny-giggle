<?php

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
            Route::get('', 'UsersController@index')->name('index');
        });

        Route::prefix('finances')->name('finances.')->group(function () {
            Route::get('sales-report', 'FinancesController@sales_report')->name('sales-report');

            Route::prefix('credits')->name('credits.')->group(function () {
                Route::post('', 'FinancesController@store')->name('store');
                Route::get('', 'FinancesController@index')->name('index');
            });
        });

        Route::prefix('plans')->name('plans.')->group(function () {
            Route::get('', 'PlansController@index')->name('index');
        });
    });
});

Route::namespace('User')->prefix('user')->name('user.')->group(function () {
    Route::post('login', 'AuthController@login')->name('login');
    Route::post('signup', 'AuthController@signup')->name('signup');

    Route::middleware('auth:api')->group(function () {
        Route::get('dashboard', 'DashboardController@index')->name('dashboard');

        Route::prefix('calculate')->group(function () {
            Route::get('plans', 'CalculateController@userPlans');
            Route::get('{code}', 'CalculateController@getCalculateFromCode');
            Route::post('', 'CalculateController@makeCalculation');
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
        $role = $user->role();

        $data = $user->toArray();
        if ($role === 'user') $data = array_merge($data, ['plans' => $user->plans]);
        return response()->json(['data' => $data, 'role' => $role]);
    });

    Route::get('plans', 'PlansController@index');
    Route::get('plans/{plan}/payment', 'PlansController@payment')->name('plans.payment');
    Route::post('plans/{plan}/payment/{method}', 'PlansController@confirm')->name('plans.payment.confirm');
    Route::get('calculate', 'PlansController@getCalculate');
    Route::post('calculate', 'PlansController@makeCalculation');
});

Route::namespace('Method')->group(function () {
    Route::get('monetbil/notify', 'MonetbilController@notify')->name('monetbil.notify.get');
    Route::post('monetbil/notify', 'MonetbilController@notify')->name('monetbil.notify.post');
});
