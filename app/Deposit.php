<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Deposit extends Model
{
    //
    protected $fillable = [
        'user_id', 'method_id', 'amount', 'fees', 'comments', 'status'
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function method()
    {
        return $this->belongsTo('App\Method');
    }
}
