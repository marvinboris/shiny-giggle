<?php

namespace App\Http\Controllers\User;

use App\ContactUs;
use App\Http\Controllers\Controller;
use App\Http\Controllers\UtilController;
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
        $filteredContacts = UtilController::user(request()->user())->contact_us()->latest();

        $filteredContacts = $filteredContacts
            ->when($search, function ($query, $search) {
                if ($search !== "")
                    $query
                        ->where('title', 'LIKE', "%$search%")
                        ->orWhere('subject', 'LIKE', "%$search%")
                        ->orWhere('message', 'LIKE', "%$search%");
            });

        $total = $filteredContacts->count();

        if ($show !== 'All') $filteredContacts = $filteredContacts->skip(($page - 1) * $show)->take($show);

        $filteredContacts = $filteredContacts->get();

        foreach ($filteredContacts as $contact) {
            $contacts[] = array_merge($contact->toArray(), []);
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
            'contact' => UtilController::user(request()->user())->contact_us()->find($id)->toArray()
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
            'user_id' => UtilController::user($request->user())->id,
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
