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




        return response()->json(['message' => 'bon de commande retourné','Plan'=> $plans]);
    }

    public function consultTBF(Request $request)
    {

        $plans=Plan::whereMonth('Date_Deb',$request->input('month') )->orWhereMonth('Date_Fin',$request->input('month'))->where('etat', 'confirmé')->get();

        return response()->json(['message' => 'TBF retourné','Plan'=> $plans]);
    }

    public function consultBilan(Request $request)
    {

        $plans=Plan::where('etat', 'confirmé')->get();

        return response()->json(['message' => 'Bilan retourné','Plan'=> $plans]);
    }
    
    public function consultprev(){
        $plans=Plan::where('etat','prévision')->with([
            'employe.direction',
            'employe.fonction',
            'formation.organisme',
        ])->get();

        return response()->json(['message' => 'previsions loaded succesfully','Plan'=> $plans]);
    }

    public function prevadd(Request $request){
    
        Plan::create([
            'etat'=>'prévision',
            'Matricule'=> $request->input('matricule'),
            'ID_Formation'=> $request->input('id_formation'),
        ]);

        return response()->json(['message' => 'previsions ajouté']);
    }

    public function prevmodify(Request $request){

        $id= $request->input('id_n');
        Plan::where('ID_N',$id)->update([
            'Matricule'=> $request->input('matricule'),
            'ID_Formation'=> $request->input('id_formation'),
        ]);
    


        return response()->json(['message' => 'previsions modifié']);
    }

    public function prevdelete(Request $request){

        $id= $request->input('id_n');    
        Plan::where('ID_N',$id)->delete();


        return response()->json(['message' => 'previsions supprimé']);
    }

    public function consultnotifie()
    {
        $plans=Plan::where('etat','validé')->with([
            'employe.direction',
            'employe.fonction',
            'formation.organisme',
        ])->get();

        return response()->json(['message' => 'plan notifié loaded succesfully','Plan'=> $plans]);

    }
    public function notifieadd(Request $request)
    {
        Plan::create([
            'etat'=>'validé',
            'Matricule'=> $request->input('matricule'),
            'ID_Formation'=> $request->input('id_formation'),
            'Mode_Financement'=>$request->input('mode_de_financement'),
            'Frais_Pedagogiques'=>$request->input('frais_pedagogiques'),
            'Frais_Hebergement'=>$request->input('frais_hebergem_restauration'),
            'Frais_Transport'=>$request->input('frais_transport'),
            'Observation'=>$request->input('observation'),
        ]);

        return response()->json(['message' => 'notifié ajouté']);
    }
    public function notifiemodify(Request $request)
    {
        $id= $request->input('id_n');
        Plan::where('ID_N',$id)->update([
            'Matricule'=> $request->input('matricule'),
            'ID_Formation'=> $request->input('id_formation'),
            'Mode_Financement'=>$request->input('mode_de_financement'),
            'Frais_Pedagogiques'=>$request->input('frais_pedagogiques'),
            'Frais_Hebergement'=>$request->input('frais_hebergem_restauration'),
            'Frais_Transport'=>$request->input('frais_transport'),
            'Observation'=>$request->input('observation'),
        ]);

        return response()->json(['message' => 'notifié modifié']);


    }
    public function notifiedelete(Request $request)
    {
        $id= $request->input('id_n');    
        Plan::where('ID_N',$id)->delete();

        return response()->json(['message' => 'notifié supprimé']);
    }
}
