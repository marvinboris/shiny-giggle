<?php

use App\Method;
use Illuminate\Database\Seeder;

class MethodsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        $methods = [
            'Bitcoin' => 'Bitcoin',
            'Mobile' => 'Mobile Payment',
            'Limo' => 'Pay using Limo account'
        ];

        foreach ($methods as $key => $value) {
            Method::create([
                'name' => $key,
                'text' => $value
            ]);
        }
    }
}
