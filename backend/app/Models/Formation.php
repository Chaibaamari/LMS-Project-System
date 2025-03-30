<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;

    protected $fillable = [
        'ID_Formation',
        'Domaine_Formation',
        'Code_Domaine_Formation',
        'Intitule_Action',
        'Niveau_Formation',
        'Nature_Formation',
        'Source_Besoin',
        'Type_Formation',
        'Mode_Formation',
        'Code_Formation',
        'Nom_Organisme',
        'Heure_jour',
    ];

    protected $casts = [
        'ID_Formation' => 'integer',
        'Domaine_Formation' => 'string',
        'Code_Domaine_Formation' => 'string',
        'Intitule_Action' => 'string',
        'Niveau_Formation' => 'string',
        'Nature_Formation' => 'string',
        'Source_Besoin' => 'string',
        'Type_Formation' => 'string',
        'Mode_Formation' => 'string',
        'Code_Formation' => 'string',
        'Heure_jour' => 'integer',
        'Nom_Organisme' => 'string',
    ];


    protected $primaryKey = 'ID_Formation';
    protected $keyType = 'string';
    public $timestamps = false;

    public function organisme()
    {
        return $this->belongsTo(Organisme::class, 'Nom_Organisme', 'Nom_Organisme');
    }

    public function plan()
    {
        return $this->hasMany(Plan::class, 'ID_Formation', 'ID_Formation');
    }
}
