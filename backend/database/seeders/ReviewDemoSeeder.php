<?php

namespace Database\Seeders;

use App\Models\Review;
use Illuminate\Database\Seeder;

// One-time demo data for the frontend to build/verify the reviews UI against
// before real customer reviews exist. NOT part of the default DatabaseSeeder
// chain — run manually (`php artisan db:seed --class=ReviewDemoSeeder`) so it
// never silently duplicates on a normal fresh install. Names/emails are
// deliberately labeled "Demo N" so they can never be mistaken for real
// customer reviews. Meant to be deleted by the admin from the panel once
// real reviews start coming in.
class ReviewDemoSeeder extends Seeder
{
    public function run(): void
    {
        $productIds = \App\Models\Product::orderBy('id')->take(5)->pluck('id')->all();

        $reviews = [
            [
                'product_id' => $productIds[0] ?? null,
                'customer_name' => 'Demo Reviewer 1',
                'customer_email' => 'demo1@example.com',
                'rating' => 5,
                'comment' => 'Sample review text for layout/QA purposes. Replace or remove once real customer reviews start coming in.',
                'media_urls' => [],
                'verified_purchase' => true,
                'status' => 'approved',
            ],
            [
                'product_id' => $productIds[1] ?? null,
                'customer_name' => 'Demo Reviewer 2',
                'customer_email' => 'demo2@example.com',
                'rating' => 5,
                'comment' => 'Sample review text for layout/QA purposes. Replace or remove once real customer reviews start coming in.',
                'media_urls' => [],
                'verified_purchase' => true,
                'status' => 'approved',
            ],
            [
                'product_id' => $productIds[2] ?? null,
                'customer_name' => 'Demo Reviewer 3',
                'customer_email' => 'demo3@example.com',
                'rating' => 4,
                'comment' => 'Sample review text for layout/QA purposes. Replace or remove once real customer reviews start coming in.',
                'media_urls' => [],
                'verified_purchase' => false,
                'status' => 'approved',
            ],
            [
                'product_id' => $productIds[3] ?? null,
                'customer_name' => 'Demo Reviewer 4',
                'customer_email' => 'demo4@example.com',
                'rating' => 5,
                'comment' => 'Sample review text for layout/QA purposes. Replace or remove once real customer reviews start coming in.',
                'media_urls' => [],
                'verified_purchase' => true,
                'status' => 'approved',
            ],
            [
                'product_id' => $productIds[4] ?? null,
                'customer_name' => 'Demo Reviewer 5',
                'customer_email' => 'demo5@example.com',
                'rating' => 3,
                'comment' => 'Sample review text for layout/QA purposes. Replace or remove once real customer reviews start coming in.',
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
