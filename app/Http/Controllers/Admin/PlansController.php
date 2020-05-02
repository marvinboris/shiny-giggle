<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Plan;
use Illuminate\Http\Request;

class PlansController extends Controller
{
    //
    public function index()
    {
        return response()->json([
            'plans' => Plan::get()
        ]);
    }
}
