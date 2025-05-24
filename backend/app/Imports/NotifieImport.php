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
use Maatwebsite\Excel\Concerns\WithCalculatedFormulas;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Validators\Failure;
use Illuminate\Support\Facades\Validator;


class NotifieImport implements ToCollection, WithHeadingRow,WithCalculatedFormulas
{
    private $errors = [];
    private $rowsSuccess = 0;
    public $failedRows ;

    protected $year;

    public function __construct($year)
    {
        $this->year = $year;
    }
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
   /*  public function onFailure(Failure ...$failures)
    {
        foreach ($failures as $failure) {
            $this->errors[] = [
                'row' => $failure->row(),
                'errors' => $failure->errors(),
                'values' => $failure->values()
            ];
            $this->rowsFailed++;
        }
    } */

    private function normalizeRowValues(array $row): array
    {
        return array_map(function ($value) {
            if (is_string($value)) {
                return mb_strtoupper(trim($value));
            }
            return $value;
        }, $row);
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
        try{
        foreach ($collection as $index=>$row) {
            $validator = Validator::make($row->toArray(), $this->rules(), $this->customValidationMessages() ?? []);
                if ($validator->fails()) {
                    $this->failedRows[] = [
                        'row' => $index + 2, // +2 accounts for heading row + 0-based index
                        'errors' => $validator->errors()->all(),
                    ];
                    continue;
                }

                $row = $this->normalizeRowValues($row->toArray());
                $this->rowsSuccess++;

            Direction::insertOrIgnore([
                'Id_direction' => $row['unitecomplexedirection_regionalegroupement'],
                'Nom_direction'=> $row['direction'],
                'Structure'=> $row['structure_1'],
            ]);

            Fonction::insertOrIgnore([
                'CodeFonction' => $row['code_fonction'],
                'TypeFonction'=> $row['fonction_fcmfstfsp'],
                'IntituleFonction'=> $row['intitule_de_fonction'],
            ]);
            
            $organisme=Organisme::where('Nom_Organisme',$row['organisme_de_formation'])->where('Lieu_Formation', $row['lieu_du_deroulement_de_la_formation'])->first();
            if(!$organisme){
            $organisme = Organisme::create([
                    'Code_Organisme'=>$row['code_organisme_de_formation'], 
                    'Nom_Organisme'=>$row['organisme_de_formation'],
                    'Lieu_Formation'=>$row['lieu_du_deroulement_de_la_formation'],	
                    'Pays'=>$row['lieu_pays'],
            ]);
            }
            
            $formation=Formation::where('Intitule_Action', $row['intitule_de_laction'])->where('Id_Organisme', $organisme->Id_Organisme)->first();
            if (!$formation) {
                $formation = Formation::updateOrCreate([
                    'Domaine_Formation'=>$row['domaine_formation_fcm_fst_fsp'],
                    'Code_Domaine_Formation'=>$row['code_domaine_formation'],
                    'Intitule_Action'=>$row['intitule_de_laction'],
                    'Niveau_Formation'=>$row['niveau_de_la_formation_cible'],
                    'Nature_Formation'=>$row['nature_de_la_formation'],
                    'Source_Besoin'=>$row['source_du_besoins_en_formation'],
                    'Type_Formation'=>$row['type_formation'],
                    'Mode_Formation'=>$row['mode_formation'],
                    'Code_Formation'=>$row['code_formation'],
                    'Id_Organisme'=>$organisme->Id_Organisme,
                    'Heure_jour'=>$row['hj'],
                ]);
            }

            Employe::insertOrIgnore([
                //
                'Matricule'=>$row['matricule'],
                'prenomNom'=>$row['nom_prenom'],
                'Date_Naissance'=>$this->convertFrenchDate($row['date_de_naissance_jjmmaaaa']),
                'Date_Recrutement'=>$this->convertFrenchDate($row['date_de_recrutement_jjmmaaaa']),
                'Sexe'=>$row['sexe'],
                'CSP'=>$this -> translateCSP($row['csp_cadre_maitrise_execution']),
                'Echelle'=>$row['echelle'],
                'CodeFonction'=>$row['code_fonction'],
                'Id_direction'=>$row['unitecomplexedirection_regionalegroupement'],
            ]);

            $plan=Plan::where('Exercice',$this->year)->where('Matricule', $row['matricule'])->where('ID_Formation', $formation->ID_Formation)->first(); //where etat prevision
            if ($plan) {
                $plan->update([
                    'etat'=>'validé',
                    'Observation'=>$row['observation'],
                    /*'Date'=>$row[''],
                    'Date_Deb'=>$row[''],
                    'Date_fin'=>$row[''],*/
                    'Mode_Financement'=>$row['mode_de_financement'],
                    'Frais_Pedagogiques'=>$row['frais_pedagogiques'],
                    'Frais_Hebergement'=>$row['frais_hebergem_restauration'],
                    'Frais_Transport'=>$row['frais_transport'],
                    'observation_pre_arbitrage'=>$row['observation_pre_arbitrage'],
                    'observation_arbitrage'=>$row['observation_arbitrage'],
                    'Dont_Devise'=>$row['dont_devise'],
                    'Presalaire'=>$row['presalaire'],
                    'Autres_charges'=>$row['autres_charges'],
                ]);
            } else {
                Plan::create([
                    'etat'=>'validé',
                    'Observation'=>$row['observation'],
                    /*'Date'=>$row[''],
                    'Date_Deb'=>$row[''],
                    'Date_fin'=>$row[''],*/
                    'Matricule'=>$row['matricule'],
                    'ID_Formation'=>$formation->ID_Formation,
                    'Mode_Financement'=>$row['mode_de_financement'],
                    'Frais_Pedagogiques'=>$row['frais_pedagogiques'],
                    'Frais_Hebergement'=>$row['frais_hebergem_restauration'],
                    'Frais_Transport'=>$row['frais_transport'],
                    'Observation_pre_arbitrage'=>$row['observation_pre_arbitrage'],
                    'Observation_arbitrage'=>$row['observation_arbitrage'],
                    'Dont_Devise'=>$row['dont_devise'],
                    'Presalaire'=>$row['presalaire'],
                    'Autres_charges'=>$row['autres_charges'],
                    'Exercice'=>$this->year,
                ]);
            }
        }
            DB::commit();
            
        }catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
    /* public function getErrors()
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
    } */

    public function rules(): array
    {
        return [
            'matricule'  => 'required|string',
            'organisme_de_formation' => 'required|string',
            'lieu_du_deroulement_de_la_formation'=>'required|string',
            'intitule_de_laction'=>'required|string',
            'unitecomplexedirection_regionalegroupement'=>'required|string',
            'date_de_naissance_jjmmaaaa'=>'required',
            'date_de_recrutement_jjmmaaaa'=>'required',
            'code_fonction'=>'required',
        ];
    }

    public function customValidationMessages()
    {
        return [
            'matricule.required' => "Veuillez remplir le champ Matricule , s'il vous plaît",
            'organisme_de_formation.required' => "Veuillez remplir le champ Organisme De Formation , s'il vous plaît",
            'lieu_du_deroulement_de_la_formation.required' => "Veuillez remplir le champ Lieu Du Deroulement De La Formation , s'il vous plaît",
            'intitule_de_laction.required' => "Veuillez remplir le champ Intitule De L'action , s'il vous plaît",
            'unitecomplexedirection_regionalegroupement.required'=>"Veuillez remplir le champ Direction , s'il vous plaît",
            'date_de_naissance_jjmmaaaa.required'=>"Veuillez remplir le champ Date De Naissance , s'il vous plaît",
            'date_de_recrutement_jjmmaaaa.required'=>"Veuillez remplir le champ Date Recrutement , s'il vous plaît",
            'code_fonction'=>"Veuillez remplir le champ Code Fonction , s'il vous plaît. "
        ];
    }
}
