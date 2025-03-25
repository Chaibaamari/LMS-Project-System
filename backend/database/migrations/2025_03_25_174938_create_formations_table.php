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
        Schema::create('formations', function (Blueprint $table) {
            $table->id('ID_Formation');
            $table->string('Domaine_Formation');
            $table->string('Code_Domaine_Formation');
            $table->string('Intitule_Action');
            $table->string('Niveau_Formation');
            $table->string('Nature_Formation');
            $table->string('Source_Besoin');
            $table->string('Type_Formation');
            $table->string('Mode_Formation');
            $table->string('Code_Formation');
            $table->integer('Heure_jour');
            $table->string('Nom_Organisme');

            $table->foreign('Nom_Organisme')->references('Nom_Organisme')->on('Organismes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formations');
    }
};
