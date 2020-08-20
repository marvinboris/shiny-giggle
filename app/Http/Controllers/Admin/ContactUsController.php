<?php

namespace App\Http\Controllers\Admin;

use App\ContactUs;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ContactUsController extends Controller
{
    private function get()
    {
        $page = +request()->page;
        $show = request()->show;
        $search = request()->search;

        $total = 0;

        $contacts = [];
        $filteredContacts = ContactUs::latest();

        $filteredContacts = $filteredContacts
            ->when($search, function ($query, $search) {
                if ($search !== "")
                    $query
                        ->where('title', 'LIKE', "%$search%")
                        ->orWhere('subject', 'LIKE', "%$search%")
                        ->orWhere('feedback', 'LIKE', "%$search%")
                        ->orWhere('message', 'LIKE', "%$search%");
            });

        $total = $filteredContacts->count();

        if ($show !== 'All') $filteredContacts = $filteredContacts->skip(($page - 1) * $show)->take($show);

        $filteredContacts = $filteredContacts->get();

        foreach ($filteredContacts as $contact) {
            $contacts[] = array_merge($contact->toArray(), [
                'user' => $contact->user
            ]);
        }

        return [
            'contacts' => $contacts,
            'total' => $total,
        ];
    }

    //
    public function index()
    {
        $data = $this->get();

        $contacts = $data['contacts'];
        $total = $data['total'];

        return response()->json([
            'contacts' => $contacts,
            'total' => $total,
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
