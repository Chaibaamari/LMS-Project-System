<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DirectionController extends Controller
{
    function getAllDirections(Request $request)
    {

        // Employe::create()
        return response()->json(['sucess' => 'bien marché']);
    }
}
