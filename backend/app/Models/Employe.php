<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    use HasFactory;
    protected $primaryKey = 'Matricule';
    protected $keyType = 'string';
    public $incrementing = false;

    /*protected $fillable = [
        'Matricule',
        'Nom',
        'Prénom',
        'Date_Naissance',
        'Age',
        'Ancienneté',
        'Sexe',
        'CSP',
        'CodeFonction',
        'Id_direction',
        'Fonction',
        'Echelle',
    ];*/
    protected $fillable=[
        'Matricule',
        'prenomNom',
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
        'prenomNom'=>'string',
        'Date_Naissance'=>'date', 		
        'Date_Recrutement'=>'date',
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
