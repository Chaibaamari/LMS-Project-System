<?php

namespace App\Http\Controllers;

use App\Models\Employe;
use Illuminate\Http\Request;

class EmployeController extends Controller
{
    function getAllEmployes(Request $request){

        // Employe::create()
        return response()->json([ 'sucess' => 'bien marché']);
    }
}
