<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Pack;
use Illuminate\Http\Request;

class CalculateController extends Controller
{
    //
    public function userPlans()
    {
        return response()->json([
            'plans' => request()->user()->plans
        ]);
    }

    public function getCalculateFromCode($code)
    {
        $user = request()->user();

        $plan = $user->plans()->whereCode($code)->first();
        $packs = $plan->packs;
        $periods = $plan->periods;
        $durations = $plan->durations;

        $points = $plan->pivot->points;
        return response()->json([
            'plan' => $plan,
            'points' => $points
        ]);
    }

    public function makeCalculation()
    {
        $user = request()->user();

        $plan = $user->plans()->whereCode(request()->code)->first();
        $points = $plan->pivot->points;
        if ($points === 0) return response()->json([
            'message' => 'Insufficent points. Please subscribe to a plan'
        ], 500);
        else {
            $plan->pivot->update(['points' => $points - 1]);
            $user->update(['calculations' => $user->calculations + 1]);
        }


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
