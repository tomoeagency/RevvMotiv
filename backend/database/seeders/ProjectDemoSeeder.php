<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

// One-time demo data for the frontend to build/verify the "Our Work"
// portfolio UI against before real completed jobs are logged. NOT part of
// the default DatabaseSeeder chain — run manually
// (`php artisan db:seed --class=ProjectDemoSeeder`). Meant to be deleted
// or replaced by the admin from the panel once real project photos exist.
// Images are placeholder Unsplash URLs, reused from ProductSeeder/
// ReviewDemoSeeder since those were already verified live.
class ProjectDemoSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => '2023 Maruti Swift — Full Aero Kit',
                'slug' => '2023-maruti-swift-full-aero-kit',
                'car_make' => 'Maruti Suzuki',
                'car_model' => 'Swift',
                'description' => "Complete exterior transformation: carbon front lip, side skirt extensions, and a rear diffuser to match. Customer wanted an aggressive stance without touching the suspension.",
                'status' => 'active',
                'sort_order' => 1,
                'cover_image' => '/images/projects/swift_cover.png',
                'views' => [
                    [
                        'view_type' => 'front',
                        'work_description' => 'V-style carbon front lip fitted with factory-matched clips, no drilling. Repainted the surrounding bumper section for a seamless line.',
                        'images' => [
                            '/images/projects/swift_front.png',
                            '/images/projects/swift_aero_front1.png',
                        ],
                    ],
                    [
                        'view_type' => 'left',
                        'work_description' => 'Side skirt extensions installed and blended into the factory skirt line with 3M adhesive plus mechanical clips for long-term hold.',
                        'images' => [
                            '/images/projects/swift_left.png',
                        ],
                    ],
                    [
                        'view_type' => 'rear',
                        'work_description' => 'Rear diffuser insert fitted below the bumper, paired with a dual-exit exhaust tip upgrade for visual balance.',
                        'images' => [
                            '/images/projects/swift_rear.png',
                        ],
                    ],
                    [
                        'view_type' => 'interior',
                        'work_description' => 'Carbon-finish dash trim and gear knob swap to tie the exterior theme into the cabin.',
                        'images' => [
                            '/images/projects/swift_interior.png',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Hyundai i20 N Line — Blackout Package',
                'slug' => 'hyundai-i20-n-line-blackout-package',
                'car_make' => 'Hyundai',
                'car_model' => 'i20 N Line',
                'description' => "Full gloss-black trim package: mirror caps, grille surround, and sequential tails, finished with a satin roof wrap for contrast against the factory red paint.",
                'status' => 'active',
                'sort_order' => 2,
                'cover_image' => '/images/projects/i20_cover.png',
                'views' => [
                    [
                        'view_type' => 'front',
                        'work_description' => 'Grille surround and badge blacked out, factory chrome removed entirely for a cleaner front end.',
                        'images' => [
                            '/images/projects/i20_front.png',
                        ],
                    ],
                    [
                        'view_type' => 'right',
                        'work_description' => 'Forged carbon mirror caps, direct bolt-on replacement, matched to the customer\'s existing carbon splitter.',
                        'images' => [
                            '/images/projects/i20_right.png',
                        ],
                    ],
                    [
                        'view_type' => 'rear',
                        'work_description' => 'OLED sequential tail lights installed plug-and-play, no wiring modifications needed on this generation.',
                        'images' => [
                            '/images/projects/i20_rear.png',
                        ],
                    ],
                    [
                        'view_type' => 'top',
                        'work_description' => 'Satin black roof wrap, edges tucked and heat-sealed under the trim for a factory-look finish.',
                        'images' => [
                            '/images/projects/i20_top.png',
                        ],
                    ],
                ],
            ],
            [
                'title' => 'Volkswagen Polo GT — Track Look Build',
                'slug' => 'volkswagen-polo-gt-track-look-build',
                'car_make' => 'Volkswagen',
                'car_model' => 'Polo GT',
                'description' => "Motorsport-inspired refresh for a customer who wanted a track-day look for weekend use — front splitter, tyre stickers, and an audio upgrade for the drive there.",
                'status' => 'active',
                'sort_order' => 3,
                'cover_image' => '/images/projects/polo_cover.png',
                'views' => [
                    [
                        'view_type' => 'front',
                        'work_description' => 'Wind-tunnel profiled front splitter for a lower, more planted stance at speed.',
                        'images' => [
                            '/images/projects/polo_front.png',
                        ],
                    ],
                    [
                        'view_type' => 'left',
                        'work_description' => 'Custom-cut tyre lettering applied in white for contrast against the black sidewalls.',
                        'images' => [
                            '/images/projects/polo_left.png',
                        ],
                    ],
                    [
                        'view_type' => 'interior',
                        'work_description' => 'Component speaker upgrade and sound deadening on both front doors for a noticeably cleaner stage.',
                        'images' => [
                            '/images/projects/polo_interior.png',
                        ],
                    ],
                ],
            ],
        ];

        foreach ($projects as $data) {
            $project = Project::updateOrCreate(
                ['slug' => $data['slug']],
                [
                    'title' => $data['title'],
                    'car_make' => $data['car_make'],
                    'car_model' => $data['car_model'],
                    'description' => $data['description'],
                    'status' => $data['status'],
                    'sort_order' => $data['sort_order'],
                    'cover_image' => $data['cover_image'],
                ]
            );

            $project->views()->delete(); // idempotent re-seed: replace views cleanly

            foreach ($data['views'] as $i => $view) {
                $project->views()->create([
                    'view_type' => $view['view_type'],
                    'work_description' => $view['work_description'],
                    'images' => $view['images'],
                    'sort_order' => $i,
                ]);
            }
        }

        $this->command?->info('Demo projects created: '.Project::whereIn('slug', array_column($projects, 'slug'))->pluck('id')->implode(', '));
    }
}
