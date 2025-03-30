<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class JsonDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        // read JSON DATA DIRECTION file
        $direction = Storage::get('direction.json');
        $data_direction = json_decode($direction, true);


        // Read JSON DATA EMPLOYEE file
        $employe = Storage::get('users.json');
        $data_employe = json_decode($employe, true);


        // Read JSON DATA FUNCTION file
        $fonction = Storage::get('data.json');
        $data_fonction = json_decode($fonction, true);

        // Insert data into the database
        DB::table('fonctions')->insert($data_fonction);
        DB::table('directions')->insert($data_direction);
        DB::table('employes')->insert($data_employe);

    }
}
