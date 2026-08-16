<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Nullable at first so existing rows don't fail the ADD COLUMN step —
        // backfilled from the old `category` string immediately below, then
        // tightened to NOT NULL once every row has a value.
        Schema::table('expenses', function (Blueprint $table) {
            $table->foreignId('category_id')->nullable()->after('id')->constrained('expense_categories');
        });

        $categoryIdsByName = DB::table('expense_categories')->pluck('id', 'name');

        foreach (DB::table('expenses')->select('id', 'category')->get() as $expense) {
            $categoryId = $categoryIdsByName[ucfirst($expense->category)] ?? $categoryIdsByName['Other'];

            DB::table('expenses')->where('id', $expense->id)->update(['category_id' => $categoryId]);
        }

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropColumn('category');
            $table->foreignId('category_id')->nullable(false)->change();
        });
    }

    public function down(): void
    {
        Schema::table('expenses', function (Blueprint $table) {
            $table->enum('category', ['rent', 'salary', 'ads', 'shipping', 'other'])->default('other')->after('id');
        });

        $categoryNamesById = DB::table('expense_categories')->pluck('name', 'id');

        foreach (DB::table('expenses')->select('id', 'category_id')->get() as $expense) {
            $name = strtolower($categoryNamesById[$expense->category_id] ?? 'other');
            $name = in_array($name, ['rent', 'salary', 'ads', 'shipping', 'other'], true) ? $name : 'other';

            DB::table('expenses')->where('id', $expense->id)->update(['category' => $name]);
        }

        Schema::table('expenses', function (Blueprint $table) {
            $table->dropConstrainedForeignId('category_id');
        });
    }
};
