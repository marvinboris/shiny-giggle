<?php

namespace App\Http\Controllers\User;

use App\AutoReinvest as AppAutoReinvest;
use App\Duration;
use App\Http\Controllers\Controller;
use App\Http\Controllers\UtilController;
use App\Notifications\AutoReinvest;
use App\Pack;
use App\Period;
use App\Plan;
use Carbon\Carbon;
use Illuminate\Http\Request;

class OptionsController extends Controller
{
    private function get()
    {
        $page = +request()->page;
        $show = request()->show;
        $search = request()->search;

        $total = 0;

        $data = [];
        $filteredData = UtilController::user(request()->user())->auto_reinvests()->latest();

        $filteredData = $filteredData
            ->join('packs', 'packs.id', '=', 'auto_reinvests.pack_id')
            ->join('periods', 'periods.id', '=', 'auto_reinvests.period_id')
            ->join('durations', 'durations.id', '=', 'auto_reinvests.duration_id')
            ->select('packs.name as pack', 'periods.name as period', 'durations.name as duration', 'auto_reinvests.*')
            ->when($search, function ($query, $search) {
                if ($search !== "")
                    $query
                        ->where('pack', 'LIKE', "%$search%")
                        ->orWhere('period', 'LIKE', "%$search%")
                        ->orWhere('duration', 'LIKE', "%$search%");
            });

        $total = $filteredData->count();

        if ($show !== 'All') $filteredData = $filteredData->skip(($page - 1) * $show)->take($show);

        $filteredData = $filteredData->get();

        foreach ($filteredData as $contact) {
            $data[] = array_merge($contact->toArray(), []);
        }

        return [
            'autoReinvests' => $data,
            'total' => $total,
        ];
    }


    public function autoReinvests()
    {
        return $this->exportableReport();

        $data = $this->get();

        $autoReinvests = $data['autoReinvests'];
        $total = $data['total'];

        return response()->json([
            'autoReinvests' => $autoReinvests,
            'total' => $total,
        ]);
    }

    public function autoReinvestInit()
    {
        return response()->json([
            'packs' => Pack::all(),
            'periods' => Period::all(),
            'durations' => Duration::all(),
        ]);
    }

