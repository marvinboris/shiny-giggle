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
        $users = [
            [
                'email' => 'admin@limocalc.com',
                'first_name' => 'Limo',
                'last_name' => 'Calc',
                'username' => 'limocalc',
                'country' => 'CM',
                'phone' => '237694422723',
                'password' => Hash::make('11223344'),
                'email_verified_at' => now(),
                'sponsor' => '0',
                'ref' => 'LIMCAL'
            ],
            [
                'email' => 'jaris.ultio.21@gmail.com',
                'first_name' => 'Boris Marvin',
                'last_name' => 'Ndouma',
                'username' => 'marvinboris',
                'country' => 'CM',
                'phone' => '237655588688',
                'password' => Hash::make('2404'),
                'email_verified_at' => now(),
                'sponsor' => 'LIMCAL',
                'ref' => User::ref(),
                'credits' => 500
            ],
            [
                'email' => 'yungongbriand@gmail.com',
                'first_name' => 'Briand',
                'last_name' => 'Yungong',
                'username' => 'yungongbriand',
                'country' => 'CM',
                'phone' => '237694422723',
                'password' => Hash::make('11223344'),
                'email_verified_at' => now(),
                'sponsor' => 'LIMCAL',
                'ref' => User::ref(),
                'credits' => 500
            ]
        ];

        foreach ($users as $user) {
            $u = User::create($user);

            foreach (Plan::get() as $plan) {
                PlanUser::create([
                    'plan_id' => $plan->id,
                    'user_id' => $u->id,
                    'points' => $plan->points,
                    'code' => Plan::code(),
                    'expiry_date' => Carbon::now()->addWeeks($plan->validity)
                ]);
            }
        }
    }
}
