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
        return $this->hasMany('App\User');
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
}
