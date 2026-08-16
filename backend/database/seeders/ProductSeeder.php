<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    // Dev/QA seed data only. Images are placeholder Unsplash URLs (verified
    // live, not just copied from the original AI-Studio mockup — several of
    // those had gone dead); production images go through Cloudinary per
    // CLAUDE.md.
    //
    // Category mapping notes (client's real taxonomy — see CategorySeeder):
    // - Front lip -> Splitters/Side Skirts: clean fit.
    // - Tail lights -> Lights & Flashers: clean fit.
    // - Mirror caps: doesn't cleanly map to any of the 8 real categories
    //   (general exterior trim isn't one of them). Filed under "Combo" as
    //   the closest catch-all — flag for a human decision, not a confident
    //   placement.
    // - Downpipe: doesn't belong in this catalog at all — it's a
    //   performance/exhaust part, and the client's real business is
    //   cosmetic/styling accessories only, none of which cover that.
    //   Set to draft (hidden from storefront) rather than force-categorized
    //   as active; recommend deleting or replacing this seed entry.
    public function run(): void
    {
        $products = [
            [
                'title' => 'V-Style Carbon Front Lip',
                'slug' => 'v-style-carbon-front-lip',
                'category' => 'Splitters/Side Skirts',
                'status' => 'active',
                'price' => 28500,
                'description' => 'Precision-engineered pre-preg carbon fiber front lip, wind-tunnel profiled for an aggressive stance and improved front-end downforce.',
                'images' => ['/images/products/v_style_carbon_front_lip.png'],
            ],
            [
                'title' => 'Forged Carbon Mirror Caps',
                'slug' => 'forged-carbon-mirror-caps',
                'category' => 'Combo', // doesn't cleanly map — see class docblock
                'status' => 'active',
                'price' => 14999,
                'description' => 'Forged carbon mirror caps with a 2x2 twill weave finish, direct bolt-on replacement for a sharper, motorsport-inspired look.',
                'images' => ['/images/products/forged_carbon_mirror_caps.png'],
            ],
            [
                'title' => 'High-Flow Downpipe',
                'slug' => 'high-flow-downpipe',
                'category' => 'Combo', // doesn't belong in this catalog at all — see class docblock
                'status' => 'draft',
                'price' => 42000,
                'description' => 'Mandrel-bent high-flow downpipe engineered to reduce backpressure and unlock a deeper exhaust note without sacrificing reliability.',
                'images' => ['/images/products/high_flow_downpipe.png'],
            ],
            [
                'title' => 'OLED Sequential Tails',
                'slug' => 'oled-sequential-tails',
                'category' => 'Lights & Flashers',
                'status' => 'active',
                'price' => 35500,
                'description' => 'Plug-and-play OLED sequential tail lights with dynamic turn-signal animation and a smoked lens finish.',
                'images' => ['/images/products/oled_sequential_tails.png'],
            ],
        ];

        foreach ($products as $i => $data) {
            $category = Category::where('name', $data['category'])->firstOrFail();

            Product::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'title' => $data['title'],
                    'description' => $data['description'],
                    'price' => $data['price'],
                    'stock' => 25,
                    'category_id' => $category->id,
                    'is_featured' => $data['status'] === 'active',
                    'featured_order' => $i,
                    'images' => $data['images'],
                    'status' => $data['status'],
                ]
            );
        }
    }
}
