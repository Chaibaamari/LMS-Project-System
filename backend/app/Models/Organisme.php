<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organisme extends Model
{
    use HasFactory;


    protected $fillable = [
        'Id_Organisme',
        'Code_Organisme',
        'Nom_Organisme',
        'Lieu_Formation',
        'Pays',
    ];

    protected $casts = [
        'Id_Organisme'=>'integer',
        'Code_Organisme' => 'string',
        'Nom_Organisme' => 'string',
        'Lieu_Formation' => 'string',
        'Pays' => 'string',
    ];

    protected $primaryKey = 'Id_Organisme';
    public $timestamps = false;

    public function formation()
    {
        return $this->hasMany(Formation::class, 'Id_Organisme', 'Id_Organisme');
    }
}
