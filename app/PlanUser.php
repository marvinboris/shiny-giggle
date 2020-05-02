<?php

namespace App;

use Illuminate\Database\Eloquent\Relations\Pivot;

class PlanUser extends Pivot
{
    //
    public function plan()
    {
        return $this->belongsTo('App\Plan');
    }

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
