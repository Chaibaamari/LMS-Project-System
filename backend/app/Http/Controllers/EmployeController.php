<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Models\Employe;
use Illuminate\Support\Facades\DB;

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

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreEmployeeRequest $request)
    {
        $validated = $request->validated();
        Employe::create($validated);
        return response()->json($validated, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(StoreEmployeeRequest $request, string $matricule)
    {
        DB::beginTransaction();

        try {
            $validated = $request->validated();

            $updated = Employe::where('Matricule', $matricule)->update($validated);

            if (!$updated) {
                DB::rollBack();
                return response()->json([
                    'message' => 'Employee not found or no changes made',
                    'success' => false
                ], 404);
            }

            $employe = Employe::where('Matricule', $matricule)->first();

            DB::commit();

            return response()->json([
                'message' => 'Employee updated successfully',
                'data' => $employe,
                'success' => true
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update employee: ' . $e->getMessage(),
                'success' => false
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
