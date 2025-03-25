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
    ];
    protected $primaryKey = 'id_direction';
    protected $keyType = 'string';
    public $timestamps = false;

    public function employe()
    {
        return $this->hasMany(Employe::class, 'Id_direction', 'Id_direction');
    }
}
