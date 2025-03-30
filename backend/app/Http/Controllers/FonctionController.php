<?php

namespace App\Http\Controllers;

use App\Models\Fonction;
use Illuminate\Http\Request;

class FonctionController extends Controller
{
    function getAllFonctions(Request $request)
    {
        $fonction  = Fonction::all();
        return response()->json(['sucess' => 'bien marché' , "Fonctions" => $fonction]);
    }
    function CreateFonction(Request $request)
    {
        $fonction = Fonction::create([
            'CodeFonction' => $request->input('CodeFonction'),
            'TypeFonction' => $request->input('TypeFonction'),
            'IntituleFonction' => $request->input('IntituleFonction')
        ]);
        return response()->json(['message' => 'Fonction created successfully', 'data' => $fonction], 201);
    }
}
