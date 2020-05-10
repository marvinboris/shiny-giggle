<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContactUs extends Model
{
    //
    protected $fillable = [
        'title', 'subject', 'message', 'file', 'feedback', 'user_id'
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
    }
}
