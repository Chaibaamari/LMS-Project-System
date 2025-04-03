<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fonction extends Model
{
    use HasFactory;
    protected $primaryKey = 'CodeFonction';

    protected $fillable = [
        'CodeFonction',
        'TypeFonction',
        'IntituleFonction',
    ];

    protected $casts = [
        'CodeFonction'=>'string',
        'TypeFonction'=>'string', //FST wela ...
        'IntituleFonction'=>'string',
    ];

    protected $keyType = 'string';
    public $timestamps = false;
    public function employe()
    {
        return $this->hasMany(Employe::class, 'CodeFonction', 'CodeFonction');
    }
}
