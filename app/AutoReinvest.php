<?php

namespace App;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class AutoReinvest extends Model
{
    protected $fillable = [
        'user_id', 'pack_id', 'duration_id', 'period_id', 'start_date', 'data',
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function pack()
    {
        return $this->belongsTo('App\Pack');
    }

    public function duration()
    {
        return $this->belongsTo('App\Duration');
    }

    public function period()
    {
        return $this->belongsTo('App\Period');
    }

    public function getStartDateAttribute($value)
    {
        return new Carbon($value);
    }

    public function getDataAttribute($value)
    {
        return json_decode($value);
    }
}
