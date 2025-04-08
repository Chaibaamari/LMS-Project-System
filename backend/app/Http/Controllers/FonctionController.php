<?php

namespace App\Http\Controllers;

use App\Http\Requests\Fonction\StoreFonctionRequest;
use App\Models\Fonction;
use Illuminate\Http\Request;

class FonctionController extends Controller
{
    function getAllFonctions(Request $request)
    {
        $fonction  = Fonction::all();
        return response()->json(['sucess' => 'bien marché' , "Fonctions" => $fonction]);
    }
    function CreateFonction(StoreFonctionRequest $request)
    {
        $validated = $request->validated();
        $fonction = Fonction::create($validated);

        /*$fonction = Fonction::create([
            'CodeFonction' => $request->input('CodeFonction'),
            'TypeFonction' => $request->input('TypeFonction'),
            'IntituleFonction' => $request->input('IntituleFonction')
        ]);*/
        return response()->json(['message' => 'Fonction created successfully', 'data' => $fonction], 201);
    }
}
