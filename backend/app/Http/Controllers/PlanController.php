<?php

namespace App\Http\Controllers;

use App\Http\Requests\Plan\StorePlanRequest;
use App\Models\Employe;
use App\Models\Formation;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class PlanController extends Controller
{
    public function createBC(Request $request)
    {
        $ids = $request->input("ids");
        Plan::whereIn('ID_N', $ids)->update([
            'etat' => 'confirmé',
            'Budget' => $request->input('Budget'),
            'Date_Deb' => $request->input('date_deb'),
            'Date_fin' => $request->input('date_fin'),

        ]);

        return response()->json(['message' => 'bon de commande crée']);
    }

    public function consultBC(Request $request)
    {
        try {
            $Exercice = request()->header('Year');
            $formations = Formation::select(
                'formations.ID_Formation',
                'formations.Intitule_Action',
                DB::raw('COUNT(plans.ID_N) as Nombre_Employe'),
                'plans.Budget',
                'plans.Date_Deb',
                'plans.Date_fin'
            )
                ->where('plans.Exercice', $Exercice)
                ->join('plans', 'plans.ID_Formation', '=', 'formations.ID_Formation')
                ->where('plans.etat', 'confirmé')
                ->groupBy([
                    'formations.ID_Formation',
                    'formations.Intitule_Action',
                    'plans.Budget',
                    'plans.Date_Deb',
                    'plans.Date_fin'
                ])
                ->get();

            return response()->json([
                'success' => true,
                'data' => $formations,
                'count' => $formations->count()
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function consultBCMonth(Request $request, $month)
    {
        try {
            $request->validate([
                'month' => 'nullable|integer|between:1,12'
            ]);

            $Exercice = request()->header('Year');

            // Noms des mois en français
            $moisFrancais = [
                1 => 'janvier',
                2 => 'février',
                3 => 'mars',
                4 => 'avril',
                5 => 'mai',
                6 => 'juin',
                7 => 'juillet',
                8 => 'août',
                9 => 'septembre',
                10 => 'octobre',
                11 => 'novembre',
                12 => 'décembre'
            ];

            // $start = Carbon::parse($month . '-01')->startOfMonth(); // 2024-04-01
            // $end = Carbon::parse($month . '-01')->endOfMonth();     // 2024-04-30
            $Exercice = request()->header('Year') ?? date('Y');
            $start = Carbon::create($Exercice, $month, 1)->startOfMonth();
            $end = Carbon::create($Exercice, $month, 1)->endOfMonth();

            $formations = Formation::select(
                'formations.ID_Formation',
                'formations.Intitule_Action',
                DB::raw('COUNT(plans.ID_N) as Nombre_Employe'),
                'plans.Budget',
                'plans.Date_Deb',
                'plans.Date_fin'
            )
                ->where('plans.Exercice', $Exercice)
                ->join('plans', 'plans.ID_Formation', '=', 'formations.ID_Formation')
                ->where('plans.etat', 'confirmé')
                ->when($month, function ($query) use ($month, $end, $start) {
                    $query->where(function ($q) use ($month, $end, $start) {
                        $q->whereDate('plans.Date_Deb', '<=', $end)
                            ->WhereDate('plans.Date_fin', '>=', $start);
                    });
                })
                ->groupBy([
                    'formations.ID_Formation',
                    'formations.Intitule_Action',
                    'plans.Budget',
                    'plans.Date_Deb',
                    'plans.Date_fin'
                ])
                ->get();

            return response()->json([
                'success' => true,
                'Nom' => 'BC du mois de ' . $moisFrancais[$month], // Champ demandé
                'Date_creation' => now()->format('d/m/Y \à H\hi'), // Champ demandé
                'data' => $formations,
                'count' => $formations->count(),
                'meta' => [
                    'month' => $month,
                    'month_name' => $moisFrancais[$month]
                ]
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la récupération des données',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function getEmployeesByFormation(Request $request, $id)
    {
        setlocale(LC_TIME, 'fr_FR.utf8');
        $dateStart = urldecode($request->query('dateDebut'));
        $dateEnd = urldecode($request->query('dateFin'));
        try {
            // Remove any extra whitespace
            $StringDateStart = preg_replace('/\s+/', ' ', trim($dateStart));
            $StringDateEnd = preg_replace('/\s+/', ' ', trim($dateEnd));

            // Try Carbon which handles locales better
            $dateDeb = \Carbon\Carbon::createFromLocaleFormat('d F Y', 'fr', $StringDateStart);
            $dateFin = \Carbon\Carbon::createFromLocaleFormat('d F Y', 'fr', $StringDateEnd);

            if (!$dateDeb) {
                throw new \Exception("Could not parse date");
            }
            if (!$dateFin) {
                throw new \Exception("Could not parse date");
            }

            $formattedDate = $dateDeb->format('Y-m-d');
            $formattedDateFin = $dateFin->format('Y-m-d');
            $employees = DB::table('employes as E')
                ->join('directions as D', 'E.Id_direction', '=', 'D.id_direction')
                ->join('plans as P', 'P.Matricule', '=', 'E.Matricule')
                ->join('formations as F', 'P.ID_Formation', '=', 'F.ID_Formation')
                ->join('organismes as O', 'F.Id_Organisme', '=', 'O.Id_Organisme')
                ->select([
                    'P.ID_N',
                    'D.Structure',
                    'D.Nom_direction',
                    'E.Matricule',
                    'E.CodeFonction',
                    'E.Id_direction',
                    'E.prenomnom',
                    'E.Date_Naissance',
                    'E.Sexe',
                    'E.CSP',
                    'F.Domaine_Formation',
                    'F.Code_Domaine_Formation',
                    'F.Intitule_Action',
                    'F.Nature_Formation',
                    'F.Intitule_Action',
                    'F.Source_Besoin',
                    'F.Type_Formation',
                    'F.Mode_Formation',
                    'F.Code_Formation',
                    'O.Code_Organisme',
                    'O.Nom_Organisme',
                    'O.Lieu_Formation',
                    'O.Pays',
                    'P.Date_Deb',
                    'P.Date_fin',
                    'F.Heure_jour',
                    'P.Type_Pension',
                    'P.Observation',
                    'P.Budget'
                ])
                ->where('P.ID_Formation', $id)
                ->where('P.etat', 'confirmé')
                ->whereDate('P.Date_Deb', $formattedDate)
                ->whereDate('P.Date_Fin', $formattedDateFin)
                ->get();

            return response()->json([
                'success' => true,
                'PlanCommand' => $employees,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Date parsing failed',
                'message' => $e->getMessage(),
            ], 400);
        }
    }
    public function consultTBF(Request $request)
    {
        $moisFrancais = [
            1 => 'janvier',
            2 => 'février',
            3 => 'mars',
            4 => 'avril',
            5 => 'mai',
            6 => 'juin',
            7 => 'juillet',
            8 => 'août',
            9 => 'septembre',
            10 => 'octobre',
            11 => 'novembre',
            12 => 'décembre'
        ];

        $Exercice = request()->header('Year');

        // Get all confirmed plans for the given year
        $plans = Plan::where('etat', 'confirmé')
            ->where('Exercice', $Exercice)
            ->whereNotNull('Date_Deb')
            ->whereNotNull('Date_Fin')
            ->get();

        $results = [];

        foreach ($plans as $plan) {
            $start = Carbon::parse($plan->Date_Deb);
            $end = Carbon::parse($plan->Date_fin);

            // Generate all months between start and end dates
            $current = $start->copy()->startOfMonth();
            $endMonth = $end->copy()->endOfMonth();

            while ($current <= $endMonth) {
                $month = $current->month;
                $year = $current->year;
                $nomMois = $moisFrancais[$month];

                // Check if this month-year already exists in results
                $foundKey = null;
                foreach ($results as $key => $result) {
                    if ($result['month'] == $month && $result['year'] == $year) {
                        $foundKey = $key;
                        break;
                    }
                }
                // If month exists, add the plan to it
                if ($foundKey !== null) {
                    if (!in_array($plan->toArray(), $results[$foundKey]['plans']->toArray())) {
                        $results[$foundKey]['plans']->push($plan);
                    }
                }
                else {
                    // Otherwise, create a new entry
                    $results[] = [
                        'Nom' => "TBF du mois de $nomMois $year",
                        'date_creation' => $plan->Date_Deb->format('d/m/Y'),
                        'month' => $month,
                        'year' => $year,
                        'plans' => collect([$plan]) // Initialize with the current plan
                    ];
                }

                $current->addMonth(); // Move to the next month
            }
        }
        // Sort by year and month
        usort(
            $results,
            fn($a, $b) =>
            $a['year'] === $b['year']
                ? $a['month'] <=> $b['month']
                : $a['year'] <=> $b['year']
        );
        return response()->json([
            'message' => 'TBF regroupés par mois et année',
            'TBF' => $results
        ]);
    }

    public function consultBilan()
    {
        $plans = Plan::where('etat', 'confirmé')->get();
        $Exercice = request()->header('Year');
        $plans = Plan::where('Exercice', $Exercice)->where('etat', 'confirmé')->get();

        return response()->json(['message' => 'Bilan retourné', 'Plan' => $plans]);
    }

    public function consultprev()
    {
        $Exercice = request()->header('Year');

        $plans = Plan::where('Exercice', $Exercice)->where('etat', 'prévision')->with([
            'employe.direction',
            'employe.fonction',
            'formation.organisme',
        ])->get();

        return response()->json(['message' => 'previsions loaded succesfully', 'Plan' => $plans]);
    }



    public function prevadd(Request $request)
    {
        $validatedData = $request->validate([
            'Matricule' => 'required|string|exists:employes,Matricule',
            'ID_Formation' => 'required|exists:formations,ID_Formation',
            // Add other required fields if needed
        ]);

        try {
            // Find the formation to get its ID
            $Exercice = $request->header('Year');
            $formation = Formation::where('ID_Formation', $validatedData['ID_Formation'])->firstOrFail();
            $existingPlan = Plan::where('Exercice', $Exercice)->where('Matricule', $validatedData['Matricule'])
                ->where('ID_Formation', $formation->ID_Formation)
                ->where('etat', 'prévision')
                ->first();

            if ($existingPlan) {
                return response()->json([
                    'status' => 409,
                    'success' => false,
                    'message' => 'Une prévision existe déjà pour cet employé et cette formation'
                ], 409);
            }
            $plan = Plan::create([
                'Exercice' => $Exercice,
                'etat' => 'prévision',
                'Matricule' => $validatedData['Matricule'],
                'ID_Formation' => $formation->ID_Formation,
                // Add other default values or fields from request
            ]);
            $plan->load([
                'employe.direction',
                'employe.fonction',
                'formation.organisme'
            ]);
            return response()->json([
                'status' => 201,
                'success' => true,
                'message' => 'Prévision ajoutée avec succès',
                'data' => $plan
            ], 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Employé ou formation introuvable'
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'success' => false,
                'message' => 'Erreur lors de la création de la prévision',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getPlanPV(string $ID_N)
    {

        $plan = Plan::where('ID_N', $ID_N)->first();
        return response()->json([
            'data' => $plan,
            'success' => true,
            'message' => 'Employee updated successfully'
        ]);
    }

    public function prevmodify(Request $request)
    {

        $id = $request->input('ID_N');
        Plan::where('ID_N', $id)->update([
            'ID_Formation' => $request->input('ID_Formation'),
        ]);

        return response()->json(['message' => 'plan a été bien modifié']);
    }

    public function destroy($id)
    {
        try {
            $plan = Plan::where('ID_N', $id)->first();

            if (!$plan) {
                return response()->json(['error' => 'plan not found'], 404);
            }
            $deleted = $plan->delete();

            if (!$deleted) {
                throw new \Exception('Delete operation failed');
            }

            return response()->json(['message' => 'plan deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function destroyMultiple(Request $request)
    {
        try {
            $validated = $request->validate([
                'IDs' => 'required|array',
                'IDs.*' => 'string'
            ]);

            Plan::whereIn('ID_N', $validated['IDs'])->delete();

            return response()->json(['message' => 'Plans deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete Plans'], 500);
        }
    }

    public function consultnotifie()
    {
        $Exercice = request()->header('Year');

        $plans = Plan::where('Exercice', $Exercice)->where('etat', 'validé')->with([
            'employe.direction',
            'employe.fonction',
            'formation.organisme',
        ])->get();

        return response()->json(['message' => 'plan notifié loaded succesfully', 'Plan' => $plans]);
    }
    public function notifieadd(Request $request)
    {
        $validatedData = $request->validate([
            'Matricule' => 'required|string|exists:employes,Matricule',
            'ID_Formation' => 'required|exists:formations,ID_Formation',
            'Mode_Financement' => 'numeric',
            'Frais_Pedagogiques' => 'numeric|min:0',
            'Frais_Hebergement' => 'numeric|min:0',
            'Frais_Transport' => 'numeric|min:0',
            'Observation' => 'string|max:500',
            'Type_Pension' => 'string',
            'Budget' => 'string',
            'Observation_pre_arbitrage' => 'string',
            'Observation_arbitrage' => 'string',
            'Autres_charges' => 'numeric',
            'Presalaire' => 'numeric',
            'Dont_Devise' => 'numeric',
        ]);
        $Exercice = $request->header('Year');
        try {

            // Find the formation to get its ID
            $formation = Formation::where('ID_Formation', $validatedData['ID_Formation'])->firstOrFail();
            $existingPlan = Plan::where('Exercice', $Exercice)->where('Matricule', $validatedData['Matricule'])
                ->where('ID_Formation', $formation->ID_Formation)
                ->where('etat', 'validé')
                ->first();

            if ($existingPlan) {
                return response()->json([
                    'status' => 409,
                    'success' => false,
                    'message' => 'Un Plan Notifiéé existe déjà pour cet employé et cette formation'
                ], 409);
            }
            $plan = Plan::create([
                'Exercice' => $Exercice,
                'etat' => 'validé',
                'Matricule' => $validatedData['Matricule'],
                'ID_Formation' => $validatedData['ID_Formation'],
                'Mode_Financement' => $validatedData['Mode_Financement'],
                'Frais_Pedagogiques' => $validatedData['Frais_Pedagogiques'],
                'Frais_Hebergement' => $validatedData['Frais_Hebergement'],
                'Frais_Transport' => $validatedData['Frais_Transport'],
                'Observation' => $validatedData['Observation'],
                'Type_Pension' => $validatedData['Type_Pension'],
                'Budget' => $validatedData['Budget'],
                'Observation_pre_arbitrage' => $validatedData['Observation_pre_arbitrage'],
                'Observation_arbitrage' => $validatedData['Observation_arbitrage'],
                'Autres_charges' => $validatedData['Autres_charges'],
                'Presalaire' => $validatedData['Presalaire'],
                'Dont_Devise' => $validatedData['Dont_Devise'],
            ]);

            return response()->json([
                'status' => 201,
                'success' => true,
                'message' => 'Plan de formation créé avec succès',
                'data' => $plan
            ], 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Plan de formation non trouvé',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'success' => false,
                'message' => 'Erreur lors de la création du plan de formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    public function notifiemodify(Request $request)
    {
        $validatedData = $request->validate([
            'Matricule' => 'required|string|exists:employes,Matricule',
            'ID_Formation' => 'required|exists:formations,ID_Formation',
            'Mode_Financement' => 'integer',
            'Frais_Pedagogiques' => 'numeric|min:0',
            'Frais_Hebergement' => 'numeric|min:0',
            'Frais_Transport' => 'numeric|min:0',
            'Observation' => 'string|max:500',
            'Type_Pension' => 'string',
            'Budget' => 'string',
            'Observation_pre_arbitrage' => 'string',
            'Observation_arbitrage' => 'string',
            'Autres_charges' => 'numeric',
            'Presalaire' => 'numeric',
            'Dont_Devise' => 'numeric',
        ]);
        try {
            $id = $request->input('ID_N');
            Plan::where('ID_N', $id)->update([
                'Matricule' => $validatedData['Matricule'],
                'ID_Formation' => $validatedData['ID_Formation'],
                'Mode_Financement' => $validatedData['Mode_Financement'],
                'Frais_Pedagogiques' => $validatedData['Frais_Pedagogiques'],
                'Frais_Hebergement' => $validatedData['Frais_Hebergement'],
                'Frais_Transport' => $validatedData['Frais_Transport'],
                'Observation' => $validatedData['Observation'],
                'Type_Pension' => $validatedData['Type_Pension'],
                'Budget' => $validatedData['Budget'],
                'Observation_pre_arbitrage' => $validatedData['Observation_pre_arbitrage'],
                'Observation_arbitrage' => $validatedData['Observation_arbitrage'],
                'Autres_charges' => $validatedData['Autres_charges'],
                'Presalaire' => $validatedData['Presalaire'],
                'Dont_Devise' => $validatedData['Dont_Devise'],
            ]);

            return response()->json([
                'status' => 201,
                'success' => true,
                'message' => 'Plan de formation modifé avec succès'
            ], 201);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            return response()->json([
                'status' => 404,
                'success' => false,
                'message' => 'Plan de formation non trouvé',
                'error' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'success' => false,
                'message' => 'Erreur lors de la mise à jour du plan de formation',
                'error' => $e->getMessage()
            ], 500);
        }
    }


    public function DeleteBondCommand(Request $request, $matricule)
    {
        try {
            $plan = Plan::where('ID_N', $request->input("ID_N"))->where(
                'Matricule',
                $matricule
            )->update([
                'etat' => 'validé'
            ]);

            if (!$plan) {
                return response()->json(['error' => 'plan ou bien Employee not exist'], 404);
            }

            return response()->json(['message' => 'plan deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function testyear(Request $request)
    {
        $customHeader = $request->header('Year');

        return response()->json(['year is ' => $customHeader]);
    }
}
