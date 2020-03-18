<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    //
    protected $fillable = [
        'address', 'transactionable_id', 'transactionable_type', 'amount', 'currency', 'tx_id', 'tx_hash', 'vendor', 'method', 'type', 'status', 'plan_id'
    ];

    public function transactionable()
    {
        return $this->morphTo();
    }
}
