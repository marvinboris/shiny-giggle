<?php

use App\Pack;
use App\Plan;
use Illuminate\Database\Seeder;

class PlansTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //

        $silver = Plan::create([
            'name' => 'Silver Plan',
            'points' => 2,
            'validity' => 2,
            'price' => 2
        ]);

        $gold = Plan::create([
            'name' => 'Gold Plan',
            'points' => 4,
            'validity' => 4,
            'price' => 5
        ]);

        $diamond = Plan::create([
            'name' => 'Diamond Plan',
            'points' => 10,
            'validity' => 10,
            'price' => 10
        ]);

        $silver->packs()->sync([1, 2, 3, 4]);
        $silver->durations()->sync([1, 2]);
        $silver->periods()->sync([3, 6]);

        $gold->packs()->sync([1, 2, 3, 4, 5, 6]);
        $gold->durations()->sync([1, 2, 3, 4]);
        $gold->periods()->sync([3, 4, 6]);

        $diamond->packs()->sync([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        $diamond->durations()->sync([1, 2, 3, 4, 5, 6, 7]);
        $diamond->periods()->sync([1, 2, 3, 4, 5, 6]);
    }
}
