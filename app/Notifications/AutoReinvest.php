<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AutoReinvest extends Notification implements ShouldQueue
{
    use Queueable;

    private $packs;
    private $today;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($packs, $today = true)
    {
        $this->packs = $packs;
        $this->today = $today;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return [
            'mail',
            'database'
        ];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $packs = implode(', ', array_map(function ($pack) {
            return $pack->name;
        }, $this->packs));
        $text = $this->today ? 'You have to buy following packages today: ' : 'You will have to buy following packages tomorrow: ';

        return (new MailMessage)
            ->greeting('Hello!')
            ->line($text . $packs)
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'packs' => array_map(function ($pack) {
                return $pack->amount;
            }, $this->packs),
            'today' => $this->today,
        ];
    }
}
