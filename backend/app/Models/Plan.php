<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'ID_N',
        'etat',
        'Observation',
        'Date',
        'Date_Deb',
        'Date_fin',
        'Matricule',
        'ID_Formation',
        'Mode_Financement',
        'Frais_Pedagogiques',
        'Frais_Hebergement',
        'Frais_Transport',
        'Type_Pension',
        'Budget',
        'Observation_pre_arbitrage',
        'Observation_arbitrage',
        'Autres_charges',
        'Presalaire',
        'Dont_Devise',
    ];

    protected $casts = [
        'ID_N' => 'integer',
        'etat' => 'string',
        'Observation' => 'string',
        'Date' => 'date',
        'Date_Deb' => 'date',
        'Date_fin' => 'date',
        'Matricule' => 'string', //
        'ID_Formation' => 'integer', //
        'Mode_Financement' => 'integer',
        'Frais_Pedagogiques' => 'integer',
        'Frais_Hebergement' => 'integer',
        'Frais_Transport' => 'integer',
        'Type_Pension'=>'string',
        'Budget'=>'string',
        'Observation_pre_arbitrage'=>'string',
        'Observation_arbitrage'=>'string',
        'Autres_charges'=>'integer',
        'Presalaire'=>'integer',
        'Dont_Devise'=>'integer',
    ];

    protected $primaryKey = 'ID_N';
    public $timestamps = false;
    public $incrementing = true;


    public function employe()
    {
        return $this->belongsTo(Employe::class, 'Matricule', 'Matricule');
    }

    public function formation()
    {
        return $this->belongsTo(Formation::class, 'ID_Formation', 'ID_Formation');
    }
}
