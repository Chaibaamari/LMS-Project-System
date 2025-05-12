<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class FormationController extends Controller
{
    public function getAllIntituleActions()
    {
        try {
            $formations = Formation::query()
                ->join('organismes', 'formations.Id_Organisme', '=', 'organismes.Id_Organisme')
                ->join('plans', 'formations.Id_Formation', '=', 'plans.ID_Formation')
                ->select([
                    'formations.ID_Formation', // Include the primary key
                    'formations.Intitule_Action',
                    'organismes.Nom_Organisme',
                    'organismes.Lieu_Formation',
                    'plans.Exercice'
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

    public function getAllFormation()
    {
        try {
            $Exercice = request()->header('Year');
            $formations = Formation::query()
                ->leftJoin('plans', 'formations.ID_Formation', '=', 'plans.ID_Formation')
                ->where('plans.Exercice', $Exercice)
                ->select('formations.*', 'plans.Exercice') // Include needed fields
                ->get();

            return response()->json([
                'success' => true,
                'formation' => $formations,
                'message' => 'Formations récupérées avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des formations',
            ], 500);
        }
    }
    public function getPlansEnCours()
    {
        $today = Carbon::today(); // date d'aujourd'hui
        $Exercice = request()->header('Year'); // année extraite du header de la requête

        $formations = Formation::select(
            'formations.ID_Formation',
            'formations.Intitule_Action',
            'plans.Date_Deb',
            'plans.Date_fin',
        )
            ->leftJoin('plans', 'plans.ID_Formation', '=', 'formations.ID_Formation') // jointure correcte
            ->where('plans.etat', 'confirmé') // formations confirmées
            ->whereDate('plans.Date_Deb', '<=', $today) // date de début <= aujourd'hui
            ->whereDate('plans.Date_fin', '>', $today) // date de fin > aujourd'hui
            ->where('plans.Exercice', $Exercice) // filtre par exercice (année)
            ->groupBy([
                'formations.ID_Formation',
                'formations.Intitule_Action',
                'plans.Date_Deb',
                'plans.Date_fin',
                'plans.Exercice'
            ])
            ->get()->map(function ($formation) use ($today) {
                $dateDeb = Carbon::parse($formation->Date_Deb);
                $dateFin = Carbon::parse($formation->Date_fin);

                $totalDays = $dateDeb->diffInDays($dateFin);
                $daysPassed = $dateDeb->diffInDays($today);

                $formation->pourcentage = $totalDays > 0 ? round(($daysPassed / $totalDays) * 100) : 0;
                $formation->days_remaining = $dateFin->diffInDays($today);

                return $formation;
            });
        $formation_termine = Formation::select(
            'formations.ID_Formation',
            'formations.Intitule_Action',
            'plans.Date_Deb',
            'plans.Date_fin'
        )
            ->leftJoin('plans', 'plans.ID_Formation', '=', 'formations.ID_Formation') // jointure correcte
            // ->where('plans.Exercice', $Exercice) // filtre par exercice (année)
            ->where('plans.etat', 'confirmé') // formations confirmées
            ->whereDate('plans.Date_Deb', '<', $today) // date de début <= aujourd'hui
            ->whereDate('plans.Date_fin', '<=', $today) // date de fin > aujourd'hui
            ->groupBy([
                'formations.ID_Formation',
                'formations.Intitule_Action',
                'plans.Date_Deb',
                'plans.Date_fin'
            ])
            ->get();

        return response()->json([
            'enCour' => $formations,
            "termine" => $formation_termine,
        ]);
    }
}
