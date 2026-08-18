<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    // Client's real product lines (replaces the earlier placeholder taxonomy
    // of Aero/Exterior/Performance/Lighting). Hatchback/Sedan variants are
    // NOT sub-categories here — see products.fitment, a free-text tag on
    // the product itself, since fitment is a per-product attribute, not a
    // distinct product line.
    public function run(): void
    {
        foreach ([
            'Splitters/Side Skirts',
            'Spoilers',
            'Aero Mirror & Styling',
            'Tyre Stickers',
            'Diffusers',
            'Lights & Flashers',
            'Combo',
            'Car Audio & Utilities',
        ] as $name) {
            Category::updateOrCreate(
                ['slug' => Str::slug($name)],
                ['name' => $name]
            );
        }
    }
}
