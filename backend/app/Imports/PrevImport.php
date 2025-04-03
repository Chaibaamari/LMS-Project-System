<?php

namespace App\Imports;

use App\Models\Direction;
use App\Models\Employe;
use App\Models\Fonction;
use App\Models\Formation;
use App\Models\Organisme;
use App\Models\Plan;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;
use Illuminate\Validation\Rule;
use Maatwebsite\Excel\Validators\Failure;

class PrevImport implements ToCollection, WithHeadingRow
{
    private $errors = [];
    private $rowsSuccess = 0;
    private $rowsFailed = 0;
    // public function rules(): array
    // { WithValidation
    //     // return [
    //     //     '*.direction' => 'required',
    //     //     '*.structure' => 'required',
    //     //     '*.code_fonction' => 'required',
    //     //     '*.fonction_fcmfstfsp' => ['required ', Rule::in(['FST', 'FSM', 'FSP'])],
    //     //     '*.intitule_de_fonction' => 'required',
    //     //     '*.code_organisme_de_formation' => ['required ', Rule::in(['ETR', 'SMA', 'IAP', 'CFA' , 'AO'])],
    //     //     '*.organisme_de_formation' => 'required',
    //     //     '*.lieu_du_deroulement_de_la_formation' => 'required',
    //     //     '*.intitule_de_laction' => 'required',
    //     //     '*.matricule' => 'required',
    //     //     '*.nom_prenom' => 'required',
    //     //     // 'date_de_naissance_jjmmaaaa' => 'required |date_format:Y-m-d',
    //     //     // 'date_de_recrutement_jjmmaaaa' => 'required ',
    //     // ];
    // }
    public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $this->errors[] = [
                'row' => $failure->row(),
                'errors' => $failure->errors(),
                'values' => $failure->values()
            ];
            $this->rowsFailed++;
        }
    }
    private function convertFrenchDate(?string $date): ?string
    {
        if (empty($date)) {
            return null;
        }

        try {
            // Handle Excel numeric dates (like 45000)
            if (is_numeric($date)) {
                return \PhpOffice\PhpSpreadsheet\Shared\Date::excelToDateTimeObject($date)
                    ->format('Y-m-d');
            }

            // Handle French format (JJ/MM/AAAA)
            return \Carbon\Carbon::createFromFormat('d/m/Y', $date)->format('Y-m-d');
        } catch (\Exception $e) {
            return null; // Will be rejected by validation
        }
    }
    private function translateCSP(?string $code): ?string
    {
        return match (strtoupper($code)) {
            'C' => 'Cadre',
            'M' => 'Maîtrise',
            'S' => 'Exécution',
            default => null,
        };
    }
    /**
     * @param Collection $collection
     */
    public function collection(Collection $collection)
    {
        //
        DB::beginTransaction();
        try {
            foreach ($collection as $row) {
                $this->rowsSuccess++;

                Direction::insertOrIgnore([
                    'Id_direction' => $row['direction'],
                    'Nom_direction' => $row['direction'],
                    'Structure' => $row['structure'],
                ]);

                Fonction::insertOrIgnore([
                    'CodeFonction' => $row['code_fonction'],
                    'TypeFonction' => $row['fonction_fcmfstfsp'],
                    'IntituleFonction' => $row['intitule_de_fonction'],
                ]);

                Organisme::insertOrIgnore([
                    'Code_Organisme' => $row['code_organisme_de_formation'],
                    'Nom_Organisme' => $row['organisme_de_formation'],
                    'Lieu_Formation' => $row['lieu_du_deroulement_de_la_formation'],
                    'Pays' => $row['lieu_pays'],
                ]);

                $formation = Formation::where('Intitule_Action', $row['intitule_de_laction'])->where('Nom_Organisme', $row['organisme_de_formation'])->first();
                if (!$formation) {
                    $formation = Formation::create([
                        'Domaine_Formation' => $row['domaine_formation_fcm_fst_fsp'],
                        'Code_Domaine_Formation' => $row['code_domaine_formation'],
                        'Intitule_Action' => $row['intitule_de_laction'],
                        'Niveau_Formation' => $row['niveau_de_la_formation_cible'],
                        'Nature_Formation' => $row['nature_de_la_formation'],
                        'Source_Besoin' => $row['source_du_besoins_en_formation'],
                        'Type_Formation' => $row['type_formation'],
                        'Mode_Formation' => $row['mode_formation'],
                        'Code_Formation' => $row['code_formation'],
                        'Nom_Organisme' => $row['organisme_de_formation'],
                        'Heure_jour' => $row['hj'],
                    ]);
                }

                Employe::insertOrIgnore([
                    //
                    'Matricule' => $row['matricule'],
                    'prenomNom' => $row['nom_prenom'],
                    'Date_Naissance' => $this->convertFrenchDate($row['date_de_naissance_jjmmaaaa']),
                    'Date_Recrutement' => $this->convertFrenchDate($row['date_de_recrutement_jjmmaaaa']),
                    'Sexe' => $row['sexe'],
                    'CSP' => $this -> translateCSP($row['csp_cadre_maitrise_execution']),
                    'Echelle' => $row['echelle'],
                    'CodeFonction' => $row['code_fonction'],
                    'Id_direction' => $row['direction'],
                ]);

                Plan::create([
                    'etat' => 'prévision',
                    /*'Observation'=>$row['observation'],
                'Date'=>$row[''],
                'Date_Deb'=>$row[''],
                'Date_fin'=>$row[''],*/
                    'Matricule' => $row['matricule'],
                    'ID_Formation' => $formation->ID_Formation,
                    /*'Mode_Financement'=>$row['mode_de_financement'],
                'Frais_Pedagogiques'=>$row['frais_pedagogiques'],
                'Frais_Hebergement'=>$row['frais_hebergem_restauration'],
                'Frais_Transport'=>$row['frais_transport'],*/
                ]);
            }
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    public function getErrors()
    {
        return $this->errors;
    }

    public function getImportStats()
    {
        return [
            'success' => $this->rowsSuccess,
            'failed' => $this->rowsFailed,
            'total' => $this->rowsSuccess + $this->rowsFailed
        ];
    }
}
