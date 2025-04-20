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
        try{

            $import = new PrevImport();
            Excel::import($import , $request->file('previsions'));

            if (!empty($import->failedRows)) {
                return response()->json([
                    'message' => 'Certaines lignes n’ont pas réussi la validation.',
                    'status' => 'failed',
                    'errors' => $import->failedRows,
                ], 422);
            }

            return response()->json([
                'message' => 'Importation des prévisions effectuée avec succès.',
                'status' => 'success',
            ]);
        }catch (ValidationException $e) {
            $failures = $e->failures();
            $failedRows = [];

            foreach ($failures as $failure) {
                $row = $failure->row();
                $errors = $failure->errors();
                $failedRows[] = [
                    'row' => $row,
                    'errors' => $errors,
                ];
            }

            return response()->json([
                'message' => 'Certaines lignes n’ont pas passé les contrôles de validation.',
                'status' => 'failed',
                'errors' => $failedRows,
            ], 422);
        }
    }

    public function notifieimport(Request $request)
    {
        try {
        $import = new NotifieImport();
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
        } catch (ValidationException $e) {
            $failures = $e->failures();
            $failedRows = [];

            foreach ($failures as $failure) {
                $row = $failure->row();
                $errors = $failure->errors();
                $failedRows[] = [
                    'row' => $row,
                    'errors' => $errors,
                ];
            }

            return response()->json([
                'message' => 'Certaines lignes n’ont pas passé les contrôles de validation.',
                'status' => 'failed',
                'errors' => $failedRows,
            ], 422);
        }
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
