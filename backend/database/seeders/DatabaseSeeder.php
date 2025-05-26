<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run()
    {
        // Create admin user if not exists
        User::firstOrCreate(
            ['email' => 'admin@sonatrach.dz'],
            [
                'name' => 'admin',
                'password' => Hash::make('admin'),
                'role' => 'responsable',
                'active' => 1,
            ]
        );
    }
}
