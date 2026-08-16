<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Money convention for this project: decimal(10,2) in rupees
        // everywhere (never paise) — except when calling the Razorpay API,
        // which requires paise and is converted at the call site only.
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->unsignedInteger('stock')->default(0);
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_featured')->default(false);
            $table->unsignedInteger('featured_order')->default(0);
            $table->json('images')->nullable();
            $table->enum('status', ['active', 'draft'])->default('draft');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
