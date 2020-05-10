<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email', 'first_name', 'last_name', 'username', 'phone', 'country', 'password', 'sponsor', 'ref', 'credits'
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

    public function paidAmount()
    {
        $paidAmount = 0;
        foreach ($this->plans as $plan) {
            $paidAmount += $plan->price;
        }
        return $paidAmount;
    }

    public function plans()
    {
        return $this->belongsToMany('App\Plan', 'plan_user')->withPivot(['points', 'code', 'calculations']);
    }

    public function limo_payments()
    {
        return $this->hasMany('App\LimoPayment');
    }

    public function contact_us()
    {
        return $this->hasMany('App\ContactUs');
    }

    public function deposits()
    {
        return $this->hasMany('App\Deposit');
    }

    public function calculations()
    {
        $plans = $this->plans;
        $calculations = 0;
        foreach ($plans as $plan) {
            $calculations += $plan->pivot->calculations;
        }
        return $calculations;
    }

    /**
     * Get all of the user's transactions.
     */
    public function transactions()
    {
        return $this->morphMany('App\Transaction', 'transactionable');
    }

    public static function generateNewRef()
    {
        $letters = range('A', 'Z');
        $numbers = range(0, 9);
        $chars = array_merge($letters, $numbers);
        $length = count($chars);

        $code = '';

        for ($i = 0; $i < 6; $i++) {
            $index = rand(0, $length - 1);
            $code .= $chars[$index];
        }

        return $code;
    }

    public static function ref()
    {
        $ref = self::generateNewRef();
        $user = self::where('ref', $ref)->first();
        while ($user) {
            $ref = self::generateNewRef();
            $user = self::where('ref', $ref)->first();
        }

        return $ref;
    }

    public function abbreviation()
    {
        return strtoupper($this->first_name[0] . $this->last_name[0]);
    }

    public function referrals($latest = false, $limit = 0)
    {
        $referrals = self::where('sponsor', $this->ref);
        if ($latest) $referrals = $referrals->latest();
        if ($limit > 0) $referrals = $referrals->limit($limit);
        return $referrals->get();
    }

    public function name()
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    public function sponsor()
    {
        return self::where('ref', $this->sponsor)->first();
    }

    public function role()
    {
        return 'user';
    }
}
