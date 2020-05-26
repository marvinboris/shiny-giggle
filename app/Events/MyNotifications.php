<?php

namespace App\Events;

use Illuminate\Queue\SerializesModels;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class MyNotifications implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $user;
    public $notification;
    public $notifications;

    public function __construct($user, $notification, $notifications)
    {
        $this->user = array_merge($user->toArray(), [
            'role' => $user->role()
        ]);

        $content = null;
        switch ($notification->type) {
            case 'App\Notifications\LimoPaymentStatus':
                $content = $notification->data->message;
                break;
            case 'App\Notifications\PlanUser':
                $content = 'New plan bought.';
                break;
            case 'App\Notifications\Deposit':
                $content = 'Deposit successfully made.';
                break;
            case 'App\Notifications\LimoPayment':
                $content = 'Limo Payment successfully submitted.';
                break;
        }
        $this->notification = array_merge($notification->toArray(), [
            'content' => $content
        ]);

        $this->notifications = $notifications;
    }

    public function broadcastOn()
    {
        return ['public'];
    }
}
