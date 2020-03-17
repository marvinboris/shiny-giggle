<?php

use App\Period;
use Illuminate\Database\Seeder;

class PeriodsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $periods = [
            1 => 'Weekly',
            2 => 'Every 2 weeks',
            4 => 'Monthly',
            13 => 'Quarterly',
            26 => 'Semi-annually',
            52 => 'Annually'
        ];

        foreach ($periods as $key => $value) {
            Period::create([
                'name' => $value,
                'weeks' => $key
            ]);
        }
    }
}
