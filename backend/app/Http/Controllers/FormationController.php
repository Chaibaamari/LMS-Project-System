<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\Organisme;
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
            // $Exercice = request()->header('Year');
            $formations = Formation::query()
                ->select('formations.*') // Include needed fields
                ->get();

            return response()->json([
                'success' => true,
                'count' => $formations->count(),
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
        // $Exercice = request()->header('Year'); // année extraite du header de la requête

        $formations = Formation::select(
            'formations.ID_Formation',
            'formations.Intitule_Action',
            'plans.Date_Deb',
            'plans.Date_fin',
        )
            ->leftJoin('plans', 'plans.ID_Formation', '=', 'formations.ID_Formation') // jointure correcte
            ->where('plans.etat', 'confirmé') // formations confirmées
            ->whereDate('plans.Date_Deb', '<=', $today) // date de début <= aujourd'hui
            ->whereDate('plans.Date_fin', '>=', $today) // date de fin > aujourd'hui
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
        )
            ->leftJoin('plans', 'plans.ID_Formation', '=', 'formations.ID_Formation') // jointure correcte
            ->where('plans.etat', 'confirmé') // formations confirmées
            ->whereDate('plans.Date_fin', '<', $today) // date de fin < aujourd'hui
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

    public function getAllOrgaisme()
    {
        try {
            $organismes = Organisme::query()
                ->select([
                    'Id_Organisme', // Assuming this is the primary key
                    'Nom_Organisme',
                    'Lieu_Formation',
                ])
                ->get()
                ->map(function ($item) {
                    return [
                        'value' => $item->Id_Organisme, // Assuming ID_Organisme is the primary key
                        'label' => "{$item->Nom_Organisme} ({$item->Lieu_Formation})",
                    ];
                });

            return response()->json([
                'success' => true,
                'Organisme' => $organismes,
                'message' => 'Liste des organismes récupérée avec succès'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des organismes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function createFormation(Request $request)
    {
        $validated = $request->validate([
            'Intitule_Action' => 'required|string|max:255',
            'Id_Organisme' => 'required|exists:organismes,Id_Organisme',
            'Mode_Formation' => 'required|string|max:50',
            'Domaine_Formation' => 'required|string|max:50',
            'Code_Domaine_Formation' => 'required|string|max:50',
            'Niveau_Formation' => 'required|string|max:50',
            'Nature_Formation' => 'required|string|max:50',
            'Source_Besoin' => 'required|string|max:50',
            'Type_Formation' => 'required|string|max:50',
            'Code_Formation' => 'required|string|max:50',
            'Heure_jour' => 'required|integer|min:1|max:24',
        ]);

        try {
            $formation = Formation::create($validated);
            return response()->json([
                'success' => true,
                'message' => 'Formation created successfully',
                'data' => $formation
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error creating formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
