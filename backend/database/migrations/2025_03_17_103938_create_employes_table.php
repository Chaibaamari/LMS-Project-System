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
        Schema::create('employes', function (Blueprint $table) {
            $table->string('Matricule')->primary();
            $table->string('Nom');
            $table->string('Prénom');
            $table->date('Date_Naissance');
            $table->integer('Age')->nullable();
            $table->integer('Ancienneté')->default(0);
            $table->enum('Sexe', ['homme', 'femme']);
            $table->string('CSP');
            $table->integer('CodeFonction');
            $table->string('Id_direction' , 50);
            $table->foreign('CodeFonction')->references('CodeFonction')->on('fonctions')->onDelete('cascade');
            $table->foreign('Id_direction')->references('Id_direction')->on('directions')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employes');
    }
};
