<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Cviebrock\EloquentSluggable\Sluggable;

class Plan extends Model
{
    //
    use Sluggable;

    protected $fillable = [
        'name', 'slug', 'points', 'validity', 'price'
    ];

    public function sluggable()
    {
        return [
            'slug' => [
                'source' => 'name'
            ]
        ];
    }

    public function users()
    {
        return $this->belongsToMany('App\User', 'plan_user')->withPivot(['id', 'points', 'code', 'calculations', 'expiry_date', 'total']);
    }

    public function promotions()
    {
        return $this->belongsToMany('App\Promotion', 'promotion_plan');
    }

    public function guests()
    {
        return $this->hasMany('App\Guest');
    }

    public function periods()
    {
        return $this->belongsToMany('App\Period');
    }

    public function packs()
    {
        return $this->belongsToMany('App\Pack');
    }

    public function durations()
    {
        return $this->belongsToMany('App\Duration');
    }

    public static function generateCode()
    {
        $letters = range('A', 'Z');
        $numbers = range(0, 9);
        $chars = array_merge($letters, $numbers);
        $length = count($chars);

        $code = '';

        for ($i = 0; $i < 8; $i++) {
            $index = rand(0, $length - 1);
            $code .= $chars[$index];
        }

        return $code;
    }

    public static function code()
    {
        $code = self::generateCode();
        $guest = Guest::where('plan_code', $code)->first();
        $plan_user = PlanUser::where('code', $code)->first();
        while ($guest || $plan_user) {
            $code = self::generateCode();
            $guest = Guest::where('plan_code', $code)->first();
            $plan_user = PlanUser::where('code', $code)->first();
        }

        return $code;
    }
}
