<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('project_views', function (Blueprint $table) {
            $table->id();
            // Cascade, not restricted: a view has no meaning without its
            // parent project (unlike products/orders, there's no separate
            // historical record that needs to survive the parent's deletion).
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->enum('view_type', ['front', 'rear', 'left', 'right', 'top', 'bottom', 'interior']);
            $table->json('images')->nullable();
            $table->text('work_description')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_views');
    }
};
