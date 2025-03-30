<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('Organismes', function (Blueprint $table) {
            $table->string('Code_Organisme');
            $table->string('Nom_Organisme')->primary()->nullable();
            $table->string('Lieu_Formation');
            $table->string('Pays');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Organismes');
    }
};
