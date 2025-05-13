<?php

namespace App\Exports;

use App\Models\Plan;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;


class DemandeConfirmationExport implements FromCollection, WithHeadings , WithStyles, ShouldAutoSize
{
    /**
    * @return \Illuminate\Support\Collection
    */
    protected $ids;

    public function __construct($ids)
    {
        $this->ids = $ids;
    }
    
    public function collection()
    {
        //
        return Plan::with(['employe', 'formation.organisme'])
            ->whereIn('ID_N', $this->ids)
            ->get()
            ->map(function ($p) {
                return [
                    'NOM & PRENOM'    => $p->employe->prenomnom,
                    "INTITULE DE L'ACTION"   => $p->formation->Intitule_Action ?? '',
                    'Organisme'  => $p->formation->organisme->Nom_Organisme ?? '',
                ];
            });
    }

    public function headings(): array
    {
        return [
            'NOM & PRENOM',
            "INTITULE DE L'ACTION",
            'Organisme',
        ];
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
