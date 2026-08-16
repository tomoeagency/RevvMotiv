<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;

// One-time demo catalog fill so every real category has enough products for
// the frontend to build/verify listing and filter UIs against. NOT part of
// the default DatabaseSeeder chain — run manually
// (`php artisan db:seed --class=CatalogDemoSeeder`). Meant to be edited or
// replaced by the admin with real inventory over time.
//
// Note on "Batman Cover": the client's exact intended product type for this
// category name was never clarified (flagged when the taxonomy was first
// built) — these 5 are a judgment-call interpretation as bat-wing-style
// hood/mirror/vent cover accessories. Rename/replace via the admin panel if
// that's not what the category is actually for.
//
// Images are the same small verified-live Unsplash pool reused throughout
// this project's demo data (products/reviews/projects), cycled per product
// rather than sourcing unique photos per item — placeholder content only.
class CatalogDemoSeeder extends Seeder
{
    private const IMAGE_IDS = [
        '1449965408869-eaa3f722e40d', '1492144534655-ae79c964c9d7', '1494905998402-395d579af36f',
        '1503376780353-7e6692767b70', '1503551723145-6c040742065b', '1503736334956-4c8f8e92946d',
        '1511919884226-fd3cad34687c', '1517524008697-84bbe3c3fd98', '1517783999520-f068d7431a60',
        '1518987048-93e29699e79a', '1520031441872-265e4ff70366', '1533473359331-0135ef1b58bf',
        '1541348263662-e068662d82af', '1541899481282-d53bffe3c35d', '1542282088-fe8426682b8f',
        '1542362567-b07e54358753', '1547038577-da80abbc4f19', '1550355291-bbee04a92027',
        '1552519507-da3b142c6e3d', '1552930294-6b595f4c2974', '1553440569-bcc63803a83d',
        '1567818735868-e71b99932e29', '1568772585407-9361f9bf3a87', '1580274455191-1c62238fa333',
        '1583121274602-3e2820c69888', '1590362891991-f776e747a588', '1600661653561-629509216228',
        '1601362840469-51e4d8d58785', '1605559424843-9e4c228bf1c2', '1611016186353-9af58c69a533',
        '1614200179396-2bdb77ebf81b', '1621007947382-bb3c3994e3fb',
    ];

    private int $imageCursor = 0;

