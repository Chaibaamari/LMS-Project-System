<?php

namespace App\Http\Controllers;

use App\Models\Direction;
use Illuminate\Http\Request;

class DirectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function getAllDirections()
    {
        $directions = Direction::all(); // Assuming your model is named "Employe"
        return response()->json(['directions' => $directions]);
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
