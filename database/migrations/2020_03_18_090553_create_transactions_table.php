<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->string('address', 200)->nullable();
            $table->integer('transactionable_id')->nullable();
            $table->string('transactionable_type');
            $table->decimal('amount', 18, 6);
            $table->integer('plan_id')->index();
            $table->string('currency')->nullable();
            $table->string('tx_id');
            $table->string('tx_hash');
            $table->string('vendor', 100);
            $table->string('method', 100);
            $table->string('type', 100);
            $table->string('status', 10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transactions');
    }
}
