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
        $plans = [];
        $links = [];

        foreach (Plan::get() as $plan) {
            $plans[] = array_merge($plan->toArray(), [
                'durations' => count($plan->durations),
                'packs' => count($plan->packs),
                'periods' => count($plan->periods),
            ]);
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
                case 'Mobil':
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
        $balances = [];
        $ownedPacks = [[$pack]];
        $leftPacks = [[['pack' => $pack, 'leftWeeks' => 52]]];
        $leftPacksPerWeek = [];

        function rpa(Pack $pack, $period)
        {
            return $pack->amount * $pack->rate * $period / 52;
        }

        function payout(Pack $pack)
        {
            return $pack->amount * $pack->rate / 52;
        }

        function littleRound($number)
        {
            return (abs(round($number) - $number) < 0.0001) ? round($number) : $number;
        }

        for ($currentPeriod = 0; $currentPeriod <= $totalPeriods; $currentPeriod++) {
            $leftPeriodPacks = [];
            $balances[] = $balance;

            foreach ($ownedPacks as $ownedPacksPeriod => $ownedPeriodPacks) {
                if ($currentPeriod - $ownedPacksPeriod < $packPeriod) {
                    foreach ($ownedPeriodPacks as $ownedPack) {
                        $leftWeeks = 52 - ($currentPeriod - $ownedPacksPeriod + 1) * $period;
                        if ($leftWeeks > 0) {
                            $leftPeriodPacks[] = ['pack' => $ownedPack, 'leftWeeks' => $leftWeeks];
                        }
                        $balance += rpa($ownedPack, $period);
                    }
                } else if ($currentPeriod - $ownedPacksPeriod === $packPeriod + 1 && $floatingPackPeriod > 0)
                    foreach ($ownedPeriodPacks as $ownedPack) {
                        $leftWeeks = round($floatingPackPeriod * $period);
                        if ($leftWeeks > 0) {
                            $leftPeriodPacks[] = ['pack' => $ownedPack, 'leftWeeks' => $leftWeeks];
                        }
                        $balance += $floatingPackPeriod * rpa($ownedPack, $period);
                    }
            }
            $balance = littleRound($balance);

            if ($totalPeriods - $currentPeriod > $packPeriod) {
                $selectedPacks = [];
                while ($balance >= 100) {
                    $selectedPack = $plan->packs()->where('amount', '<=', $balance)->orderBy('amount', 'desc')->first();
                    $leftPeriodPacks[] = ['pack' => $selectedPack, 'leftWeeks' => 52];
                    $selectedPacks[] = $selectedPack;
                    $balance -= $selectedPack->amount;
                }
                $ownedPacks[] = $selectedPacks;
            }
            if (count($leftPeriodPacks) > 0) $leftPacks[] = $leftPeriodPacks;
        }

        foreach ($leftPacks as $currentPeriod => $currentPeriodLeftPacks) {
            $balanceBeforePeriod = $balances[$currentPeriod];

            $nextPeriod = $currentPeriod + 1;
            $invest = 0;
            if (count($ownedPacks) > $nextPeriod) {
                $invest = 0;

                foreach ($ownedPacks[$nextPeriod] as $currentPack) {
                    $invest += $currentPack->amount;
                }
            }

            for ($index = 0; $index < $period; $index++) {
                $finalInvest = $index === $period - 1 ? +$invest : 0;

                $packs = [];
                $payoutsAmount = 0;
                $payouts = [];

                foreach ($currentPeriodLeftPacks as $element) {
                    $currentPeriodLeftPack = $element['pack'];
                    $leftWeeks = $element['leftWeeks'];

                    $packs[] = ['pack' => $currentPeriodLeftPack, 'leftWeeks' => $leftWeeks - $index];
                    $payoutsAmount += ($index + 1) * payout($currentPeriodLeftPack);
                    $payouts[] = payout($currentPeriodLeftPack);
                }
                $currentBalance = littleRound($balanceBeforePeriod + $payoutsAmount) - $finalInvest;

                $leftPacksPerWeek[] = [
                    'week' => $currentPeriod * $period + $index + 1, 
                    'packs' => $packs, 
                    'balance' => $currentBalance, 
                    'payouts' => $payouts, 
                    'invest' => $finalInvest
                ];
            }
        }

        return response()->json([
            'pack' => $pack,
            'plan' => $plan,
            'period' => $period,
            'balance' => $balance,
            'points' => $points - 1,
            'duration' => $duration,
            'leftPacks' => $leftPacks,
            'leftPacksPerWeek' => $leftPacksPerWeek,
            'ownedPacks' => $ownedPacks,
        ]);
    }
}
