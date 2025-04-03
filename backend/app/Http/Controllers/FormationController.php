<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use Illuminate\Http\Request;

class FormationController extends Controller
{
    public function getAllIntituleActions()
    {
        try {
            // Get all unique Intitule_Action values from formations table
            $intitules = Formation::select('Intitule_Action')
                ->distinct()
                ->orderBy('Intitule_Action')
                ->get()
                ->pluck('Intitule_Action');

            return response()->json([
                'success' => true,
                'Formation' => $intitules,
                'message' => 'Liste des Intitulé d\'Actions récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des Intitulé d\'Actions',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
