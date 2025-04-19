<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employe extends Model
{
    use HasFactory;
    protected $primaryKey = 'Matricule';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable=[
        'Matricule',
        'prenomnom',
        'Date_Naissance',
        'Date_Recrutement',
        'Sexe',
        'CSP',
        'Echelle',
        'CodeFonction',
        'Id_direction',
    ];
    protected $casts = [
        'Matricule'=>'string',
        'prenomnom'=>'string',
        'Date_Naissance'=>'date:Y-m-d',
        'Date_Recrutement'=>'date:Y-m-d',
        'Sexe'=>'string',
        'CSP'=>'string',
        'Echelle'=>'string',
        'CodeFonction'=>'string',
        'Id_direction'=>'string',
    ];


    public $timestamps = false;

    public function fonction()
    {
        return $this->belongsTo(Fonction::class, 'CodeFonction');
    }
    public function direction()
    {
        return $this->belongsTo(Direction::class, 'Id_direction');
    }
    public function plan()
    {
        return $this->hasMany(Plan::class, 'ID_N', 'ID_N');
    }
}
