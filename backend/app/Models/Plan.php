<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Plan extends Model
{
    use HasFactory;
    protected $table = "plan";

    protected $fillable = [
        'ID_N',
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
    ];

    protected $casts = [
        'ID_N' => 'integer',
        'Observation' => 'string',
        'Date' => 'date',
        'Date_Deb' => 'date',
        'Date_fin' => 'date',
        'Matricule' => 'string', //
        'ID_Formation' => 'integer', //
        'Mode_Financement' => 'integer',
        'Frais_Pedagogiques' => 'decimal:2',
        'Frais_Hebergement' => 'decimal:2',
        'Frais_Transport' => 'decimal:2',
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
