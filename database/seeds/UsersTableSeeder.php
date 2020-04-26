<?php

use App\Plan;
use App\PlanUser;
use App\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $me = User::create([
            'email' => 'jaris.ultio.21@gmail.com',
            'first_name' => 'Boris Marvin',
            'last_name' => 'Ndouma',
            'username' => 'marvinboris',
            'country' => 'CM',
            'phone' => '237655588688',
            'password' => Hash::make('2404'),
            'email_verified_at' => now()
        ]);
        
        $briand = User::create([
            'email' => 'yungongbriand@gmail.com',
            'first_name' => 'Briand',
            'last_name' => 'Yungong',
            'username' => 'yungongbriand',
            'country' => 'CM',
            'phone' => '237694422723',
            'password' => Hash::make('11223344'),
            'email_verified_at' => now()
        ]);

        foreach (Plan::get() as $plan) {
            PlanUser::create([
                'plan_id' => $plan->id,
                'user_id' => $me->id,
                'points' => $plan->points,
                'code' => Plan::code(),
                'expiry_date' => Carbon::now()->addWeeks($plan->validity)
            ]);
            
            PlanUser::create([
                'plan_id' => $plan->id,
                'user_id' => $briand->id,
                'points' => $plan->points,
                'code' => Plan::code(),
                'expiry_date' => Carbon::now()->addWeeks($plan->validity)
            ]);
        }
    }
}
