<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Direction extends Model
{
    use HasFactory;

    protected $fillable = [
        'Id_direction',
        'Nom_direction',
        'Structure',
        'NomResponsable',
        'Email',
    ];

    protected $casts = [
        'Id_direction'=>'string',
        'Nom_direction'=>'string',
        'Structure'=>'string', 
        'NomResponsable'=>'string', 
        'Email'=>'string', 
    ];
    
    protected $primaryKey = 'Id_direction';
    protected $keyType = 'string';
    public $timestamps = false;

    public function employe()
    {
        return $this->hasMany(Employe::class, 'Id_direction', 'Id_direction');
    }
}
