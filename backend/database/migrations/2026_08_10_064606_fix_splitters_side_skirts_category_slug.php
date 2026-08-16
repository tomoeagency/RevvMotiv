<?php

use App\Models\Category;
use Illuminate\Database\Migrations\Migration;

// Data correction, not a schema change — the "Splitters/Side Skirts"
// category was seeded with a missing hyphen ("splittersside-skirts"),
// producing a URL slug that doesn't read as two words. Any existing link
// to the old slug is preserved via the redirect rule in
// frontend/next.config.ts, not here — this migration only fixes the
// stored value going forward.
return new class extends Migration
{
    public function up(): void
    {
        Category::where('slug', 'splittersside-skirts')
            ->update(['slug' => 'splitters-side-skirts']);
    }

    public function down(): void
    {
        Category::where('slug', 'splitters-side-skirts')
            ->update(['slug' => 'splittersside-skirts']);
    }
};
