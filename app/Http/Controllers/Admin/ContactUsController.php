<?php

namespace App\Http\Controllers\Admin;

use App\ContactUs;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactUsController extends Controller
{
    //
    public function index()
    {
        $contacts = [];
        foreach (ContactUs::get() as $contact) {
            $contacts[] = array_merge($contact->toArray(), [
                'user' => $contact->user
            ]);
        }
        return response()->json([
            'contacts' => $contacts
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'contact' => ContactUs::find($id)->toArray()
        ]);
    }

    public function update(Request $request, $id)
    {
        $contact = ContactUs::find($id);
        $request->validate([
            'feedback' => 'required|string',
        ]);
        if (!$contact) return response()->json([
            'message' => [
                'type' => 'danger',
                'content' => 'Contact form not found.'
            ]
        ], 404);
        $input = $request->except('title', 'subject', 'message');
        $file = $request->file('admin_file');
        if ($file) {
            $fileName = time() . $file->getClientOriginalName();
            $file->move('contact-us', $fileName);
            $input['status'] = htmlspecialchars($fileName);
        }
        $input['status'] = 1;

        $contact->update($input);
        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successfully replied to contact form.'
            ],
        ], 201);
    }

    public function delete($id)
    {
        $contact = ContactUs::find($id);
        if ($contact->file) unlink(public_path() . $contact->file);
        if ($contact->admin_file) unlink(public_path() . $contact->admin_file);
        $contact->delete();

        $contacts = [];
        foreach (ContactUs::get() as $contact) {
            $contacts[] = array_merge($contact->toArray(), [
                'user' => $contact->user
            ]);
        }

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successfully deleted contact form.'
            ],
            'contacts' => $contacts
        ], 201);
    }
}
