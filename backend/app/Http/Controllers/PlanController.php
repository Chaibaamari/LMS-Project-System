<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\Plan;
use Illuminate\Http\Request;

class PlanController extends Controller
{
 
    public function createBC(Request $request)
    {
        $ids = $request->input("ids");
        Plan::whereIn('ID_N', $ids)->update([
            'etat'=>'confirmé',
            'type'=>$request->input('type'),
            'Date_Deb'=>$request->input('date_deb'),
            'Date_fin'=>$request->input('date_fin'),

        ]);

        return response()->json(['message' => 'bon de commande crée']);
    }

    public function consultBC(Request $request)
    {
        
        $formation=Formation::where('Intitule_Action', $request->input('nomFormation'))->where('Nom_Organisme', $request->input('nomOrganisme'))->first();
        $plans=Plan::where('ID_Formation', $formation->ID_Formation)->where('etat', 'confirmé')->get();

        


        return response()->json(['message' => 'bon de commande crée','Plan'=> $plans]);
    }

    public function consultTBF(Request $request)
    {
        
        $plans=Plan::whereMonth('Date_Deb',$request->input('month') )->orWhereMonth('Date_Fin',$request->input('month'))->where('etat', 'confirmé')->get();

        return response()->json(['message' => 'bon de commande crée','Plan'=> $plans]);
    }

    public function consultBilan(Request $request)
    {
        
        $plans=Plan::where('etat', 'confirmé')->get();

        return response()->json(['message' => 'bon de commande crée','Plan'=> $plans]);
    }
}
