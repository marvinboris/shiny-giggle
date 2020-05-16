<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class LimoPayment extends Model
{
    //
    protected $fillable = [
        'user_id', 'transfer_no', 'date', 'name', 'email', 'phone', 'limo_id', 'amount', 'status', 'type', 'data'
    ];

    protected $notification_name = 'Limo Payment';

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function getDataAttribute($value)
    {
        return json_decode($value);
    }
}
