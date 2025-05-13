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

            $start = Carbon::parse($month . '-01')->startOfMonth(); // 2024-04-01
            $end = Carbon::parse($month . '-01')->endOfMonth();     // 2024-04-30

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
                ->when($month, function ($query) use ($month,$end,$start) {
                    $query->where(function ($q) use ($month,$end,$start) {
                        $q->where('plans.Date_Deb', '<=', $end)
                            ->Where('plans.Date_fin', '>=', $start);
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
    public function getEmployeesByFormation($id)
    {
        $employees = Plan::where('ID_Formation', $id)->where('etat', 'confirmé')->with('employe')->with('formation')->get();
        return response()->json([
            'PlanCommand' => $employees
        ]);
    }

    // public function consultTBF(string $month)
    // {
    //     // $Exercice = request()->header('Year');
    //     //$plans = Plan::where('Exercice',$Exercice)->whereMonth('Date_Deb', $request->input('month'))->orWhereMonth('Date_Fin', $request->input('month'))->where('etat', 'confirmé')->get();

    //         // Grab the “YYYY‑MM” string from your query (e.g. "2024-04")
    //     $monthInput = $month;

    //     // Build full month start/end dates
    //     $monthStart = Carbon::parse("{$monthInput}-01")->startOfMonth(); // 2024‑04‑01 00:00:00
    //     $monthEnd   = Carbon::parse("{$monthInput}-01")->endOfMonth();   // 2024‑04‑30 23:59:59
    //     $Exercice = request()->header('Year');
    //     // Fetch any record whose [Date_Deb … Date_Fin] range overlaps [monthStart … monthEnd]
    //     $plans = Plan::where('Exercice',$Exercice)
    //                         ->where('etat', 'confirmé')
    //                         ->where('Date_Deb', '<=', $monthEnd)
    //                         ->where('Date_Fin',  '>=', $monthStart)
    //                         ->get();

    //     return response()->json(['message' => 'TBF retourné', 'Plan' => $plans]);
    // }
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
        // Get distinct month/year combinations from Date_Deb
        $activeDates = Plan::where('etat', 'confirmé')
            ->whereNotNull('Date_Deb')
            ->selectRaw('MONTH(Date_Deb) as month, YEAR(Date_Deb) as year')
            ->distinct()
            ->get();

        $results = [];

        foreach ($activeDates as $date) {
            $month = $date->month;
            $year = $date->year;
            $nomMois = $moisFrancais[$month];

            // Fetch all plans for the same month and year (from Date_Deb or Date_Fin)
            $plans = Plan::where('etat', 'confirmé')
                ->where('plans.Exercice', $Exercice)
                ->where(function ($query) use ($month, $year) {
                    $query->where(function ($q) use ($month, $year) {
                        $q->whereMonth('Date_Deb', $month)
                            ->whereYear('Date_Deb', $year);
                    })->orWhere(function ($q) use ($month, $year) {
                        $q->whereMonth('Date_Fin', $month)
                            ->whereYear('Date_Fin', $year);
                    });
                })
                ->get();

            if ($plans->isNotEmpty()) {
                $results[] = [
                    'Nom' => "TBF du mois de $nomMois $year",
                    'date_creation' => $plans->first()->Date_Deb->format('d/m/Y'),
                    'plans' => $plans
                ];
            }
        }

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
