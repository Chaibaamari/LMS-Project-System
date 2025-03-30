<?php

namespace App\Imports;

use App\Models\Direction;
use App\Models\Employe;
use App\Models\Fonction;
use App\Models\Formation;
use App\Models\Organisme;
use App\Models\Plan;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;
use Maatwebsite\Excel\Concerns\WithHeadingRow;

class PrevImport implements ToCollection,WithHeadingRow
{
    /**
    * @param Collection $collection
    */
    public function collection(Collection $collection)
    {
        //
        foreach ($collection as $row) {


            Direction::insertOrIgnore([
                'Id_direction' => $row['direction'],
                'Nom_direction'=> $row['direction'],
                'Structure'=> $row['structure'],
            ]);

            Fonction::insertOrIgnore([
                'CodeFonction' => $row['code_fonction'],
                'TypeFonction'=> $row['fonction_fcmfstfsp'],
                'IntituleFonction'=> $row['intitule_de_fonction'],
            ]);
            
            Organisme::insertOrIgnore([
                    'Code_Organisme'=>$row['code_organisme_de_formation'], 
                    'Nom_Organisme'=>$row['organisme_de_formation'],
                    'Lieu_Formation'=>$row['lieu_du_deroulement_de_la_formation'],	
                    'Pays'=>$row['lieu_pays'],
            ]);
            
            $formation=Formation::where('Intitule_Action', $row['intitule_de_laction'])->where('Nom_Organisme', $row['organisme_de_formation'])->first();
            if (!$formation) {
                $formation = Formation::create([
                    'Domaine_Formation'=>$row['domaine_formation_fcm_fst_fsp'],
                    'Code_Domaine_Formation'=>$row['code_domaine_formation'],
                    'Intitule_Action'=>$row['intitule_de_laction'],
                    'Niveau_Formation'=>$row['niveau_de_la_formation_cible'],
                    'Nature_Formation'=>$row['nature_de_la_formation'],
                    'Source_Besoin'=>$row['source_du_besoins_en_formation'],
                    'Type_Formation'=>$row['type_formation'],
                    'Mode_Formation'=>$row['mode_formation'],
                    'Code_Formation'=>$row['code_formation'],
                    'Nom_Organisme'=>$row['organisme_de_formation'],
                    'Heure_jour'=>$row['hj'],
                ]);
            }

            Employe::insertOrIgnore([
                //
                'Matricule'=>$row['matricule'],
                'prenomNom'=>$row['nom_prenom'],
                'Date_Naissance'=>$row['date_de_naissance_jjmmaaaa'],
                'Date_Recrutement'=>$row['date_de_recrutement_jjmmaaaa'],
                'Sexe'=>$row['sexe'],
                'CSP'=>$row['csp_cadre_maitrise_execution'],
                'Echelle'=>$row['echelle'],
                'CodeFonction'=>$row['code_fonction'],
                'Id_direction'=>$row['direction'],
            ]);

            Plan::create([
                'etat'=>'prévision',
                /*'Observation'=>$row['observation'],
                'Date'=>$row[''],
                'Date_Deb'=>$row[''],
                'Date_fin'=>$row[''],*/
                'Matricule'=>$row['matricule'],
                'ID_Formation'=>$formation->ID_Formation,
                /*'Mode_Financement'=>$row['mode_de_financement'],
                'Frais_Pedagogiques'=>$row['frais_pedagogiques'],
                'Frais_Hebergement'=>$row['frais_hebergem_restauration'],
                'Frais_Transport'=>$row['frais_transport'],*/
            ]);

        }

    }
}
