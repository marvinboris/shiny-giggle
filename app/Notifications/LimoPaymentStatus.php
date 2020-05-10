<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LimoPaymentStatus extends Notification
{
    use Queueable;

    public $limo_payment;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($limo_payment)
    {
        //
        $this->limo_payment = $limo_payment;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['database', 'mail'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $message = '';
        $status = $this->limo_payment->status;
        if ($status === 1) $message = 'Your limo was verified and approved. You can start using your purchased plan';
        return (new MailMessage)
            ->line($message);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $message = '';
        $status = $this->limo_payment->status;
        if ($status === 1) $message = 'Your limo was verified and approved. You can start using your purchased plan';
        // else if ($status === 2) $message = 'Your limo was verified and approved. You can start using your purchased plan';
        return [
            //
            'status' => $status,
            'message' => $message,
        ];
    }
}
