<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class Guest extends User
{
    //
    use Notifiable, HasApiTokens;

    protected $fillable = [
        'email', 'phone', 'plan_id', 'points', 'password'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function plan()
    {
        return $this->belongsTo('App\Plan');
    }

    /**
     * Get all of the user's transactions.
     */
    public function transactions()
    {
        return $this->morphMany('App\Transaction', 'transactionable');
    }
}
