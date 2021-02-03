<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Promotion extends Model
{
    protected $fillable = [
        'start_time', 'end_time', 'status'
    ];

    public function plans()
    {
        return $this->belongsToMany('App\Plan', 'promotion_plan');
    }
}
