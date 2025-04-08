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
        Schema::create('Plans', function (Blueprint $table) {
            $table->id('ID_N');
            $table->string('etat');
            $table->string('Observation')->nullable();
            $table->date('Date')->nullable();
            $table->date('Date_Deb')->nullable();
            $table->date('Date_fin')->nullable();
            $table->string('Matricule')->nullable();
            $table->unsignedBigInteger('ID_Formation')->nullable();
            $table->integer('Mode_Financement')->nullable();
            $table->integer('Frais_Pedagogiques')->nullable();
            $table->integer('Frais_Hebergement')->nullable();
            $table->integer('Frais_Transport')->nullable();
            $table->string('Type_Pension')->nullable();
            $table->string('Budget')->nullable();
            $table->string('Observation_pre_arbitrage')->nullable();
            $table->string('Observation_arbitrage')->nullable();
            $table->integer('Autres_charges')->nullable();
            $table->integer('Presalaire')->nullable();
            $table->integer('Dont_Devise')->nullable();


            $table->foreign('Matricule')->references('Matricule')->on('Employes')->onDelete('cascade');;

            $table->foreign('ID_Formation')->references('ID_Formation')->on('formations')->onDelete('cascade');;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Plans');
    }
};
