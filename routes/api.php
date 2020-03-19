<?php

use Illuminate\Http\Request;
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

Route::namespace('Guest')->prefix('guest')->name('guest.')->group(function () {
    Route::post('login', 'AuthController@login')->name('login');

    Route::middleware('auth:outer')->group(function () {
        Route::get('logout', 'AuthController@logout')->name('logout');
        Route::get('user', 'AuthController@user')->name('user');
    });
});

Route::namespace('User')->prefix('user')->name('user.')->group(function () {
    Route::post('login', 'AuthController@login')->name('login');
    // Route::post('signup', 'AuthController@signup');

    Route::middleware('auth:api')->group(function () {
        Route::get('logout', 'AuthController@logout')->name('logout');
        Route::get('user', 'AuthController@user')->name('user');
    });
});

Route::get('home', 'FrontEndController@home')->name('home');

Route::middleware('auth:outer')->group(function () {
    Route::get('plans', 'PlansController@index');
    Route::get('plans/{plan}/payment', 'PlansController@payment')->name('plans.payment');
    Route::post('plans/{plan}/payment/{method}', 'PlansController@confirm')->name('plans.payment.confirm');
    Route::get('calculate', 'PlansController@getCalculate');
    Route::post('calculate', 'PlansController@calculate');
});

Route::namespace('Method')->group(function () {
    Route::get('monetbil/notify', 'MonetbilController@notify')->name('monetbil.notify.get');
    Route::post('monetbil/notify', 'MonetbilController@notify')->name('monetbil.notify.post');
});