    public function run(): void
    {
        $catalog = [
            'Splitters/Side Skirts' => [
                ['Twill Weave Side Skirt Extensions', 12500, 15000, 'Direct-fit side skirt extensions in a 2x2 twill carbon weave finish, blended into the factory skirt line with 3M adhesive plus mechanical clips.'],
                ['ABS Chin Spoiler Splitter', 6500, null, 'Lightweight ABS chin splitter for a lower front stance, includes factory-matched mounting clips, no drilling required.'],
                ['Adjustable Front Splitter Winglets (Pair)', 4200, null, 'Bolt-on splitter winglets with adjustable angle for fine-tuning front-end aero without a full splitter swap.'],
                ['Gloss Black Rocker Panel Side Skirts', 9800, 11500, 'Rocker panel side skirts in gloss black, wind-tunnel profiled to reduce underbody turbulence.'],
            ],
            'Spoilers' => [
                ['GT-Style Rear Wing Spoiler', 18500, null, 'Motorsport-style GT wing with adjustable uprights, dual-position angle adjustment for street or track setup.'],
                ['Carbon Fiber Trunk Lip Spoiler', 9500, null, 'Subtle trunk lip spoiler in real carbon fiber weave, adds rear downforce without altering the car\'s factory lines.'],
                ['Ducktail Spoiler — Universal Fit', 5500, null, 'Classic ducktail-profile spoiler, universal trunk mount kit included, paintable ABS construction.'],
                ['Roof Spoiler Extension', 7200, null, 'Roof-edge spoiler extension for hatchbacks, improves rear visibility-neutral airflow and adds a track-look finish.'],
                ['Adjustable Rear Wing with Uprights', 22000, 26000, 'Tall adjustable rear wing on aluminium uprights, multiple angle settings, includes trunk-mount hardware.'],
            ],
            'Batman Cover' => [
                ['Bat-Wing Hood Vent Covers (Pair)', 3200, null, 'Bat-wing profiled hood vent covers for a distinctive bonnet silhouette, ABS construction with factory-color-matched or gloss black finish.'],
                ['Batman-Style Side Mirror Covers', 2800, null, 'Angular bat-wing mirror covers, direct bolt-on replacement over factory mirror housings.'],
                ['Bat-Wing Fender Vent Trim (Pair)', 2400, null, 'Fender-mounted vent trim with a bat-wing edge profile, adhesive-backed for clean installation.'],
                ['Batman Bonnet Scoop Cover', 4500, null, 'Functional-look bonnet scoop cover with an angular bat-wing outline, lightweight ABS shell.'],
                ['Bat-Style Rear Window Louver Cover', 6800, null, 'Rear window louver cover with a bat-wing slat pattern, snap-fit installation, no drilling into the glass.'],
            ],
            'Tyre Stickers' => [
                ['Tyre Lettering Kit — White (Set of 8)', 1800, null, 'Raised-letter permanent tyre stickers in white, fits most 15"-19" sidewalls, heat-cure adhesive application.'],
                ['Tyre Lettering Kit — Red (Set of 8)', 1800, null, 'Raised-letter permanent tyre stickers in red for a track-day contrast look, same application as the white set.'],
                ['Raised Rubber Tyre Letters — Universal', 2400, null, 'Individually applied raised rubber letters for a custom lettering layout, sold as a full alphabet + number set.'],
                ['Permanent Tyre Stickers — Yellow', 1600, null, 'High-visibility yellow tyre lettering, weatherproof and rated for daily driving use.'],
                ['Tyre Sidewall Decal Kit — Silver', 1900, null, 'Silver metallic tyre sidewall decals, semi-permanent application, easily replaced when tyres are changed.'],
            ],
            'Diffusers' => [
                ['Quad-Fin Rear Diffuser', 8500, null, 'Four-fin rear diffuser insert, bolts below the rear bumper for a motorsport-look rear end.'],
                ['Carbon Fiber Rear Diffuser', 16500, null, 'Real carbon fiber rear diffuser with a deep fin profile, includes heat-resistant mounting hardware for exhaust clearance.'],
                ['Gloss Black Bumper Diffuser', 6200, null, 'Gloss black ABS diffuser insert, direct-fit for most hatchback rear bumpers.'],
                ['Dual-Exit Diffuser with Fins', 9200, null, 'Diffuser designed around dual-exit exhaust tips, paired fin layout for visual width.'],
                ['Universal Bolt-On Diffuser Fins (Set of 4)', 3500, null, 'Individual bolt-on diffuser fins for custom layouts on bumpers without a factory diffuser cutout.'],
            ],
            'Lights & Flashers' => [
                ['LED DRL Fog Lamp Kit', 5500, null, 'Daytime running light + fog lamp combo kit, plug-and-play harness for most hatchback and sedan platforms.'],
                ['Sequential Turn Signal Mirror Indicators', 3200, null, 'Direct-fit mirror indicators with a sequential sweep animation, matches the sequential tail light look.'],
                ['Smoked LED Third Brake Light', 2800, null, 'Smoked-lens third brake light with bright LED array, retains full brightness despite the tint.'],
                ['LED Headlight Halo Rings (Pair)', 4500, null, 'Angel-eye halo ring kit for projector headlights, even illumination with no visible hotspots.'],
            ],
            'Combo' => [
                ['Front + Rear Aero Combo Kit', 38000, 45000, 'Bundle: front splitter + rear diffuser, matched finish, installed together for a complete aero refresh at a bundled price.'],
                ['Complete Lighting Upgrade Combo', 12500, 15000, 'Bundle: sequential tail lights + LED DRL fog lamp kit, everything needed for a full front-and-rear lighting refresh.'],
                ['Exterior Styling Starter Combo', 15500, null, 'Bundle: mirror caps + side skirt extensions + tyre lettering kit — an easy first styling upgrade.'],
                ['Track Look Combo — Splitter + Diffuser + Stickers', 21000, 25000, 'Bundle: front splitter, rear diffuser, and a tyre lettering kit for a coordinated track-day look.'],
            ],
            'Car Audio & Utilities' => [
                ['Component Speaker Upgrade Kit', 8500, null, 'Front component speaker set with dedicated tweeters and crossovers, plug-and-play with most factory harnesses.'],
                ['Subwoofer + Amplifier Combo', 15500, null, 'Compact under-seat subwoofer paired with a matched amplifier, minimal boot space used.'],
                ['Android Auto / CarPlay Head Unit', 22000, null, 'Wireless Android Auto and CarPlay head unit, direct-fit dash kit included for most compact sedans and hatchbacks.'],
                ['Dash Cam with Night Vision', 6500, null, 'Front-facing dash cam with night vision recording and loop recording, includes a hardwire kit for parked-car monitoring.'],
                ['Wireless Phone Charger Mount', 1800, null, 'Vent-mount wireless charger with auto-clamp arms, Qi-compatible up to 15W.'],
            ],
        ];

        $created = [];

        foreach ($catalog as $categoryName => $products) {
            $category = Category::where('name', $categoryName)->firstOrFail();

            foreach ($products as $i => [$title, $price, $compareAtPrice, $description]) {
                $slug = \Illuminate\Support\Str::slug($title);

                $specificImages = match ($slug) {
                    'tyre-lettering-kit-white-set-of-8' => ['/images/products/tyre_stickers_white.png'],
                    'tyre-lettering-kit-red-set-of-8' => ['/images/products/tyre_stickers_red.png'],
                    'raised-rubber-tyre-letters-universal' => ['/images/products/tyre_stickers_universal.png'],
                    'permanent-tyre-stickers-yellow' => ['/images/products/tyre_stickers_yellow.png'],
                    'tyre-sidewall-decal-kit-silver' => ['/images/products/tyre_stickers_silver.png'],
                    'gt-style-rear-wing-spoiler' => ['/images/products/spoiler_gt_style.png'],
                    'carbon-fiber-trunk-lip-spoiler' => ['/images/products/spoiler_carbon_trunk_lip.png'],
                    'ducktail-spoiler-universal-fit' => ['/images/products/spoiler_ducktail_universal.png'],
                    'roof-spoiler-extension' => ['/images/products/spoiler_roof_extension.png'],
                    'adjustable-rear-wing-with-uprights' => ['/images/products/spoiler_adjustable_rear_wing.png'],
                    'twill-weave-side-skirt-extensions' => ['/images/products/splitter_twill_side_skirts.png'],
                    'abs-chin-spoiler-splitter' => ['/images/products/splitter_abs_chin_spoiler.png'],
                    'adjustable-front-splitter-winglets-pair' => ['/images/products/splitter_winglets_pair.png'],
                    'gloss-black-rocker-panel-side-skirts' => ['/images/products/splitter_gloss_black_side_skirts.png'],
                    'v-style-carbon-front-lip' => ['/images/products/v_style_carbon_front_lip.png'],
                    'quad-fin-rear-diffuser' => ['/images/products/diffuser_quad_fin.png'],
                    'carbon-fiber-rear-diffuser' => ['/images/products/diffuser_carbon_fiber.png'],
                    'gloss-black-bumper-diffuser' => ['/images/products/diffuser_gloss_black.png'],
                    'dual-exit-diffuser-with-fins' => ['/images/products/diffuser_dual_exit.png'],
                    'universal-bolt-on-diffuser-fins-set-of-4' => ['/images/products/diffuser_universal_fins.png'],
                    'bat-wing-hood-vent-covers-pair' => ['/images/products/bat_wing_hood_vents.png'],
                    'batman-style-side-mirror-covers' => ['/images/products/batman_mirror_covers.png'],
                    'bat-wing-fender-vent-trim-pair' => ['/images/products/bat_fender_trim.png'],
                    'batman-bonnet-scoop-cover' => ['/images/products/bat_bonnet_scoop.png'],
                    'bat-style-rear-window-louver-cover' => ['/images/products/bat_window_louver.png'],
                    'led-drl-fog-lamp-kit' => ['/images/products/led_drl_fog_lamps.png'],
                    'sequential-turn-signal-mirror-indicators' => ['/images/products/sequential_mirror_indicators.png'],
                    'smoked-led-third-brake-light' => ['/images/products/smoked_third_brake_light.png'],
                    'led-headlight-halo-rings-pair' => ['/images/products/led_halo_rings.png'],
                    'component-speaker-upgrade-kit' => ['/images/products/component_speaker_kit.png'],
                    'subwoofer-amplifier-combo' => ['/images/products/subwoofer_amp_combo.png'],
                    'android-auto-carplay-head-unit' => ['/images/products/android_head_unit.png'],
                    'dash-cam-with-night-vision' => ['/images/products/dash_cam_night_vision.png'],
                    'wireless-phone-charger-mount' => ['/images/products/wireless_phone_charger.png'],
                    'oled-sequential-tails' => ['/images/products/oled_sequential_tails.png'],
                    'front-rear-aero-combo-kit' => ['/images/products/combo_aero_kit.png'],
                    'complete-lighting-upgrade-combo' => ['/images/products/combo_lighting.png'],
                    'exterior-styling-starter-combo' => ['/images/products/combo_starter_styling.png'],
                    'track-look-combo-splitter-diffuser-stickers' => ['/images/products/combo_track_look.png'],
                    default => null,
                };

                $product = Product::updateOrCreate(
                    ['slug' => $slug],
                    [
                        'title' => $title,
                        'description' => $description,
                        'price' => $price,
                        'compare_at_price' => $compareAtPrice,
                        'stock' => rand(8, 40),
                        'category_id' => $category->id,
                        'is_featured' => $i === 0, // first item per category featured, for variety
                        'featured_order' => $i,
                        'images' => $specificImages ?? $this->nextImages(rand(3, 4)),
                        'status' => 'active',
                    ]
                );

                $created[] = $product->id;
            }
        }

        $this->command?->info('Demo catalog products created/updated: '.count($created).' (IDs '.min($created).'-'.max($created).')');
    }

