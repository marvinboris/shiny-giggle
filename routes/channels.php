<?php

use App\Admin;
use App\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Broadcast;
use Illuminate\Support\Facades\Log;

/*
|--------------------------------------------------------------------------
| Broadcast Channels
|--------------------------------------------------------------------------
|
| Here you may register all of the event broadcasting channels that your
| application supports. The given channel authorization callbacks are
| used to check if an authenticated user can listen to the channel.
|
*/

Broadcast::channel('user.admin.{id}', function ($model, $id) {
    Log::info($model);
    return $model->id === $id && get_class($model) === 'App\Admin';
}, ['guards' => 'api']);


Broadcast::channel('user.user.{id}', function ($model, $id) {
    return $model->id === $id && get_class($model) === 'App\User';
}, ['guards' => 'api']);

// Broadcast::channel('user.{role}.{id}', function ($user, $role, $id) {
//     $user = request()->user();
//     switch ($user->token()->name) {
//         case 'User Personal Access Token':
//             $user = User::find($user->id);
//             break;
//         case 'Admin Personal Access Token':
//             $user = Admin::find($user->id);
//             break;
//     }
//     return $user->role() === $role && $user->id === $id;
// }, ['guards' => ['api', 'admin']]);
