<?php

namespace App\Http\Controllers;

use App\Models\Direction;
use Illuminate\Http\Request;

class DirectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $directions = Direction::all(); // Assuming your model is named "Employe"
        return response()->json(['directions' => $directions]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }


    // Récupérer une direction avec ses détails

    public function getDirectionById($id)
    {
        $direction = Direction::find($id);

        if (!$direction) {
            return response()->json(['error' => 'Direction non trouvée'], 404);
        }

        return response()->json($direction);
    }

    // Mettre à jour le responsable et son email
    
    public function updateResponsable(Request $request, $id)
    {
        $request->validate([
            'NomResponsable' => 'required|string|max:255',
            'Email' => 'required|email|max:255',
        ]);

        $direction = Direction::find($id);

        if (!$direction) {
            return response()->json(['error' => 'Direction non trouvée'], 404);
        }

        $direction->update([
            'NomResponsable' => $request->NomResponsable,
            'Email' => $request->Email,
        ]);

        return response()->json(['success' => 'Responsable mis à jour avec succès', 'direction' => $direction]);
    }


}