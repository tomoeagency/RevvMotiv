<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Replaces the single announcement_text/announcement_link_url keys
        // in admin_settings — a key-value store can't hold a list. Global
        // display config (enabled, mode, durations) stays in admin_settings;
        // this table holds the actual list of announcement entries.
        Schema::create('announcements', function (Blueprint $table) {
            $table->id();
            $table->string('text');
            $table->string('link_url')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcements');
    }
};
