<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class ContactUs extends Model
{
    //
    protected $directory = "/contact-us/";

    protected $fillable = [
        'title', 'subject', 'message', 'file', 'feedback', 'user_id', 'status', 'admin_file'
    ];

    public function user()
    {
        return $this->belongsTo('App\User');
    }

    public function getFileAttribute($value)
    {
        if ($value) return $this->directory . $value;
        return $value;
    }

    public function getAdminFileAttribute($value)
    {
        if ($value) return $this->directory . $value;
        return $value;
    }
}
