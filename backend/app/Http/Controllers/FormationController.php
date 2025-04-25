<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function getAllIntituleActions()
    {
        try {
            $formations = Formation::query()
                ->join('organismes', 'formations.Id_Organisme', '=', 'organismes.Id_Organisme')
                ->select([
                    'formations.ID_Formation', // Include the primary key
                    'formations.Intitule_Action',
                    'organismes.Nom_Organisme',
                    'organismes.Lieu_Formation'
                ])
                ->distinct()
                ->orderBy('formations.Intitule_Action')
                ->get()
                ->map(function ($item) {
                    return [
                        'value' => $item->ID_Formation,
                        'label' => "{$item->Intitule_Action} - {$item->Nom_Organisme} ({$item->Lieu_Formation})",
                    ];
                });

            return response()->json([
                'success' => true,
                'Formation' => $formations,
                'message' => 'Liste des formations récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des formations',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getAllFormation(){
        $formations = Formation::all(); // Récupère toutes les formations depuis la table
        return response()->json(['formation' =>  $formations]);
    }
}