    /** @return string[] */
    private function nextImages(int $count): array
    {
        $pool = [
            '/images/products/v_style_carbon_front_lip.png',
            '/images/products/twill_side_skirts.png',
            '/images/products/abs_chin_spoiler.png',
            '/images/products/front_splitter_winglets.png',
            '/images/products/gloss_black_side_skirts.png',
            '/images/products/gt_style_rear_wing.png',
            '/images/products/carbon_trunk_spoiler.png',
            '/images/products/ducktail_spoiler.png',
            '/images/products/roof_spoiler_extension.png',
            '/images/products/adjustable_rear_wing.png',
            '/images/products/forged_carbon_mirror_caps.png',
            '/images/products/bat_wing_hood_vents.png',
            '/images/products/batman_mirror_covers.png',
            '/images/products/bat_window_louver.png',
            '/images/products/tyre_stickers_white.png',
            '/images/products/tyre_stickers_red.png',
            '/images/products/tyre_stickers_yellow.png',
            '/images/products/quad_fin_diffuser.png',
            '/images/products/carbon_rear_diffuser.png',
            '/images/products/gloss_black_diffuser.png',
            '/images/products/oled_sequential_tails.png',
            '/images/products/led_drl_fog_lamps.png',
            '/images/products/sequential_mirror_indicators.png',
            '/images/products/led_halo_rings.png',
            '/images/products/high_flow_downpipe.png',
            '/images/products/component_speaker_kit.png',
            '/images/products/subwoofer_amp_combo.png',
            '/images/products/carplay_head_unit.png',
            '/images/products/dash_cam_night_vision.png',
        ];

        $images = [];
        for ($i = 0; $i < $count; $i++) {
            $images[] = $pool[$this->imageCursor % count($pool)];
            $this->imageCursor++;
        }

        return $images;
    }
}
