<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use Illuminate\Support\Facades\DB;

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
        $Prv = DB::table('plans')
            ->select('etat', 'Date_Deb', 'Date_fin')
            ->groupBy('etat')
            ->get();
        return response()->json(['message' => 'success', 'data' => $Prv], 200);
    }
}
