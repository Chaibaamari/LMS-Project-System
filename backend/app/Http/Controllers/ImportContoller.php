<?php

namespace App\Http\Controllers;

use App\Exports\DemandeConfirmationExport;
use App\Exports\NotifieExport;
use App\Exports\PrevExport;
use App\Imports\NotifieImport;
use App\Imports\PrevImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;

class ImportContoller extends Controller
{
    //
    public function previmport(Request $request)
    {
        try {
            Excel::import(new PrevImport, $request->file('previsions'));

            return response()->json([
                'success' => true,
                'message' => 'Importation des données PV réussie !'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'importation du fichier : ' . $e->getMessage()
            ], 500);
        }
    }

    public function notifieimport(Request $request)
    {

        Excel::import(new NotifieImport, request()->file('plan'));

        return response()->json(['message' => ' NT Data received successfully!']);
    }

    public function prevexport()
    {
        return Excel::download(new PrevExport, 'previsionsexporté.xlsx');
    }

    public function Notifieexport()
    {
        return Excel::download(new NotifieExport, 'plannotifieexporté.xlsx');
    }

    public function createDC(Request $request)
    {
        $ids = $request->input('ids');
        return Excel::download(new DemandeConfirmationExport($ids), 'demandedeconfirmation.xlsx');

    }

}
