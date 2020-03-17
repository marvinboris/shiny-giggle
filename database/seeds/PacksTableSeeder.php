<?php

use App\Pack;
use Illuminate\Database\Seeder;

class PacksTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $packs = [
            100 => 1.6,
            200 => 1.7,
            400 => 1.8,
            800 => 1.9,
            1600 => 2,
            3200 => 2.05,
            6400 => 2.1,
            12800 => 2.15,
            25600 => 2.2,
            51200 => 2.24,
            100000 => 2.25,
        ];

        foreach ($packs as $key => $value) {
            Pack::create([
                'name' => $key,
                'amount' => $key,
                'rate' => $value
            ]);
        }
    }
}
