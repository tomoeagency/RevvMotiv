<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Simplest approach for hatchback/sedan/etc: a free-text tag on the
        // product itself, not a sub-category. A category taxonomy of
        // "Spoilers > Hatchback" / "Spoilers > Sedan" would double the
        // category count for one attribute that's really per-product
        // (a spoiler fits one body style, a tyre sticker fits any car).
        Schema::table('products', function (Blueprint $table) {
            $table->string('fitment', 50)->nullable()->after('category_id');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('fitment');
        });
    }
};
