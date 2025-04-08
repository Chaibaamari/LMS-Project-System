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
        Schema::create('Fonctions', function (Blueprint $table) {
            $table->string('CodeFonction')->primary();
            $table->enum('TypeFonction' ,['FCM','FST','FSP'])->default('FCM');
            $table->text('IntituleFonction');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Fonctions');
    }
};
