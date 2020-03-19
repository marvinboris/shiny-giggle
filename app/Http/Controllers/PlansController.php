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

        foreach ($methodsData as $method) {
            switch ($method->name) {
                case 'Mobile':
                    new MonetbilController();
                    $monetbil = MonetbilController::generateWidgetData([
                        'amount' => $plan->price,
                        'plan_id' => $plan->id
                    ]);
                    $link = $monetbil['link'];
                    break;
                default:
                    $link = route('plans.payment.confirm', ['plan' => $plan->slug, 'method' => $method->slug]);
                    break;
            }
            $methods[] = array_merge($method->toArray(), ['link' => $link]);
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

    public function confirm($plan, $method)
    {
    }

    public function getCalculate()
    {
        $plan = request()->user()->plan;
        $packs = $plan->packs;
        $periods = $plan->periods;
        $durations = $plan->durations;
        return response()->json([
            'plan' => $plan
        ]);
    }

    public function calculate()
    {
        $points = request()->user()->points;
        if ($points === 0) return response()->json([
            'message' => 'Insufficent points. Please subscribe to a plan'
        ]);
        else request()->user()->update(['points' => $points - 1]);

        $plan = request()->user()->plan;
        $pack = $plan->packs()->findOrFail(request()->pack);
        $duration = $plan->durations()->findOrFail(request()->duration)->weeks;
        $period = $plan->periods()->findOrFail(request()->period)->weeks;

        $totalPeriods = floor($duration / $period);
        $packPeriod = floor(52 / $period);
        $floatingPackPeriod = (52 / $period) - $packPeriod;

        $balance = 0;
        $ownedPacks = [[$pack]];
        $leftPacks = [['pack' => $pack, 'leftWeeks' => 52]];

        function rpa(Pack $pack, $period)
        {
            return $pack->amount * $pack->rate * $period / 52;
        }

        function littleRound($number)
        {
            return (abs(round($number) - $number) < 0.0001) ? round($number) : $number;
        }

        for ($currentPeriod = 0; $currentPeriod <= $totalPeriods; $currentPeriod++) {
            $leftPeriodPacks = [];
            foreach ($ownedPacks as $ownedPacksPeriod => $ownedPeriodPacks) {
                if ($currentPeriod - $ownedPacksPeriod < $packPeriod) {
                    foreach ($ownedPeriodPacks as $ownedPack) {
                        $leftPeriodPacks[] = ['pack' => $ownedPack, 'leftWeeks' => 52 - ($currentPeriod - $ownedPacksPeriod + 1) * $period];
                        $balance += rpa($ownedPack, $period);
                    }
                } else if ($currentPeriod - $ownedPacksPeriod === $packPeriod + 1 && $floatingPackPeriod > 0)
                    foreach ($ownedPeriodPacks as $ownedPack) {
                        $leftPeriodPacks[] = ['pack' => $ownedPack, 'leftWeeks' => round($floatingPackPeriod * $period)];
                        $balance += $floatingPackPeriod * rpa($ownedPack, $period);
                    }
            }
            $balance = littleRound($balance);

            if ($totalPeriods - $currentPeriod > $packPeriod) {
                $selectedPacks = [];
                while ($balance >= 100) {
                    $selectedPack = $plan->packs()->where('amount', '<=', $balance)->latest()->first();
                    $leftPeriodPacks[] = ['pack' => $ownedPack, 'leftWeeks' => 52];
                    $selectedPacks[] = $selectedPack;
                    $balance -= $selectedPack->amount;
                }
                $ownedPacks[] = $selectedPacks;
            }
            $leftPacks[] = $leftPeriodPacks;
        }

        return response()->json([
            'pack' => $pack,
            'plan' => $plan,
            'period' => $period,
            'balance' => $balance,
            'points' => $points - 1,
            'duration' => $duration,
            'leftPacks' => $leftPacks,
            'ownedPacks' => $ownedPacks,
        ]);
    }
}
