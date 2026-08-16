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
        // No customer accounts (guest checkout only, per CLAUDE.md) — the
        // default Laravel 'users'/'password_reset_tokens' tables are
        // dropped in favor of the project's own 'admins' table. 'sessions'
        // is kept for the Blade admin panel's session-based login. Column
        // stays named 'user_id' (not 'admin_id') because
        // Illuminate\Session\DatabaseSessionHandler hardcodes that name.
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
    }
};
