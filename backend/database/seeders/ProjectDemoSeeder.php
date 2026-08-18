<?php

namespace Database\Seeders;

use App\Models\Project;
use Illuminate\Database\Seeder;

class ProjectDemoSeeder extends Seeder
{
    public function run(): void
    {
        $projects = [
            [
                'title' => '2019 Hyundai Verna — Stealth Aero & Carbon Edition',
                'slug' => '2019-hyundai-verna-stealth-aero-edition',
                'car_make' => 'Hyundai',
                'car_model' => 'Verna 2019',
                'description' => "Complete dark-stealth aero package: precision 3D-scanned front carbon lip splitter with red accents, gloss black de-chromed cascading grille, concave forged satin black alloys with 3D white REVV MOTIV tyre lettering, and an aggressive quad-fin carbon rear diffuser with quad titanium tips.",
                'status' => 'active',
                'sort_order' => 1,
                'cover_image' => '/images/projects/verna_cover.webp',
                'views' => [
                    [
                        'view_type' => 'front',
                        'work_description' => 'Precision 3D laser-scanned carbon fiber front splitter with subtle red aero accent trim and de-chromed gloss black grille.',
                        'images' => [
                            '/images/projects/verna_front.webp',
                        ],
                    ],
                    [
                        'view_type' => 'rear',
                        'work_description' => 'Aggressive quad-fin carbon fiber rear diffuser paired with quad titanium burnt exhaust tips and gloss black ducktail spoiler.',
                        'images' => [
                            '/images/projects/verna_rear.webp',
                        ],
                    ],
                ],
            ],
            [
                'title' => '2025 Kia Sonet GT-Line — Wide Aero & Carbon Package',
                'slug' => '2025-kia-sonet-gt-line-aero-package',
                'car_make' => 'Kia',
                'car_model' => 'Sonet 2025',
                'description' => "Matte pewter gray compact SUV build featuring RevvMotiv carbon fiber front splitter with red GT-Line corner winglets, floating gloss black roof wrap, rally-style roof spoiler with aero endplates, and multi-fin carbon rear diffuser.",
                'status' => 'active',
                'sort_order' => 2,
                'cover_image' => '/images/projects/sonet_cover.webp',
                'views' => [
                    [
                        'view_type' => 'front',
                        'work_description' => 'Front carbon fiber lip splitter with red GT-Line corner winglets and gloss black tiger-nose grille styling.',
                        'images' => [
                            '/images/projects/sonet_front.webp',
                        ],
                    ],
                    [
                        'view_type' => 'rear',
                        'work_description' => 'Extended rally-inspired carbon fiber roof wing spoiler with aero endplates and deep multi-fin rear diffuser.',
                        'images' => [
                            '/images/projects/sonet_rear.webp',
                        ],
                    ],
                ],
            ],
            [
                'title' => '2023 Tata Tiago — JTP-Inspired Track Hatch Build',
                'slug' => '2023-tata-tiago-jtp-track-look-build',
                'car_make' => 'Tata',
                'car_model' => 'Tiago 2023',
                'description' => "Fiery magma orange hot hatch build equipped with high-downforce front splitter with red anodized support struts, rally-style carbon fiber roof wing spoiler, center-exit quad diffuser, and motorsport lightweight wheels with white tyre lettering.",
                'status' => 'active',
                'sort_order' => 3,
                'cover_image' => '/images/projects/tiago_cover.webp',
                'views' => [
                    [
                        'view_type' => 'front',
                        'work_description' => 'Motorsport front carbon splitter with red anodized tie-rod support struts and lowered track suspension setup.',
                        'images' => [
                            '/images/projects/tiago_front.webp',
                        ],
                    ],
                    [
                        'view_type' => 'rear',
                        'work_description' => 'Carbon fiber rally roof wing spoiler, center dual-exit diffuser, and smoked LED taillamp treatment.',
                        'images' => [
                            '/images/projects/tiago_rear.webp',
                        ],
                    ],
                ],
            ],
            [
                'title' => '2023 Maruti Swift — Full Aero Kit',
                'slug' => '2023-maruti-swift-full-aero-kit',
                'car_make' => 'Maruti Suzuki',
                'car_model' => 'Swift',
                'description' => "Complete exterior transformation: carbon front lip, side skirt extensions, and a rear diffuser to match. Customer wanted an aggressive stance without touching the suspension.",
                'status' => 'active',
                'sort_order' => 4,
                'cover_image' => '/images/projects/swift_cover.png',
                'views' => [
                    [
                        'view_type' => 'front',
                        'work_description' => 'V-style carbon front lip fitted with factory-matched clips, no drilling. Repainted the surrounding bumper section for a seamless line.',
                        'images' => [
                            '/images/projects/swift_front.png',
                        ],
                    ],
                    [
                        'view_type' => 'rear',
                        'work_description' => 'Rear diffuser insert fitted below the bumper, paired with a dual-exit exhaust tip upgrade for visual balance.',
                        'images' => [
                            '/images/projects/swift_rear.png',
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
                'sort_order' => 5,
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
                        'view_type' => 'rear',
                        'work_description' => 'OLED sequential tail lights installed plug-and-play, no wiring modifications needed on this generation.',
                        'images' => [
                            '/images/projects/i20_rear.png',
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
                'sort_order' => 6,
                'cover_image' => '/images/projects/polo_cover.png',
                'views' => [
                    [
                        'view_type' => 'front',
                        'work_description' => 'Wind-tunnel profiled front splitter for a lower, more planted stance at speed.',
                        'images' => [
                            '/images/projects/polo_front.png',
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

            $project->views()->delete();

            foreach ($data['views'] as $viewIndex => $viewData) {
                $project->views()->create([
                    'view_type' => $viewData['view_type'],
                    'work_description' => $viewData['work_description'],
                    'sort_order' => $viewIndex + 1,
                    'images' => $viewData['images'],
                ]);
            }
        }
    }
}
