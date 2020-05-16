<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Deposit extends Model
{
    //
    protected $fillable = [
        'user_id', 'method_id', 'amount', 'fees', 'comments', 'status', 'type', 'data'
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function method()
    {
        return $this->belongsTo('App\Method');
    }

    public function getDataAttribute($value)
    {
        return json_decode($value);
    }
}
