<?php

namespace Database\Seeders;

use App\Models\Reel;
use Illuminate\Database\Seeder;

class ReelSeeder extends Seeder
{
    public function run(): void
    {
        $reels = [
            [
                'title' => 'Tri colour fog lamp and auxiliary light installed in kia seltos',
                'car' => 'Kia Seltos',
                'category' => 'Lighting Upgrade',
                'tag' => '#FOGLIGHTS',
                'video_path' => '/videos/reels/reel_fog_light.mp4',
                'thumbnail_path' => 'https://revvmotiv.com/api/instagram/image?url=' . urlencode('https://instagram.fdel55-1.fna.fbcdn.net/v/t15.5256-10/777800050_1644681736994088_4462003032925245599_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=111&ccb=7-5&_nc_sid=18de74&efg=eyJlZmdfdGFnIjoiQ0xJUFMuYmVzdF9pbWFnZV91cmxnZW4uQzMifQ%3D%3D&_nc_ohc=qd5caeGPa3YQ7kNvwHVjIzS&_nc_oc=AdpGGUhmwnPpphl7TrTJPfYlJ6GGgBzPIfFYAzFHkITmrKjy5Ts03YZL7dp8av8mVTY&_nc_zt=23&_nc_ht=instagram.fdel55-1.fna&edm=ANQ71j8EAAAA&_nc_gid=gCEm8or7wc5vspjoGKeUZg&_nc_tpa=Q5bMBQISoYf9Vu0IfOYznR2zaBcc51-IAN-S0rR6q91DVvZeDi_Rw8fUaPQJUJ3gdMfBftyS844nunkfMw&oh=00_AQGIDz0TmSrTOJ_HmO3rpCkaebIp1PElIxozvykFxxQfRA&oe=6A8E29D6'),
                'product_id' => 25,
                'caption' => "Tri colour fog lamp and auxiliary light installed in kia seltos .\n.\n.\n#modified #revvmotiv #modification #kia",
                'instagram_url' => 'https://www.instagram.com/reel/DcJgyA5PgDA/',
                'sort_order' => 1,
                'is_active' => true,
            ],
            [
                'title' => 'Work done in Baleno — RS Grill & Bat Mirror Caps',
                'car' => 'Maruti Baleno',
                'category' => 'Aero & Exterior Styling',
                'tag' => '#BALENO',
                'video_path' => '/videos/reels/reel_exhaust.mp4',
                'thumbnail_path' => '/hero-2-v2.avif',
                'product_id' => 11,
                'caption' => "Work done in Baleno 🔥\n• RS Grill\n• Batman Mirror Caps\n• Side skirts\nOrder now with pan-India delivery.",
                'instagram_url' => 'https://www.instagram.com/reel/DblAiS6P2Xo/',
                'sort_order' => 2,
                'is_active' => true,
            ],
            [
                'title' => 'Premium Quality Spoiler for Sedan & Hatchback',
                'car' => 'Universal Sedan Fitment',
                'category' => 'Spoilers & Wings',
                'tag' => '#SPOILERS',
                'video_path' => '/videos/reels/reel_track_run.mp4',
                'thumbnail_path' => '/hero-3-v2.jpg',
                'product_id' => 6,
                'caption' => "Premium quality spoiler for your sedan. Direct bolt-on fitting with flawless gloss black finish.",
                'instagram_url' => 'https://www.instagram.com/reel/DbBPNYyP967/',
                'sort_order' => 3,
                'is_active' => true,
            ],
            [
                'title' => '4 Fin Diffuser + F1 Strobe Light Assembly',
                'car' => 'Universal Fitment',
                'category' => 'Rear Diffusers',
                'tag' => '#DIFFUSER',
                'video_path' => '/videos/reels/reel_street_run.mp4',
                'thumbnail_path' => '/hero-4-ai.jpg',
                'product_id' => 20,
                'caption' => "4 fin diffuser + f1 light setup. Aggressive track look with high-intensity rear brake warning strobe.",
                'instagram_url' => 'https://www.instagram.com/reel/DaEmruQP4N9/',
                'sort_order' => 4,
                'is_active' => true,
            ],
        ];

        foreach ($reels as $data) {
            Reel::updateOrCreate(['title' => $data['title']], $data);
        }
    }
}
