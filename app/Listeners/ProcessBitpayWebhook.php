<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class ProcessBitpayWebhook
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle($event)
    {
        $orderId = $event->payload['orderId'];
        $status = $event->payload['status'];
        // Other payload properties
        // You will receive 3 webhooks for single payment with different status.
        // 1. status = paid
        // 2. status = confirmed
        // 3. status = completed
    }
}
