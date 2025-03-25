<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEmployeeRequest;
use App\Models\Employe;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class EmployeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $employes = Employe::all(); // Assuming your model is named "Employe"
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
        // $validated = $request->validated();
        // $employe = Employe::where('Matricule', $matricule)
        //     ->update($validated);

        // if (!$employe) {
        //     return response()->json([
        //         'message' => 'Employee not found',
        //         'errors' => ['matricule' => 'No employee found with this matricule']
        //     ], 404);
        // }
        // return response()->json([
        //     'message' => 'Employee updated successfully',
        //     'data' => $employe
        // ]);
        $validated = $request->validated();
        Employe::where('Matricule', $matricule)->update($validated);

        // Retrieve the updated employee
        $employe = Employe::where('Matricule', $matricule)->first();

        return response()->json([
            'message' => 'Employee updated successfully',
            'data' => $employe
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
