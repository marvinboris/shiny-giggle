<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePlanUserTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('plan_user', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('plan_id')->unsigned()->index();
            $table->bigInteger('user_id')->unsigned()->index();
            $table->string('code', 20)->unique();
            $table->integer('points');
            $table->integer('calculations')->default(0);
            $table->datetime('expiry_date');
            $table->timestamps();

            $table->foreign('plan_id')->references('id')->on('plans')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('plan_user');
    }
}
