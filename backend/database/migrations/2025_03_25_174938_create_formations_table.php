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
            $table->string('Domaine_Formation')->nullable();
            $table->string('Code_Domaine_Formation')->nullable();
            $table->string('Intitule_Action')->nullable();
            $table->string('Niveau_Formation')->nullable();
            $table->string('Nature_Formation')->nullable();
            $table->string('Source_Besoin')->nullable();
            $table->string('Type_Formation')->nullable();
            $table->string('Mode_Formation')->nullable();
            $table->string('Code_Formation')->nullable();
            $table->integer('Heure_jour')->nullable();
            $table->unsignedBigInteger('Id_Organisme')->nullable();

            $table->foreign('Id_Organisme')->references('Id_Organisme')->on('Organismes')->onDelete('cascade');
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
