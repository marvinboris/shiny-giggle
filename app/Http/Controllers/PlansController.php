<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Method\MonetbilController;
use App\Method;
use App\Pack;
use App\Plan;
use Illuminate\Http\Request;

class PlansController extends Controller
{
    //
    public function index()
    {
        $plans = Plan::get();
        $links = [];

        foreach ($plans as $plan) {
            $links[] = route('plans.payment', $plan->slug);
        }

        return response()->json([
            'plans' => $plans,
            'links' => $links
        ]);
    }

    public function payment($slug)
    {
        $plan = Plan::whereSlug($slug)->first();
        $methodsData = Method::whereIsActive(1)->get();

        $methods = [];

        foreach ($methodsData as $index => $method) {
            switch ($method->name) {
                case 'Mobile':
                    new MonetbilController();
                    $monetbil = MonetbilController::generateWidgetData([
                        'amount' => $plan->amount,
                        'plan_id' => $plan->id
                    ]);
                    $link = $monetbil['link'];
                    break;
                default:
                    $link = route('plans.payment.confirm', $method->slug);
                    break;
            }
            $methods[] = array_merge($methodsData[$index], ['link' => $link]);
        }

        return response()->json([
            'plan' => $plan,
            'methods' => $methods
        ]);
    }

    public function bitcoin()
    {
    }

    public function limo()
    {
    }

    public function mobile()
    {
    }

    public function calculate(Request $request)
    {
        $plan = $request->user()->plan;
        $pack = $plan->packs()->findOrFail($request->pack);
        $duration = $plan->durations()->findOrFail($request->duration)->weeks;
        $period = $plan->periods()->findOrFail($request->period)->weeks;

        $totalPeriods = floor($duration / $period);
        $packPeriod = floor(52 / $period);
        $floatingPackPeriod = (52 / $period) - $packPeriod;

        $balance = 0;
        $ownedPacks = [$pack];

        $weekInfo = [];

        function rpa(Pack $pack, $period)
        {
            return $pack->amount * $pack->rate * $period / 52;
        }

        function roundBalance($number)
        {
            if (ceil($number) - $number < 0.0001) return ceil($number);
            return $number;
        }

        for ($currentPeriod = 0; $currentPeriod <= $totalPeriods; $currentPeriod++) {
            $leftPacks = [];
            foreach ($ownedPacks as $ownedPacksPeriod => $ownedPeriodPacks) {
                if ($currentPeriod - $ownedPacksPeriod < $packPeriod) {
                    $leftPacks[] = $ownedPeriodPacks;
                    foreach ($ownedPeriodPacks as $ownedPack) {
                        $balance += rpa($ownedPack, $period);
                    }
                }
                else if ($currentPeriod - $ownedPacksPeriod === $packPeriod + 1 && $floatingPackPeriod > 0)
                    foreach ($ownedPeriodPacks as $ownedPack) {
                        $balance += $floatingPackPeriod * rpa($ownedPack, $period);
                    }   
            }
            $balance = roundBalance($balance);
    
            if ($totalPeriods - $currentPeriod > $packPeriod) {
                $selectedPacks = [];
                while ($balance >= 100) {
                    $selectedPack = $plan->packs()->where('amount', '<=', $balance)->latest()->first();
                    $selectedPacks[] = $selectedPack;
                    $balance -= $selectedPack->amount;
                }
                $ownedPacks[] = $selectedPacks;
            }
        }
    }
}
