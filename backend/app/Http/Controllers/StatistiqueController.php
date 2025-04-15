<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use App\Models\Plan;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

use Illuminate\Http\Request;

class StatistiqueController extends Controller
{
    public function StRole(Request $request)
    {
        $Role = DB::table('employes')
            ->select('CSP', DB::raw('count(*) as count'))
            ->groupBy('CSP')
            ->get();
        return response()->json(['message' => 'success', 'data' => $Role], 200);
    }
    //
    public function StPrvtotal(Request $request)
    {
        $Prvt = DB::table('plans')
            ->select('etat', DB::raw('count(*) as count'))
            ->groupBy('etat')
            ->get();
        return response()->json(['message' => 'success', 'data' => $Prvt], 200);
    }
    public function StPrv(Request $request)
    {
        $month = $request->query('month'); // مثال: "2025-04"
        if (!$month) {
            $month = now()->format('Y-m'); // الشهر الحالي
        }

        // نحسب أول وآخر يوم في الشهر
        $startOfMonth = Carbon::createFromFormat('Y-m', $month)->startOfMonth();
        $endOfMonth = Carbon::createFromFormat('Y-m', $month)->endOfMonth();

        $data = DB::table('plans')
            ->selectRaw('etat, Date_Deb, Date_fin, count(*) as count')
            ->where(function ($query) use ($startOfMonth, $endOfMonth) {
                $query->whereBetween('Date_Deb', [$startOfMonth, $endOfMonth])
                    ->orWhereBetween('Date_fin', [$startOfMonth, $endOfMonth])
                    ->orWhere(function ($q) use ($startOfMonth, $endOfMonth) {
                        $q->where('Date_Deb', '<=', $startOfMonth)
                            ->where('Date_fin', '>=', $endOfMonth);
                    });
            })
            ->groupBy('etat', 'Date_Deb', 'Date_fin')
            ->get();

        return response()->json(['data' => $data]);
    }
}
