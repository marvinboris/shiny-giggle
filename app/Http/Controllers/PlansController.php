<?php

namespace App\Http\Controllers;

use App\Admin;
use App\Http\Controllers\Method\LimoController;
use App\Http\Controllers\Method\MonetbilController;
use App\Http\Controllers\Method\PayeerController;
use App\LimoPayment;
use App\Method;
use App\Notifications\Admin as NotificationsAdmin;
use App\Notifications\LimoPayment as NotificationsLimoPayment;
use App\Pack;
use App\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Notification;

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
        $methodsData = Method::where('name', '!=', 'Admin')->whereIsActive(1)->get();

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
                case 'Payeer':
                    $payeer = PayeerController::generateWidgetData([
                        'amount' => $plan->price,
                        'type' => 'plan',
                        'plan_id' => $plan->id,
                        'plan_name' => $plan->name,
                    ]);
                    $link = $payeer['link'];
                    break;
                case 'Limo':
                    $limo = LimoController::generateWidgetData([
                        'amount' => $plan->price,
                        'type' => 'plan',
                        'email' => UtilController::user(request()->user())->email,
                        'plan_id' => $plan->id,
                        'plan_name' => $plan->name,
                    ]);
                    $link = $limo['link'];
                    // $link = route('plans.payment.limo');
                    break;
                default:
                    $link = route('plans.payment.confirm', ['plan' => $plan->slug, 'method' => $method->slug]);
                    break;
            }
            $methods[] = array_merge($method->toArray(), ['link' => $link]);
        }

        return response()->json([
            'plan' => $plan,
            'methods' => $methods,
        ]);
    }

    public function userPlans()
    {
        return response()->json(UtilController::user(request()->user())->plans);
    }

    public function bitcoin()
    {
    }

    public function limo(Request $request)
    {
        $user = UtilController::user($request->user());
        $request->validate([
            'transfer_no' => 'required|numeric',
            'date' => 'required|date',
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'limo_id' => 'required|string',
            'amount' => 'required',
        ]);
        $payment = LimoPayment::create([
            'user_id' => $user->id,
            'transfer_no' => $request->transfer_no,
            'date' => $request->date,
            'name' => $request->name,
            'email' => $request->email,
            'limo_id' => $request->limo_id,
            'amount' => $request->amount,
            'phone' => $request->phone,
            'status' => 0,
        ]);
        $user->notify(new NotificationsLimoPayment($payment));
        Notification::send(Admin::all(), new NotificationsAdmin($payment));

        return response()->json([
            'message' => '/user/subscription/plans?status=0'
        ], 201);
    }

    public function confirm($plan, $method)
    {
    }

    public function getCalculate()
    {
        $user = UtilController::user(request()->user());

        $plan = $user->plan;
        $packs = $plan->packs;
        $periods = $plan->periods;
        $durations = $plan->durations;

        $points = $user->points;
        return response()->json([
            'plan' => $plan,
            'points' => $points
        ]);
    }

    public function getCalculateFromCode($code)
    {
        $user = UtilController::user(request()->user());

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
        $user = UtilController::user(request()->user());

        $role = $user->role();

        if ($role === 'guest') {
            $points = $user->points;
            if ($points === 0) return response()->json([
                'message' => 'Insufficent points. Please subscribe to a plan'
            ], 500);
            else $user->update(['points' => $points - 1]);
            $plan = $user->plan;
        } else if ($role === 'user') {
            $plan = $user->plans()->whereCode(request()->code)->first();
            $points = $plan->pivot->points;
            if ($points === 0) return response()->json([
                'message' => 'Insufficent points. Please subscribe to a plan'
            ], 500);
            else {
                $plan->pivot->update(['points' => $points - 1]);
                $user->update(['calculations' => $user->calculations + 1]);
            }
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
