<?php
namespace App\Exports;


use App\Models\Plan;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\Exportable;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;


class PrevExport implements FromQuery,WithHeadings, WithMapping , WithStyles, ShouldAutoSize
{
    use Exportable;
    protected $year;

    public function __construct($year)
    {
        $this->year = $year;
    }
    

    public function query()
    {
        return Plan::where('Exercice',$this->year)->where('etat', 'prévision')->with([
            'employe.direction',
            'employe.fonction',
            'formation.organisme',
        ]);
    }

    public function headings(): array
    {
        return [
            "STRUCTURE",
            "DIRECTION",
            "MATRICULE",
            "NOM & PRENOM",
            "DATE DE NAISSANCE (JJMMAAAA)",
            "AGE",
            "DATE DE RECRUTEMENT (JJMMAAAA)",
            "ANCIENNETE",
            "SEXE",
            "CSP (Cadre-Maîtrise-Exécution)",
            "FONCTION (FCM/FST/FSP)",
            "CODE FONCTION",
            "INTITULÉ DE FONCTION",
            "Echelle",
            "DOMAINE  FORMATION (FCM-FST-FSP)",
            "CODE DOMAINE FORMATION",
            "INTITULÉ DE L'ACTION ",
            "Niveau de la formation ciblé",
            "Nature de la formation",
            "SOURCE DU BESOINS EN FORMATION",
            "TYPE FORMATION",
            "MODE FORMATION",
            "CODE FORMATION",
            "CODE ORGANISME DE FORMATION",
            "ORGANISME DE FORMATION",
            "LIEU DU DÉROULEMENT DE LA FORMATION",
            "LIEU (PAYS)",
            "H/J",
        ];
    }

    public function map($plan): array
    {
        return [
            $plan->employe->direction->Structure ?? 'N/A',
            $plan->employe->direction->Id_direction ?? 'N/A',
            $plan->employe->Matricule ?? 'N/A',
            $plan->employe->prenomnom ?? 'N/A',
            $plan->employe->Date_Naissance ?? 'N/A',
            $this->calculateAge($plan->employe?->Date_Naissance),
            $plan->employe->Date_Recrutement ?? 'N/A',
            $this->calculateAnciennete($plan->employe?->Date_Recrutement),
            $plan->employe->Sexe ?? 'N/A',
            $plan->employe->CSP ?? 'N/A',
            $plan->employe->fonction->TypeFonction ?? 'N/A',
            $plan->employe->fonction->CodeFonction ?? 'N/A',
            $plan->employe->fonction->IntituleFonction ?? 'N/A',
            $plan->employe->Echelle ?? 'N/A',
            $plan->formation->Domaine_Formation ?? 'N/A',
            $plan->formation->Code_Domaine_Formation ?? 'N/A',
            $plan->formation->Intitule_Action ?? 'N/A',
            $plan->formation->Niveau_Formation ?? 'N/A',
            $plan->formation->Nature_Formation ?? 'N/A',
            $plan->formation->Source_Besoin ?? 'N/A',
            $plan->formation->Type_Formation ?? 'N/A',
            $plan->formation->Mode_Formation ?? 'N/A',
            $plan->formation->Code_Formation ?? 'N/A',
            $plan->formation->organisme->Code_Organisme ?? 'N/A',
            $plan->formation->organisme->Nom_Organisme ?? 'N/A',
            $plan->formation->organisme->Lieu_Formation ?? 'N/A',
            $plan->formation->organisme->Pays ?? 'N/A',
            $plan->formation->Heure_jour ?? 'N/A',
        ];
    }

    private function calculateAge($birthDate)
    {
        return $birthDate ? Carbon::parse($birthDate)->diffInYears(Carbon::now()) : 'N/A';
    }
 
    private function calculateAnciennete($recruitmentDate)
    {
        return $recruitmentDate ? Carbon::parse($recruitmentDate)->diffInYears(Carbon::now()) : 'N/A';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'color' => ['rgb' => '000000']],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => '70ad47'],
                ],
                'alignment' => ['horizontal' => 'center'],
                'borders' => [
                'allBorders' => [
                        'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_MEDIUM,
                        'color' => ['rgb' => '000000'], // Black border
                    ],
                ],
            ],
        ];
    }
}