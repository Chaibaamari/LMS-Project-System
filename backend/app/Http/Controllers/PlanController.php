<?php

namespace App\Http\Controllers;

use App\Http\Requests\Plan\StorePlanRequest;
use App\Models\Formation;
use App\Models\Plan;
use Illuminate\Http\Request;

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

        $formation = Formation::where('Intitule_Action', $request->input('nomFormation'))->where('Nom_Organisme', $request->input('nomOrganisme'))->first();
        $plans = Plan::where('ID_Formation', $formation->ID_Formation)->where('etat', 'confirmé')->get();
        return response()->json(['message' => 'bon de commande retourné', 'Plan' => $plans]);
    }

    public function consultTBF(Request $request)
    {

        $plans = Plan::whereMonth('Date_Deb', $request->input('month'))->orWhereMonth('Date_Fin', $request->input('month'))->where('etat', 'confirmé')->get();

        return response()->json(['message' => 'TBF retourné', 'Plan' => $plans]);
    }

    public function consultBilan(Request $request)
    {

        $plans = Plan::where('etat', 'confirmé')->get();

        return response()->json(['message' => 'Bilan retourné', 'Plan' => $plans]);
    }

    public function consultprev()
    {
        $plans = Plan::where('etat', 'prévision')->with([
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
            $formation = Formation::where('ID_Formation', $validatedData['ID_Formation'])->firstOrFail();
            $existingPlan = Plan::where('Matricule', $validatedData['Matricule'])
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

        return response()->json(['message' => 'previsions modifié']);
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
        $plans = Plan::where('etat', 'validé')->with([
            'employe.direction',
            'employe.fonction',
            'formation.organisme',
        ])->get();

        return response()->json(['message' => 'plan notifié loaded succesfully', 'Plan' => $plans]);
    }
    public function notifieadd(StorePlanRequest $request)
    {
        Plan::create([
            'etat' => 'validé',
            'Matricule' => $request->input('matricule'),
            'ID_Formation' => $request->input('id_formation'),
            'Mode_Financement' => $request->input('mode_de_financement'),
            'Frais_Pedagogiques' => $request->input('frais_pedagogiques'),
            'Frais_Hebergement' => $request->input('frais_hebergem_restauration'),
            'Frais_Transport' => $request->input('frais_transport'),
            'Observation' => $request->input('observation'),
        ]);

        return response()->json(['message' => 'notifié ajouté']);
    }
    public function notifiemodify(Request $request)
    {
        $id = $request->input('id_n');
        Plan::where('ID_N', $id)->update([
            'Matricule' => $request->input('matricule'),
            'ID_Formation' => $request->input('id_formation'),
            'Mode_Financement' => $request->input('mode_de_financement'),
            'Frais_Pedagogiques' => $request->input('frais_pedagogiques'),
            'Frais_Hebergement' => $request->input('frais_hebergem_restauration'),
            'Frais_Transport' => $request->input('frais_transport'),
            'Observation' => $request->input('observation'),
        ]);

        return response()->json(['message' => 'notifié modifié']);
    }
    public function notifiedelete(Request $request)
    {
        $id = $request->input('id_n');
        Plan::where('ID_N', $id)->delete();

        return response()->json(['message' => 'notifié supprimé']);
    }
}
