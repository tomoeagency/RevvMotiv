<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Content lives in the DB (not static frontend pages) specifically
        // so the admin can edit real legal/policy copy later without a
        // frontend deploy — same reasoning as the admin_settings pattern.
        Schema::create('policies', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title');
            $table->longText('content'); // Markdown — frontend renders it
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('policies');
    }
};
