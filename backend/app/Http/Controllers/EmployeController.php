<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Models\Employe;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;

class EmployeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employes = Employe::with('Fonction')->get();

        return response()->json(['employes' => $employes]);
    }

    public function store(StoreEmployeeRequest $request)
    {
        $validated = $request->validated();

        try {
            $employe = Employe::create($validated);

            if (!$employe) {
                return response()->json([
                    'message' => 'Échec de l\'enregistrement de l\'employé.',
                    'success' => false
                ], 400);
            }

            return response()->json([
                'message' => 'Employé enregistré avec succès.',
                'data' => $employe,
                'success' => true
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Erreur lors de l\'enregistrement de l\'employé : ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }


    public function getEmployee(string $matricule)
    {
        $employe = Employe::where('Matricule', $matricule)->first();
        return response()->json([
            'message' => 'Employé récupéré avec succès.',
            'data' => $employe,
            'success' => true
        ]);
    }

    public function update(StoreEmployeeRequest $request, string $matricule)
    {
        DB::beginTransaction();

        try {
            $validated = $request->validated();

            $updated = Employe::where('Matricule', $matricule)->update($validated);

            if (!$updated) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Employé introuvable ou aucune modification effectuée.',
                    'success' => false
                ], 404);
            }

            $employe = Employe::where('Matricule', $matricule)->first();

            DB::commit();

            return response()->json([
                'message' => 'Employé mis à jour avec succès.',
                'data' => $employe,
                'success' => true
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Échec de la mise à jour de l\'employé  ',
                'success' => false
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($matricule)
    {
        try {
            $employee = Employe::where('Matricule', $matricule)->first();

            if (!$employee) {
                return response()->json(['error' => 'Employee not found'], 404);
            }
            $deleted = $employee->delete();

            if (!$deleted) {
                throw new \Exception('Delete operation failed');
            }

            return response()->json(['message' => 'Employee deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }
    public function destroyMultiple(Request $request)
    {
        try {
            $validated = $request->validate([
                'matricules' => 'required|array',
                'matricules.*' => 'string'
            ]);

            Employe::whereIn('Matricule', $validated['matricules'])->delete();

            return response()->json(['message' => 'Employees deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete employees'], 500);
        }
    }

}
