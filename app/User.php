<?php

namespace App;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use Notifiable, HasApiTokens;

    protected $directory = "/profiles/";

    public function receivesBroadcastNotificationsOn()
    {
        return 'user.' . $this->role() . '.' . $this->id;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'email', 'first_name', 'last_name', 'username', 'phone', 'country', 'password', 'sponsor', 'ref', 'credits', 'is_active', 'last_login', 'ip', 'photo'
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
        foreach ($this->transactions as $transaction) {
            if ($transaction->status === 'completed') $paidAmount += $transaction->amount;
        }
        foreach ($this->limo_payments as $transaction) {
            if ($transaction->status === 1) $paidAmount += $transaction->amount;
        }
        foreach ($this->deposits as $deposit) {
            if ($deposit->status === 1) $paidAmount += $deposit->amount;
        }
        return $paidAmount;
    }

    public function plans()
    {
        return $this->belongsToMany('App\Plan', 'plan_user')->withPivot(['id', 'points', 'code', 'calculations', 'expiry_date', 'total']);
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

    public function auto_reinvests()
    {
        return $this->hasMany('App\AutoReinvest');
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

    public function getPhotoAttribute($value)
    {
        return $value ? public_path() . $this->directory . $value : null;
    }

    public function role()
    {
        return 'user';
    }
}
