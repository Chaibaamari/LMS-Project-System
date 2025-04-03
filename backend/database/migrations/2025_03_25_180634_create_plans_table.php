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
            $table->decimal('Frais_Pedagogiques', 8, 2)->nullable();
            $table->decimal('Frais_Hebergement', 8, 2)->nullable();
            $table->decimal('Frais_Transport', 8, 2)->nullable();
            $table->string('type')->nullable();


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
