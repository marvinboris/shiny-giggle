<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MyMessages implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $message;
    public $messages;

    public function __construct($user, $message, $messages)
    {
        $this->user = array_merge($user->toArray(), [
            'role' => $user->role()
        ]);
        $this->message = $message;
        $this->messages = $messages;
    }

    public function broadcastOn()
    {
        return ['public'];
    }
}
