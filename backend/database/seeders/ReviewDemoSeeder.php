<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

// One-time demo data for the frontend to build/verify the reviews UI against
// before real customer reviews exist. NOT part of the default DatabaseSeeder
// chain — run manually (`php artisan db:seed --class=ReviewDemoSeeder`) so it
// never silently duplicates on a normal fresh install. Meant to be deleted
// by the admin from the panel once real reviews start coming in.
class ReviewDemoSeeder extends Seeder
{
    public function run(): void
    {
        $vStyleId = \App\Models\Product::where('slug', 'v-style-carbon-front-lip')->value('id');
        $sequentialId = \App\Models\Product::where('slug', 'sequential-turn-signal-mirror-indicators')->value('id') ?? $vStyleId;
        $mirrorCapsId = \App\Models\Product::where('slug', 'batman-style-side-mirror-covers')->value('id') ?? $vStyleId;

        $reviews = [
            [
                'product_id' => $vStyleId, // V-Style Carbon Front Lip
                'customer_name' => 'Arjun Mehta',
                'customer_email' => 'arjun.mehta.demo@example.com',
                'rating' => 5,
                'comment' => "Fitment was spot on, no drilling or trimming needed. The carbon weave actually matches the factory splitter texture closely, and it's held up fine after a month of daily driving including a few speed bumps I misjudged. Installed it myself with a buddy in about an hour.",
                'media_urls' => [
                    '/images/projects/swift_aero_front1.png',
                    '/images/reels/reel_carbon_lip.png',
                ],
                'verified_purchase' => true,
                'status' => 'approved',
            ],
            [
                'product_id' => $sequentialId, // Sequential Turn Signal Mirror Indicators
                'customer_name' => 'Priya Nair',
                'customer_email' => 'priya.nair.demo@example.com',
                'rating' => 5,
                'comment' => "Plug and play like they promised — no relay or resistor hassle. The sequential sweep looks genuinely premium at night, not gimmicky. Only wish the packaging had a bit more padding, one corner of the box was dented in transit but the lights themselves were fine.",
                'media_urls' => [],
                'verified_purchase' => true,
                'status' => 'approved',
            ],
            [
                'product_id' => $mirrorCapsId, // Batman-Style Side Mirror Covers
                'customer_name' => 'Rohit Sharma',
                'customer_email' => 'rohit.sharma.demo@example.com',
                'rating' => 4,
                'comment' => "Good build quality and the twill weave is genuinely nice in person, not the printed-vinyl look some cheaper caps have. Direct bolt-on took maybe 15 minutes per side. Docking a star only because shipping took about 9 days, a bit longer than I expected.",
                'media_urls' => [],
                'verified_purchase' => false,
                'status' => 'approved',
            ],
            [
                'product_id' => $vStyleId, // V-Style Carbon Front Lip
                'customer_name' => 'Sana Fernandes',
                'customer_email' => 'sana.fernandes.demo@example.com',
                'rating' => 5,
                'comment' => "Completely changes the front-end stance of the car. A few people at a meet asked if it was a factory aero package. Ground clearance is a bit tighter now so I'm careful on speed breakers, but that's expected with any front lip.",
                'media_urls' => [
                    '/images/products/v_style_carbon_front_lip.png',
                ],
                'verified_purchase' => false,
                'status' => 'approved',
            ],
            [
                'product_id' => 4, // OLED Sequential Tails
                'customer_name' => 'Karan Deshmukh',
                'customer_email' => 'karan.deshmukh.demo@example.com',
                'rating' => 3,
                'comment' => "Lights themselves work well, but I noticed the sequential animation on the right side is very slightly less bright than the left when both are running. Reached out to support about it and they were responsive, still waiting on a resolution though so adjusting my rating until it's sorted.",
                'media_urls' => [],
                'verified_purchase' => true,
                'status' => 'approved',
            ],
            [
                'product_id' => 2, // Forged Carbon Mirror Caps
                'customer_name' => 'Neha Kapoor',
                'customer_email' => 'neha.kapoor.demo@example.com',
                'rating' => 4,
                'comment' => "Color and finish match my factory mirrors almost perfectly, you really have to look closely to tell they're aftermarket. A bit pricier than similar caps I found elsewhere, but the fitment quality justifies it in my opinion.",
                'media_urls' => [],
                'verified_purchase' => false,
                'status' => 'approved',
            ],
        ];

        $ids = [];
        foreach ($reviews as $review) {
            $ids[] = Review::create($review)->id;
        }

        $this->command?->info('Demo reviews created with IDs: '.implode(', ', $ids));
    }
}
