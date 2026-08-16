<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('expenses', function (Blueprint $table) {
            $table->id();
            $table->enum('category', ['rent', 'salary', 'ads', 'shipping', 'other']);
            $table->string('description')->nullable();
            $table->decimal('amount', 10, 2);
            $table->date('expense_date');
            $table->foreignId('created_by')->constrained('admins');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('expenses');
    }
};
