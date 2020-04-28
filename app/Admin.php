<?php

namespace App;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class Admin extends Authenticatable
{
    //
    use Notifiable, HasApiTokens;

    //
    protected $fillable = [
        'name', 'email', 'password', 'is_active', 'phone', 'lang'
    ];

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
        'password', 'remember_token',
    ];

    public function abbreviation()
    {
        $names = explode(' ', $this->name);
        $string = '';

        foreach ($names as $name) {
            $string .= strtoupper($name[0]);
        }

        return $string;
    }

    public function role()
    {
        return 'admin';
    }
}
