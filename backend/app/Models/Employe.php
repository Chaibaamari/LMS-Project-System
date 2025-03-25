<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employe extends Model
{
    use HasFactory;
    protected $primaryKey = 'matricule';
    protected $keyType = 'string';
    public $incrementing = false;

    protected $fillable = [
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
