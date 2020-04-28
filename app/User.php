<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    use Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email', 'first_name', 'last_name', 'username', 'phone', 'country', 'password', 'calculations'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    /**
     * The attributes that should be cast to native types.
     *
     * @var array
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function paidAmount() {
        $paidAmount = 0;
        foreach ($this->plans as $plan) {
            $paidAmount += $plan->price;
        }
        return $paidAmount;
    }

    public function plans()
    {
        return $this->belongsToMany('App\Plan', 'plan_user')->withPivot(['points', 'code']);
    }

    /**
     * Get all of the user's transactions.
     */
    public function transactions()
    {
        return $this->morphMany('App\Transaction', 'transactionable');
    }

    public function role()
    {
        return 'user';
    }
}
