<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    // Replaces the fixed enum('rent','salary','ads','shipping','other') on
    // expenses.category — admin can now add new expense categories instead
    // of being stuck picking "other" for anything not on a hardcoded list.
    public function up(): void
    {
        Schema::create('expense_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->timestamps();
        });

        // Seed the same defaults the old enum had, so existing expense rows
        // (which reference these by name) resolve cleanly in the next migration.
        foreach (['Rent', 'Salary', 'Ads', 'Shipping', 'Other'] as $name) {
            DB::table('expense_categories')->insert([
                'name' => $name,
                'slug' => Str::slug($name),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('expense_categories');
    }
};
