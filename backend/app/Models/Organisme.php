<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Organisme extends Model
{
    use HasFactory;
    protected $table = "organisme";


    protected $fillable = [
        'Code_Organisme',
        'Nom_Organisme',
        'Lieu_Formation',
        'Pays',
    ];

    protected $casts = [
        'Code_Organisme' => 'string',
        'Nom_Organisme' => 'string',
        'Lieu_Formation' => 'string',
        'Pays' => 'string',
    ];

    protected $primaryKey = 'Nom_Organisme';
    protected $keyType = 'string';
    public $timestamps = false;

    public function formation()
    {
        return $this->hasMany(Formation::class, 'Nom_Organisme', 'Nom_Organisme');
    }
}
