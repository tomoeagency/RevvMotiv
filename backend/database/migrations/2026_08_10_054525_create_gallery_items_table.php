<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('gallery_items', function (Blueprint $table) {
            $table->id();
            // Cloudinary secure_url — media itself is never stored locally,
            // matching every other media field in this app (products,
            // reviews, project views).
            $table->string('media_url');
            // Explicit rather than inferred from the URL/extension — a
            // Cloudinary URL doesn't reliably carry a simple file
            // extension, and the frontend needs to know upfront whether to
            // render an <img>/next Image or a <video> element.
            $table->enum('media_type', ['image', 'video']);
            $table->string('caption')->nullable();
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('gallery_items');
    }
};
