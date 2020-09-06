<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Pack extends Model
{
    //
    protected $fillable = [
        'name', 'amount', 'rate'
    ];

    public function plans()
    {
        return $this->belongsToMany('App\Plan');
    }

    public function auto_reinvests()
    {
        return $this->hasMany('App\AutoReinvest');
    }
}
