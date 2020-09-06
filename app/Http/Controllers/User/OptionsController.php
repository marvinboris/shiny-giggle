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
        $start = new Carbon($start_date);

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
                    $selectedPack = Pack::where('amount', '<=', $balance)->orderBy('amount', 'desc')->first();
                    $leftPeriodPacks[] = ['pack' => $selectedPack, 'leftWeeks' => 52];
                    $selectedPacks[] = $selectedPack;
                    $balance -= $selectedPack->amount;
                }
                $ownedPacks[] = $selectedPacks;

                if (count($selectedPacks) > 0) {
                    $investmentDay = $start->addWeeks($period * ($currentPeriod + 1));
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
}