    public function autoReinvest(Request $request)
    {
        $user = UtilController::user($request->user());

        $start_date = $request->start_date;

        $pack_id = $request->pack_id;
        $period_id = $request->period_id;
        $duration_id = $request->duration_id;

        $pack = Pack::findOrFail($pack_id);
        $duration = Duration::findOrFail($duration_id)->weeks;
        $period = Period::findOrFail($period_id)->weeks;

        $totalPeriods = floor($duration / $period);
        $packPeriod = floor(52 / $period);
        $floatingPackPeriod = (52 / $period) - $packPeriod;

        $balance = 0;
        $balances = [];
        $ownedPacks = [[$pack]];
        $leftPacks = [[['packs' => $pack, 'leftWeeks' => 52]]];

        $data = [['packs' => [$pack->amount], 'date' => $start_date]];

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
                        $balance += $this->rpa($ownedPack, $period);
                    }
                } else if ($currentPeriod - $ownedPacksPeriod === $packPeriod + 1 && $floatingPackPeriod > 0)
                    foreach ($ownedPeriodPacks as $ownedPack) {
                        $leftWeeks = round($floatingPackPeriod * $period);
                        if ($leftWeeks > 0) {
                            $leftPeriodPacks[] = ['pack' => $ownedPack, 'leftWeeks' => $leftWeeks];
                        }
                        $balance += $floatingPackPeriod * $this->rpa($ownedPack, $period);
                    }
            }
            $balance = $this->littleRound($balance);

            if ($totalPeriods - $currentPeriod > $packPeriod) {
                $selectedPacks = [];
                while ($balance >= 100) {
                    $selectedPack = Pack::where('amount', '<=', $balance)->orderBy('amount', 'desc')->first();
                    $leftPeriodPacks[] = ['pack' => $selectedPack, 'leftWeeks' => 52];
                    $selectedPacks[] = $selectedPack;
                    $balance -= $selectedPack->amount;
                }
                $ownedPacks[] = $selectedPacks;

                if (count($selectedPacks) > 0) {
                    $investmentDay = (new Carbon($start_date))->addWeeks($period * ($currentPeriod + 1));
                    $dayBeforeInvestmentDay = $investmentDay->subDay();

                    $data[] = [
                        'packs' => array_map(function ($pack) {
                            return $pack->amount;
                        }, $selectedPacks),
                        'date' => $investmentDay->format('Y-m-d'),
                    ];

                    $user->notify((new AutoReinvest($selectedPacks))->delay($investmentDay));
                    $user->notify((new AutoReinvest($selectedPacks, false))->delay($dayBeforeInvestmentDay));
                }
            }
            if (count($leftPeriodPacks) > 0) $leftPacks[] = $leftPeriodPacks;
        }

        $auto_reinvest = AppAutoReinvest::create([
            'user_id' => $user->id,
            'pack_id' => $pack_id,
            'period_id' => $period_id,
            'duration_id' => $duration_id,
            'start_date' => $start_date,
            'data' => json_encode($data),
        ]);

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Auto Reinvest notifications successfully set.'
            ],
            'auto_reinvest' => $auto_reinvest
        ]);
    }


    // Utility functions
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

    function exportableReport()
    {
        // $data = $this->calculation([
        //     'start_date' => '2020-08-31',
        //     'pack_id' => 9,
        //     'period_id' => 2,
        //     'duration_id' => 2,
        //     'min_invest' => 100,
        //     'commissions' => [],
        // ]);

        // return response()->json([
        //     'message' => [
        //         'type' => 'success',
        //         'content' => 'Auto Reinvest notifications successfully set.'
        //     ],
        //     'autoReinvests' => $data
        // ]);

        $start_date = '2020-08-14';

        $pack_id = 7;
        $period_id = 1;
        $duration_id = 1;

        $min_invest = 1600;

        $downlineProcess = $this->calculation([
            'start_date' => '2020-11-09',
            'pack_id' => 8,
            'period_id' => 1,
            'duration_id' => 1,
            'min_invest' => 1600,
            'commissions' => [],
        ]);
        $commissions = array_map(function ($item) {
            return [
                'amount' => $item['commissions'],
                'date' => $item['date'],
            ];
        }, $downlineProcess);

        $pack = Pack::findOrFail($pack_id);
        $duration = Duration::findOrFail($duration_id)->weeks;
        $period = Period::findOrFail($period_id)->weeks;

        $totalPeriods = floor($duration / $period);
        $packPeriod = floor(52 / $period);
        $floatingPackPeriod = (52 / $period) - $packPeriod;

        $balance = 0;
        $total_investment = $pack->amount;
        $balances = [];
        $ownedPacks = [[$pack]];
        $leftPacks = [[['packs' => $pack, 'leftWeeks' => 52]]];
        $commission_net_worth = 0;

        $turnover = 0;

        $data = [['packs' => $pack->amount, 'date' => $start_date, 'balance' => $balance, 'commission_details' => '', 'turnover' => $turnover]];

        for ($currentPeriod = 0; $currentPeriod <= $totalPeriods; $currentPeriod++) {
            $leftPeriodPacks = [];
            $balances[] = $balance;
            $top_commission = 0;

            foreach ($ownedPacks as $ownedPacksPeriod => $ownedPeriodPacks) {
                if ($currentPeriod - $ownedPacksPeriod < $packPeriod) {
                    foreach ($ownedPeriodPacks as $ownedPack) {
                        $leftWeeks = 52 - ($currentPeriod - $ownedPacksPeriod + 1) * $period;
                        if ($leftWeeks > 0) {
                            $leftPeriodPacks[] = ['pack' => $ownedPack, 'leftWeeks' => $leftWeeks];
                        }
                        $balance += $this->rpa($ownedPack, $period);
                    }
                } else if ($currentPeriod - $ownedPacksPeriod === $packPeriod + 1 && $floatingPackPeriod > 0)
                    foreach ($ownedPeriodPacks as $ownedPack) {
                        $leftWeeks = round($floatingPackPeriod * $period);
                        if ($leftWeeks > 0) {
                            $leftPeriodPacks[] = ['pack' => $ownedPack, 'leftWeeks' => $leftWeeks];
                        }
                        $balance += $floatingPackPeriod * $this->rpa($ownedPack, $period);
                    }
            }
            $balance = $this->littleRound($balance);

            $investmentDay = (new Carbon($start_date))->addWeeks($period * ($currentPeriod + 1));
            $date = $investmentDay->format('Y-m-d');

            $previousInvestmentDay = (new Carbon($start_date))->addWeeks($period * ($currentPeriod + 1))->subWeek();

            $commission_details = '';

            foreach ($commissions as $commission) {
                $commissionDay = new Carbon($commission['date']);
                if ($previousInvestmentDay->timestamp < $commissionDay->timestamp && $commissionDay->timestamp <= $investmentDay->timestamp) {
                    $balance += $commission['amount'];

                    $downlineInvestment = $commission['amount'] * 50 / 3;

                    if ($turnover < 6000 && 6000 <= $turnover + $downlineInvestment) $balance += 360;
                    if ($turnover < 36000 && 36000 <= $turnover + $downlineInvestment) $balance += 1800;
                    if ($turnover < 180000 && 180000 <= $turnover + $downlineInvestment) $balance += 7200;
                    if ($turnover < 900000 && 900000 <= $turnover + $downlineInvestment) $balance += 18000;
                    if ($turnover < 3600000 && 3600000 <= $turnover + $downlineInvestment) $balance += 36000;
                    $turnover += $downlineInvestment;

                    $commission_details = $commission['date'] . ', ' . $commission['amount'];
                    $top_commission += $commission['amount'] / 2;
                }
            }

            if ($totalPeriods - $currentPeriod > $packPeriod) {
                $selectedPacks = [];
                while ($balance >= $min_invest) {
                    $selectedPack = Pack::where('amount', '<=', $balance)->orderBy('amount', 'desc')->first();
                    $leftPeriodPacks[] = ['pack' => $selectedPack, 'leftWeeks' => 52];
                    $selectedPacks[] = $selectedPack;
                    $balance -= $selectedPack->amount;
                    $top_commission += $selectedPack->amount * 2 / 25;
                    $total_investment += $selectedPack->amount;
                }
                $ownedPacks[] = $selectedPacks;
            }
            if (count($leftPeriodPacks) > 0) $leftPacks[] = $leftPeriodPacks;

            if ((new Carbon('2021-01-01'))->timestamp <= $investmentDay->timestamp && $investmentDay->timestamp <= (new Carbon('2021-12-31'))->timestamp) $commission_net_worth += $top_commission;

            $data[] = [
                'packs' => implode(', ', array_map(function ($pack) {
                    return $pack->amount;
                }, $selectedPacks)),
                'date' => $date,
                'balance' => $balance,
                'commission_details' => $commission_details,
                'turnover' => $turnover,
                'top_commission' => $top_commission,
                'total_investment' => $total_investment,
            ];
        }

        return response()->json([
            'message' => [
                'type' => 'success',
                'content' => 'Auto Reinvest notifications successfully set.'
            ],
            'autoReinvests' => $data,
            'commission_net_worth' => $commission_net_worth,
        ]);
    }

    function calculation($params)
    {
        $start_date = $params['start_date'];

        $pack_id = $params['pack_id'];
        $period_id = $params['period_id'];
        $duration_id = $params['duration_id'];

        $min_invest = $params['min_invest'];

        $commissions = $params['commissions'];

        $pack = Pack::findOrFail($pack_id);
        $duration = Duration::findOrFail($duration_id)->weeks;
        $period = Period::findOrFail($period_id)->weeks;

        $totalPeriods = floor($duration / $period);
        $packPeriod = floor(52 / $period);
        $floatingPackPeriod = (52 / $period) - $packPeriod;

        $balance = 0;
        $balances = [];
        $ownedPacks = [[$pack]];
        $leftPacks = [[['packs' => $pack, 'leftWeeks' => 52]]];

        $data = [['packs' => $pack->amount, 'date' => $start_date, 'balance' => $balance, 'commissions' => $pack->amount * 0.06]];

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
                        $balance += $this->rpa($ownedPack, $period);
                    }
                } else if ($currentPeriod - $ownedPacksPeriod === $packPeriod + 1 && $floatingPackPeriod > 0)
                    foreach ($ownedPeriodPacks as $ownedPack) {
                        $leftWeeks = round($floatingPackPeriod * $period);
                        if ($leftWeeks > 0) {
                            $leftPeriodPacks[] = ['pack' => $ownedPack, 'leftWeeks' => $leftWeeks];
                        }
                        $balance += $floatingPackPeriod * $this->rpa($ownedPack, $period);
                    }
            }
            $balance = $this->littleRound($balance);

            $investmentDay = (new Carbon($start_date))->addWeeks($period * ($currentPeriod + 1));
            $date = $investmentDay->format('Y-m-d');

            $previousInvestmentDay = (new Carbon($start_date))->addWeeks($period * ($currentPeriod + 1))->subWeek();

            foreach ($commissions as $commission) {
                $commissionDay = new Carbon($commission['date']);
                if ($previousInvestmentDay->timestamp < $commissionDay->timestamp && $commissionDay->timestamp <= $investmentDay->timestamp) $balance += $commission['amount'];
            }

            if ($totalPeriods - $currentPeriod > $packPeriod) {
                $selectedPacks = [];
                while ($balance >= $min_invest) {
                    $selectedPack = Pack::where('amount', '<=', $balance)->orderBy('amount', 'desc')->first();
                    $leftPeriodPacks[] = ['pack' => $selectedPack, 'leftWeeks' => 52];
                    $selectedPacks[] = $selectedPack;
                    $balance -= $selectedPack->amount;
                }
                $ownedPacks[] = $selectedPacks;
            }
            if (count($leftPeriodPacks) > 0) $leftPacks[] = $leftPeriodPacks;

            $data[] = [
                'packs' => implode(', ', array_map(function ($pack) {
                    return $pack->amount;
                }, $selectedPacks)),
                'date' => $date,
                'balance' => $balance,
                'commissions' => array_reduce($selectedPacks, function ($carry, $item) {
                    return $carry + $item->amount * 0.06;
                }, 0),
            ];
        }

        return $data;
    }
}
