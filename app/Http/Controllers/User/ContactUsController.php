<?php

namespace App\Http\Controllers\User;

use App\ContactUs;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactUsController extends Controller
{
    //
    public function index()
    {
        return response()->json([
            'messages' => request()->user()->contact_us
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);
        ContactUs::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'subject' => $request->subject,
            'message' => $request->message,
            'feedback' => ''
        ]);
        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successfully submitted form.'
            ],
        ], 201);
    }
}
