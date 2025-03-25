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
        Schema::create('Employes', function (Blueprint $table) {
            $table->string('Matricule' , 50)->primary();
            $table->string('Nom' , 50);
            $table->string('Prénom' , 50);
            $table->date('Date_Naissance');
            $table->integer('Age')->nullable();
            $table->integer('Ancienneté')->default(0);
            $table->enum('Sexe', ['M', 'F']);
            $table->enum('CSP' , ['Cadre', 'Maîtrise', 'Exécution']);
            $table->enum('Fonction' , ['FST', 'FSM' , 'FSP']);
            $table->string('Echelle' , 50);
            $table->integer('CodeFonction');
            $table->string('Id_direction' , 50);
            $table->foreign('CodeFonction')->references('CodeFonction')->on('Fonctions')->onDelete('cascade');
            $table->foreign('Id_direction')->references('Id_direction')->on('directions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Employes');
    }
};
