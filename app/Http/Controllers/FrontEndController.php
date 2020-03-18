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
                'customer' => url('api/user/login'),
                'guest' => url('api/guest/login'),
                'non-customer' => 'https://www.liyeplimal.net/registration/?ref=',
            ]
        ]);
    }
}
