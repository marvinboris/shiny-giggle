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
            'contacts' => request()->user()->contact_us
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'contact' => request()->user()->contact_us()->find($id)->toArray()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string',
            'subject' => 'required|string',
            'message' => 'required|string',
        ]);
        $file = $request->file('file');
        $input = null;
        if ($file) {
            $fileName = time() . $file->getClientOriginalName();
            $file->move('contact-us', $fileName);
            $input = htmlspecialchars($fileName);
        }
        ContactUs::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'subject' => $request->subject,
            'message' => $request->message,
            'feedback' => '',
            'file' => $input
        ]);
        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successfully submitted form.'
            ],
        ], 201);
    }
}
