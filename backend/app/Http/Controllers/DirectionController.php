<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Direction;

class DirectionController extends Controller
{
    function getAllDirections(Request $request)
    {

        // Employe::create()
        return response()->json(['sucess' => 'bien marché']);
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