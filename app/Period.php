<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Period extends Model
{
    //
    protected $fillable = [
        'name', 'weeks'
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
