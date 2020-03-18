<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        // $this->call(UsersTableSeeder::class);
        $this->call(DurationsTableSeeder::class);
        $this->call(PacksTableSeeder::class);
        $this->call(PeriodsTableSeeder::class);
        $this->call(PlansTableSeeder::class);
        $this->call(MethodsTableSeeder::class);
    }
}
