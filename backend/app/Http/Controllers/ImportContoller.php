<?php

namespace App\Http\Controllers;

use App\Exports\DemandeConfirmationExport;
use App\Exports\NotifieExport;
use App\Exports\PrevExport;
use App\Imports\NotifieImport;
use App\Imports\PrevImport;
use App\Mail\SendDC;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use App\Mail\SendExcelFile;
use App\Models\Plan;
use Illuminate\Support\Facades\Mail;
use Maatwebsite\Excel\Validators\ValidationException;

class ImportContoller extends Controller
{
    //
    public function previmport(Request $request)
    {
        $Exercice = $request->header('Year');
        $import = new PrevImport($Exercice);
        Excel::import($import, $request->file('previsions'));

        if (!empty($import->failedRows) || !empty($import->existingRows)) {
            return response()->json([
                'message' => 'Some rows failed inserting.',
                'status' => 'failed',
                'errors' => $import->failedRows,
                'existing' => $import->existingRows,
            ], 422);
        }

        return response()->json([
            'message' => 'Importation des prévisions effectuée avec succès.',
            'status' => 'success',
        ]);
    }

    public function notifieimport(Request $request)
    {
        $Exercice = $request->header('Year');
        $import = new NotifieImport($Exercice);
        Excel::import($import, request()->file('plan'));

        if (!empty($import->failedRows)) {
            return response()->json([
                'message' => 'Some rows failed validation.',
                'errors' => $import->failedRows,
            ], 422);
        }

        return response()->json([
            'message' => 'Le plan notifié a été importé avec succès.',
            'status' => 'success',
        ]);

    }

    public function prevexport()
    {
        $Exercice = request()->header('Year');
        $import = new PrevExport($Exercice);

        return Excel::download($import, 'previsionsexporté.xlsx');
    }

    public function Notifieexport()
    {
        $Exercice = request()->header('Year');
        $import = new NotifieExport($Exercice);

        return Excel::download($import, 'plannotifieexporté.xlsx');
    }

    /* public function createDC(Request $request)
    {
        $ids = $request->input('ids');
        return Excel::download(new DemandeConfirmationExport($ids), 'demandedeconfirmation.xlsx');
    } */

    public function createDC(Request $request)
    {
        $ids = $request->input('ids');


        $excelData = Excel::raw(new DemandeConfirmationExport($ids), 'Xlsx');



        $firstUserId = $request->input('ids.0');



        $record = Plan::where('ID_N',$firstUserId)->with(['employe.direction'])->first();
        $direction = $record->employe->direction;
        
        if(!$direction->Email){
            return response()->json(['success' => false,'message'=>"Email de responsable inexistant, veulliez remplir les informations de reponsable s'il vous plait"]);
        }


        Mail::to($direction->Email)->send(new SendDC($excelData,$direction));
        
                
        return response()->json(['success' => true,'message'=>'un Email avec les demandes de confirmation a été envoyé au responsable']);
    }
}
