<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    private function get()
    {
        $page = +request()->page;
        $show = request()->show;
        $search = request()->search;

        $total = 0;

        $users = [];
        $filteredUsers = User::latest();

        $filteredUsers = $filteredUsers
            ->when($search, function ($query, $search) {
                if ($search !== "")
                    $query
                        ->where('email', 'LIKE', "%$search%")
                        ->orWhere('phone', 'LIKE', "%$search%")
                        ->orWhere('first_name', 'LIKE', "%$search%")
                        ->orWhere('last_name', 'LIKE', "%$search%")
                        ->orWhere('ref', 'LIKE', "%$search%");
            });

        $total = $filteredUsers->count();

        if ($show !== 'All') $filteredUsers = $filteredUsers->skip(($page - 1) * $show)->take($show);

        $filteredUsers = $filteredUsers->get();

        foreach ($filteredUsers as $user) {
            $users[] = array_merge($user->toArray(), []);
        }

        return [
            'users' => $users,
            'total' => $total,
        ];
    }


    //
    public function  index()
    {
        $data = $this->get();

        $users = $data['users'];
        $total = $data['total'];

        return response()->json([
            'totalUsers' => $users,
            'total' => $total,
        ]);
    }

    public function show($id)
    {
        return response()->json([
            'user' => User::find($id)->toArray()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'username' => 'required|string|unique:users|alpha_dash',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|confirmed',
            'country' => 'required',
        ]);
        $user = User::create([
            'first_name' => $request->first_name,
            'last_name' => $request->last_name,
            'username' => $request->username,
            'email' => $request->email,
            'phone' => $request->code . $request->phone,
            'password' => Hash::make($request->password),
            'country' => $request->country,
            'sponsor' => $request->sponsor ?? User::first()->ref,
            'ref' => User::ref(),
        ]);
        $user->email_verified_at = time();
        $user->save();
        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successfully created user.'
            ],
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        $request->validate([
            'first_name' => 'required|string',
            'last_name' => 'required|string',
            'username' => 'required|string|alpha_dash',
            'email' => 'required|string|email',
            'country' => 'required',
        ]);
        if (!$user) return response()->json([
            'message' => [
                'type' => 'danger',
                'content' => 'User not found.'
            ]
        ], 404);
        $input = $request->except(['sponsor', 'password', 'password_confirmation']);
        if ($request->has('password')) {
            if ($request->password === $request->password_confirmation) $input['password'] = Hash::make($request->password);
            else return response()->json([
                'message' => [
                    'type' => 'danger',
                    'content' => 'Wrong password confirmation.'
                ]
            ], 404);
        }
        $user->update($input);
        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successfully updated user.'
            ],
        ], 201);
    }

    public function delete($id)
    {
        $user = User::find($id);
        $user->delete();
        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Successfully deleted user.'
            ],
            'totalUsers' => User::get()->toArray()
        ], 201);
    }
}
