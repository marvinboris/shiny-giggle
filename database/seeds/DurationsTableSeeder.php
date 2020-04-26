<?php

use App\Duration;
use Illuminate\Database\Seeder;

class DurationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $years = [
            2 => 'Two years',
            3 => 'Three years',
            4 => 'Four years',
            5 => 'Five years',
            6 => 'Six years',
        ];

        foreach ($years as $key => $value) {
            Duration::create([
                'name' => $value,
                'weeks' => $key * 52
            ]);
        }
    }
}
