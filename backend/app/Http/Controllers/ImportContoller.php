<?php

namespace App\Http\Controllers;

use App\Exports\DemandeConfirmationExport;
use App\Exports\NotifieExport;
use App\Exports\PrevExport;
use App\Imports\NotifieImport;
use App\Imports\PrevImport;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Validators\ValidationException;

class ImportContoller extends Controller
{
    //
    public function previmport(Request $request)
    {

            $import = new PrevImport();
            Excel::import($import , $request->file('previsions'));

            if (!empty($import->failedRows)) {
                return response()->json([
                    'message' => 'Some rows failed validation.',
                    'errors' => $import->failedRows,
                ], 422);
            }
        
            return response()->json([
                'message' => 'All Previsions imported successfully.',
            ]);
    }

    public function notifieimport(Request $request)
    {
        try {
            Excel::import(new NotifieImport, request()->file('plan'));

<<<<<<< HEAD
            return response()->json([
                'success' => true,
                'message' => 'NT Data received successfully!'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'importation du fichier : ' . $e->getMessage()
            ], 500);
        }
=======
        $import = new NotifieImport();
        Excel::import($import, request()->file('plan'));

        if (!empty($import->failedRows)) {
            return response()->json([
                'message' => 'Some rows failed validation.',
                'errors' => $import->failedRows,
            ], 422);
        }
    
        return response()->json([
            'message' => 'Plan Notifié imported successfully.',
        ]);
>>>>>>> 483c630aa40344c825649e2e07c4c6ed508141ae
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
