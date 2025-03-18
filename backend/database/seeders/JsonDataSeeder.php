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
        // Read JSON file
        $json = Storage::get('data.json');
        $data = json_decode($json, true);

        // Insert data into the database
        DB::table('fonctions')->insert($data);
    }
}
