<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class FrontEndController extends Controller
{
    //
    public function home()
    {
        return response()->json([
            'links' => [
                'customer' => route('user.login'),
                'guest' => route('guest.login'),
                'non-customer' => 'https://www.liyeplimal.net/registration/?ref=5AS7AW',
            ]
        ]);
    }
}
