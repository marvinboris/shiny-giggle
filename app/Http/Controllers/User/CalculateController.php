<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Method;
use App\Pack;
use App\Plan;
use App\PlanUser;
use Carbon\Carbon;
use Illuminate\Http\Request;

class CalculateController extends Controller
{
    //
    public function userPlans()
    {
        $plans = [];
        foreach (request()->user()->plans as $plan) {
            if (
                $plan->pivot->points > 0
                // && time() < Carbon::createFromDate($plan->pivot->expiry_date)->timestamp
            )
                $plans[] = $plan;
        }
        return response()->json([
            'plans' => $plans
        ]);
    }

    public function depositPlan()
    {
        $deposits = request()->user()->deposits;
        $method_id = Method::whereSlug('admin')->first()->id;
        $plans = [];
        foreach ($deposits as $deposit) {
            if ($deposit->type === 'plan' && $deposit->status === 2 && $deposit->method_id === $method_id)
                $plans[] = PlanUser::find($deposit->data->plan_user_id)->plan;
        }
        return response()->json([
            'plans' => $plans
        ]);
    }

    public function getCalculateFromCode($code)
    {
        $user = request()->user();

        $plan = $user->plans()->whereCode($code)->first();
        $packs = $plan->packs()->whereStatus(1)->get();
        $periods = $plan->periods;
        $durations = $plan->durations;

        $points = $plan->pivot->points;
        return response()->json([
            'plan' => array_merge($plan->toArray(), [
                'packs' => $packs,
            ]),
            'points' => $points
        ]);
    }

    public function makeCalculation()
    {
        $user = request()->user();

        $pivot = PlanUser::whereCode(request()->code)->first();
        if ($pivot->user_id !== $user->id) return response()->json([
            'message' => 'Unauthorized'
        ], 403);
        $points = $pivot->points;
        $calculations = $pivot->calculations;
        if ($points === 0) return response()->json([
            'message' => 'Insufficent points. Please subscribe to a plan'
        ], 500);

        $plan = Plan::find($pivot->plan_id);
        $pack = $plan->packs()->findOrFail(request()->pack);
        $duration = $plan->durations()->findOrFail(request()->duration)->weeks;
        $period = $plan->periods()->findOrFail(request()->period)->weeks;

        $totalPeriods = floor($duration / $period);
        $packPeriod = floor(52 / $period);
        $floatingPackPeriod = (52 / $period) - $packPeriod;

        $minAmount = Pack::whereStatus(1)->orderBy('amount', 'asc')->first()->amount;

        $balance = 0;
        $balances = [];
        $ownedPacks = [[$pack]];
        $leftPacks = [[['pack' => $pack, 'leftWeeks' => 52]]];
        $leftPacksPerWeek = [];
        $totalInvest = $pack->amount;
        $totalInvests = [];

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
            $totalInvests[] = $totalInvest;

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
                while ($balance >= $minAmount) {
                    $selectedPack = $plan->packs()->whereStatus(1)->where('amount', '<=', $balance)->orderBy('amount', 'desc')->first();
                    $leftPeriodPacks[] = ['pack' => $selectedPack, 'leftWeeks' => 52];
                    $selectedPacks[] = $selectedPack;
                    $balance -= $selectedPack->amount;
                    $totalInvest += $selectedPack->amount;
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
                    'totalInvest' => $totalInvests[$currentPeriod],
                    'payouts' => $payouts,
                    'invest' => $finalInvest
                ];
            }
        }

        $pivot->update(['points' => $points - 1, 'calculations' => $calculations + 1]);

        return response()->json([
            'simulation' => [
                'pack' => $pack,
                'plan' => $plan,
                'period' => $period,
                'balance' => $balance,
                'points' => $points - 1,
                'duration' => $duration,
                'leftPacks' => $leftPacks,
                'leftPacksPerWeek' => $leftPacksPerWeek,
                'ownedPacks' => $ownedPacks,
            ]
        ]);
    }
}
