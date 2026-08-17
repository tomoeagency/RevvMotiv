-- RevvMotiv 100% Exact MySQL Dump
-- Generated directly from Laravel Schema

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for `migrations`
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1, '0001_01_01_000000_create_users_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2, '0001_01_01_000001_create_cache_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3, '0001_01_01_000002_create_jobs_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4, '2026_08_07_175421_create_personal_access_tokens_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5, '2026_08_07_175519_create_categories_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (6, '2026_08_07_175519_create_products_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (7, '2026_08_07_175520_create_admins_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (8, '2026_08_07_175521_create_admin_settings_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9, '2026_08_07_175522_create_orders_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (10, '2026_08_07_175523_create_order_items_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (11, '2026_08_07_175524_create_reviews_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (12, '2026_08_08_100001_add_cost_price_to_products_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (13, '2026_08_08_100002_add_cost_price_applied_to_order_items_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (14, '2026_08_08_100003_create_expenses_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (15, '2026_08_08_100004_create_coupons_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (16, '2026_08_08_100005_add_coupon_fields_to_orders_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (17, '2026_08_08_100006_create_leads_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (18, '2026_08_08_100007_create_enquiries_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (19, '2026_08_08_110001_add_avatar_url_to_admins_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (20, '2026_08_08_110002_create_announcements_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (21, '2026_08_08_120001_add_fitment_to_products_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (22, '2026_08_08_130001_create_policies_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (23, '2026_08_09_100001_create_expense_categories_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (24, '2026_08_09_100002_migrate_expenses_category_to_category_id', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (25, '2026_08_09_110001_create_projects_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (26, '2026_08_09_110002_create_project_views_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (27, '2026_08_09_120001_add_targeting_fields_to_coupons_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (28, '2026_08_09_120357_add_manual_order_fields_to_orders_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (29, '2026_08_10_054525_create_gallery_items_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (30, '2026_08_10_064606_fix_splitters_side_skirts_category_slug', 1);

DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int(11) DEFAULT NULL,
  `ip_address` varchar(255) DEFAULT NULL,
  `user_agent` longtext DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` varchar(191) NOT NULL,
  `value` longtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` varchar(191) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` int(11) NOT NULL,
  `reserved_at` int(11) DEFAULT NULL,
  `available_at` int(11) NOT NULL,
  `created_at` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` longtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` longtext NOT NULL,
  `queue` longtext NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `personal_access_tokens`;
CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` int(11) NOT NULL,
  `name` longtext NOT NULL,
  `token` varchar(255) NOT NULL,
  `abilities` longtext DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for `categories`
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (1, 'Splitters/Side Skirts', 'splittersside-skirts', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (2, 'Spoilers', 'spoilers', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (3, 'Batman Cover', 'batman-cover', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (4, 'Tyre Stickers', 'tyre-stickers', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (5, 'Diffusers', 'diffusers', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (6, 'Lights & Flashers', 'lights-flashers', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (7, 'Combo', 'combo', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (8, 'Car Audio & Utilities', 'car-audio-utilities', '2026-08-17 21:04:27', '2026-08-17 21:04:27');

DROP TABLE IF EXISTS `products`;
CREATE TABLE `products` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `description` longtext DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `compare_at_price` decimal(10,2) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT '0',
  `category_id` int(11) NOT NULL,
  `is_featured` int(11) NOT NULL DEFAULT '0',
  `featured_order` int(11) NOT NULL DEFAULT '0',
  `images` longtext DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `fitment` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for `products`
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (1, 'Twill Weave Side Skirt Extensions', 'twill-weave-side-skirt-extensions', 'Direct-fit side skirt extensions in a 2x2 twill carbon weave finish, blended into the factory skirt line with 3M adhesive plus mechanical clips.', 12500, 15000, 26, 1, 1, 0, '[\"\\/images\\/products\\/splitter_twill_side_skirts.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (2, 'ABS Chin Spoiler Splitter', 'abs-chin-spoiler-splitter', 'Lightweight ABS chin splitter for a lower front stance, includes factory-matched mounting clips, no drilling required.', 6500, NULL, 8, 1, 0, 1, '[\"\\/images\\/products\\/splitter_abs_chin_spoiler.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (3, 'Adjustable Front Splitter Winglets (Pair)', 'adjustable-front-splitter-winglets-pair', 'Bolt-on splitter winglets with adjustable angle for fine-tuning front-end aero without a full splitter swap.', 4200, NULL, 37, 1, 0, 2, '[\"\\/images\\/products\\/splitter_winglets_pair.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (4, 'Gloss Black Rocker Panel Side Skirts', 'gloss-black-rocker-panel-side-skirts', 'Rocker panel side skirts in gloss black, wind-tunnel profiled to reduce underbody turbulence.', 9800, 11500, 16, 1, 0, 3, '[\"\\/images\\/products\\/splitter_gloss_black_side_skirts.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (5, 'GT-Style Rear Wing Spoiler', 'gt-style-rear-wing-spoiler', 'Motorsport-style GT wing with adjustable uprights, dual-position angle adjustment for street or track setup.', 18500, NULL, 19, 2, 1, 0, '[\"\\/images\\/products\\/spoiler_gt_style.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (6, 'Carbon Fiber Trunk Lip Spoiler', 'carbon-fiber-trunk-lip-spoiler', 'Subtle trunk lip spoiler in real carbon fiber weave, adds rear downforce without altering the car\'s factory lines.', 9500, NULL, 18, 2, 0, 1, '[\"\\/images\\/products\\/spoiler_carbon_trunk_lip.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (7, 'Ducktail Spoiler — Universal Fit', 'ducktail-spoiler-universal-fit', 'Classic ducktail-profile spoiler, universal trunk mount kit included, paintable ABS construction.', 5500, NULL, 33, 2, 0, 2, '[\"\\/images\\/products\\/spoiler_ducktail_universal.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (8, 'Roof Spoiler Extension', 'roof-spoiler-extension', 'Roof-edge spoiler extension for hatchbacks, improves rear visibility-neutral airflow and adds a track-look finish.', 7200, NULL, 38, 2, 0, 3, '[\"\\/images\\/products\\/spoiler_roof_extension.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (9, 'Adjustable Rear Wing with Uprights', 'adjustable-rear-wing-with-uprights', 'Tall adjustable rear wing on aluminium uprights, multiple angle settings, includes trunk-mount hardware.', 22000, 26000, 14, 2, 0, 4, '[\"\\/images\\/products\\/spoiler_adjustable_rear_wing.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (10, 'Bat-Wing Hood Vent Covers (Pair)', 'bat-wing-hood-vent-covers-pair', 'Bat-wing profiled hood vent covers for a distinctive bonnet silhouette, ABS construction with factory-color-matched or gloss black finish.', 3200, NULL, 21, 3, 1, 0, '[\"\\/images\\/products\\/bat_wing_hood_vents.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (11, 'Batman-Style Side Mirror Covers', 'batman-style-side-mirror-covers', 'Angular bat-wing mirror covers, direct bolt-on replacement over factory mirror housings.', 2800, NULL, 23, 3, 0, 1, '[\"\\/images\\/products\\/batman_mirror_covers.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (12, 'Bat-Wing Fender Vent Trim (Pair)', 'bat-wing-fender-vent-trim-pair', 'Fender-mounted vent trim with a bat-wing edge profile, adhesive-backed for clean installation.', 2400, NULL, 12, 3, 0, 2, '[\"\\/images\\/products\\/bat_fender_trim.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (13, 'Batman Bonnet Scoop Cover', 'batman-bonnet-scoop-cover', 'Functional-look bonnet scoop cover with an angular bat-wing outline, lightweight ABS shell.', 4500, NULL, 8, 3, 0, 3, '[\"\\/images\\/products\\/bat_bonnet_scoop.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (14, 'Bat-Style Rear Window Louver Cover', 'bat-style-rear-window-louver-cover', 'Rear window louver cover with a bat-wing slat pattern, snap-fit installation, no drilling into the glass.', 6800, NULL, 27, 3, 0, 4, '[\"\\/images\\/products\\/bat_window_louver.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (15, 'Tyre Lettering Kit — White (Set of 8)', 'tyre-lettering-kit-white-set-of-8', 'Raised-letter permanent tyre stickers in white, fits most 15\"-19\" sidewalls, heat-cure adhesive application.', 1800, NULL, 18, 4, 1, 0, '[\"\\/images\\/products\\/tyre_stickers_white.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (16, 'Tyre Lettering Kit — Red (Set of 8)', 'tyre-lettering-kit-red-set-of-8', 'Raised-letter permanent tyre stickers in red for a track-day contrast look, same application as the white set.', 1800, NULL, 22, 4, 0, 1, '[\"\\/images\\/products\\/tyre_stickers_red.png\"]', 'active', '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (17, 'Raised Rubber Tyre Letters — Universal', 'raised-rubber-tyre-letters-universal', 'Individually applied raised rubber letters for a custom lettering layout, sold as a full alphabet + number set.', 2400, NULL, 24, 4, 0, 2, '[\"\\/images\\/products\\/tyre_stickers_universal.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (18, 'Permanent Tyre Stickers — Yellow', 'permanent-tyre-stickers-yellow', 'High-visibility yellow tyre lettering, weatherproof and rated for daily driving use.', 1600, NULL, 37, 4, 0, 3, '[\"\\/images\\/products\\/tyre_stickers_yellow.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (19, 'Tyre Sidewall Decal Kit — Silver', 'tyre-sidewall-decal-kit-silver', 'Silver metallic tyre sidewall decals, semi-permanent application, easily replaced when tyres are changed.', 1900, NULL, 23, 4, 0, 4, '[\"\\/images\\/products\\/tyre_stickers_silver.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (20, 'Quad-Fin Rear Diffuser', 'quad-fin-rear-diffuser', 'Four-fin rear diffuser insert, bolts below the rear bumper for a motorsport-look rear end.', 8500, NULL, 38, 5, 1, 0, '[\"\\/images\\/products\\/diffuser_quad_fin.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (21, 'Carbon Fiber Rear Diffuser', 'carbon-fiber-rear-diffuser', 'Real carbon fiber rear diffuser with a deep fin profile, includes heat-resistant mounting hardware for exhaust clearance.', 16500, NULL, 35, 5, 0, 1, '[\"\\/images\\/products\\/diffuser_carbon_fiber.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (22, 'Gloss Black Bumper Diffuser', 'gloss-black-bumper-diffuser', 'Gloss black ABS diffuser insert, direct-fit for most hatchback rear bumpers.', 6200, NULL, 26, 5, 0, 2, '[\"\\/images\\/products\\/diffuser_gloss_black.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (23, 'Dual-Exit Diffuser with Fins', 'dual-exit-diffuser-with-fins', 'Diffuser designed around dual-exit exhaust tips, paired fin layout for visual width.', 9200, NULL, 17, 5, 0, 3, '[\"\\/images\\/products\\/diffuser_dual_exit.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (24, 'Universal Bolt-On Diffuser Fins (Set of 4)', 'universal-bolt-on-diffuser-fins-set-of-4', 'Individual bolt-on diffuser fins for custom layouts on bumpers without a factory diffuser cutout.', 3500, NULL, 40, 5, 0, 4, '[\"\\/images\\/products\\/diffuser_universal_fins.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (25, 'LED DRL Fog Lamp Kit', 'led-drl-fog-lamp-kit', 'Daytime running light + fog lamp combo kit, plug-and-play harness for most hatchback and sedan platforms.', 5500, NULL, 29, 6, 1, 0, '[\"\\/images\\/products\\/led_drl_fog_lamps.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (26, 'Sequential Turn Signal Mirror Indicators', 'sequential-turn-signal-mirror-indicators', 'Direct-fit mirror indicators with a sequential sweep animation, matches the sequential tail light look.', 3200, NULL, 11, 6, 0, 1, '[\"\\/images\\/products\\/sequential_mirror_indicators.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (27, 'Smoked LED Third Brake Light', 'smoked-led-third-brake-light', 'Smoked-lens third brake light with bright LED array, retains full brightness despite the tint.', 2800, NULL, 38, 6, 0, 2, '[\"\\/images\\/products\\/smoked_third_brake_light.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (28, 'LED Headlight Halo Rings (Pair)', 'led-headlight-halo-rings-pair', 'Angel-eye halo ring kit for projector headlights, even illumination with no visible hotspots.', 4500, NULL, 36, 6, 0, 3, '[\"\\/images\\/products\\/led_halo_rings.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (29, 'Front + Rear Aero Combo Kit', 'front-rear-aero-combo-kit', 'Bundle: front splitter + rear diffuser, matched finish, installed together for a complete aero refresh at a bundled price.', 38000, 45000, 36, 7, 1, 0, '[\"\\/images\\/products\\/combo_aero_kit.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (30, 'Complete Lighting Upgrade Combo', 'complete-lighting-upgrade-combo', 'Bundle: sequential tail lights + LED DRL fog lamp kit, everything needed for a full front-and-rear lighting refresh.', 12500, 15000, 39, 7, 0, 1, '[\"\\/images\\/products\\/combo_lighting.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (31, 'Exterior Styling Starter Combo', 'exterior-styling-starter-combo', 'Bundle: mirror caps + side skirt extensions + tyre lettering kit — an easy first styling upgrade.', 15500, NULL, 26, 7, 0, 2, '[\"\\/images\\/products\\/combo_starter_styling.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (32, 'Track Look Combo — Splitter + Diffuser + Stickers', 'track-look-combo-splitter-diffuser-stickers', 'Bundle: front splitter, rear diffuser, and a tyre lettering kit for a coordinated track-day look.', 21000, 25000, 35, 7, 0, 3, '[\"\\/images\\/products\\/combo_track_look.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (33, 'Component Speaker Upgrade Kit', 'component-speaker-upgrade-kit', 'Front component speaker set with dedicated tweeters and crossovers, plug-and-play with most factory harnesses.', 8500, NULL, 10, 8, 1, 0, '[\"\\/images\\/products\\/component_speaker_kit.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (34, 'Subwoofer + Amplifier Combo', 'subwoofer-amplifier-combo', 'Compact under-seat subwoofer paired with a matched amplifier, minimal boot space used.', 15500, NULL, 23, 8, 0, 1, '[\"\\/images\\/products\\/subwoofer_amp_combo.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (35, 'Android Auto / CarPlay Head Unit', 'android-auto-carplay-head-unit', 'Wireless Android Auto and CarPlay head unit, direct-fit dash kit included for most compact sedans and hatchbacks.', 22000, NULL, 26, 8, 0, 2, '[\"\\/images\\/products\\/android_head_unit.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (36, 'Dash Cam with Night Vision', 'dash-cam-with-night-vision', 'Front-facing dash cam with night vision recording and loop recording, includes a hardwire kit for parked-car monitoring.', 6500, NULL, 29, 8, 0, 3, '[\"\\/images\\/products\\/dash_cam_night_vision.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (37, 'Wireless Phone Charger Mount', 'wireless-phone-charger-mount', 'Vent-mount wireless charger with auto-clamp arms, Qi-compatible up to 15W.', 1800, NULL, 33, 8, 0, 4, '[\"\\/images\\/products\\/wireless_phone_charger.png\"]', 'active', '2026-08-17 21:04:28', '2026-08-17 21:04:28', NULL, NULL);

DROP TABLE IF EXISTS `admins`;
CREATE TABLE `admins` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for `admins`
INSERT INTO `admins` (`id`, `name`, `email`, `password`, `remember_token`, `created_at`, `updated_at`, `avatar_url`) VALUES (1, 'RevvMotiv Admin', 'admin@revvmotiv.test', '$2y$12$rwAMScy1uTGyIkaayMUFL.m6mMVEEM9/sUe6wpySVpWRskg4P2wLa', NULL, '2026-08-17 21:04:27', '2026-08-17 21:04:27', NULL);

DROP TABLE IF EXISTS `admin_settings`;
CREATE TABLE `admin_settings` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` varchar(191) NOT NULL,
  `value` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for `admin_settings`
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (1, 'razorpay_advance_percent', '20', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (2, 'announcement_enabled', '0', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (3, 'announcement_display_mode', 'scroll', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (4, 'announcement_scroll_speed', '30', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (5, 'announcement_rotate_duration', '4', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (6, 'site_whatsapp_number', '+91 8368343232', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (7, 'site_instagram_handle', '@revvmotiv', '2026-08-17 21:04:27', '2026-08-17 21:04:27');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (8, 'site_contact_email', 'revvmotiv@gmail.com', '2026-08-17 21:04:27', '2026-08-17 21:04:27');

DROP TABLE IF EXISTS `order_items`;
CREATE TABLE `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `product_title` varchar(255) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `cost_price_applied` decimal(10,2) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `reviews`;
CREATE TABLE `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` longtext NOT NULL,
  `media_urls` longtext DEFAULT NULL,
  `verified_purchase` int(11) NOT NULL DEFAULT '0',
  `status` varchar(255) NOT NULL DEFAULT 'pending',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for `reviews`
INSERT INTO `reviews` (`id`, `product_id`, `order_id`, `customer_name`, `customer_email`, `rating`, `comment`, `media_urls`, `verified_purchase`, `status`, `created_at`, `updated_at`) VALUES (1, NULL, NULL, 'Arjun Mehta', 'arjun.mehta.demo@example.com', 5, 'Fitment was spot on, no drilling or trimming needed. The carbon weave actually matches the factory splitter texture closely, and it\'s held up fine after a month of daily driving including a few speed bumps I misjudged. Installed it myself with a buddy in about an hour.', '[\"\\/images\\/projects\\/swift_aero_front1.png\",\"\\/images\\/reels\\/reel_carbon_lip.png\"]', 1, 'approved', '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `reviews` (`id`, `product_id`, `order_id`, `customer_name`, `customer_email`, `rating`, `comment`, `media_urls`, `verified_purchase`, `status`, `created_at`, `updated_at`) VALUES (2, 26, NULL, 'Priya Nair', 'priya.nair.demo@example.com', 5, 'Plug and play like they promised — no relay or resistor hassle. The sequential sweep looks genuinely premium at night, not gimmicky. Only wish the packaging had a bit more padding, one corner of the box was dented in transit but the lights themselves were fine.', '[]', 1, 'approved', '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `reviews` (`id`, `product_id`, `order_id`, `customer_name`, `customer_email`, `rating`, `comment`, `media_urls`, `verified_purchase`, `status`, `created_at`, `updated_at`) VALUES (3, 11, NULL, 'Rohit Sharma', 'rohit.sharma.demo@example.com', 4, 'Good build quality and the twill weave is genuinely nice in person, not the printed-vinyl look some cheaper caps have. Direct bolt-on took maybe 15 minutes per side. Docking a star only because shipping took about 9 days, a bit longer than I expected.', '[]', 0, 'approved', '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `reviews` (`id`, `product_id`, `order_id`, `customer_name`, `customer_email`, `rating`, `comment`, `media_urls`, `verified_purchase`, `status`, `created_at`, `updated_at`) VALUES (4, NULL, NULL, 'Sana Fernandes', 'sana.fernandes.demo@example.com', 5, 'Completely changes the front-end stance of the car. A few people at a meet asked if it was a factory aero package. Ground clearance is a bit tighter now so I\'m careful on speed breakers, but that\'s expected with any front lip.', '[\"\\/images\\/products\\/v_style_carbon_front_lip.png\"]', 0, 'approved', '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `reviews` (`id`, `product_id`, `order_id`, `customer_name`, `customer_email`, `rating`, `comment`, `media_urls`, `verified_purchase`, `status`, `created_at`, `updated_at`) VALUES (5, 4, NULL, 'Karan Deshmukh', 'karan.deshmukh.demo@example.com', 3, 'Lights themselves work well, but I noticed the sequential animation on the right side is very slightly less bright than the left when both are running. Reached out to support about it and they were responsive, still waiting on a resolution though so adjusting my rating until it\'s sorted.', '[]', 1, 'approved', '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `reviews` (`id`, `product_id`, `order_id`, `customer_name`, `customer_email`, `rating`, `comment`, `media_urls`, `verified_purchase`, `status`, `created_at`, `updated_at`) VALUES (6, 2, NULL, 'Neha Kapoor', 'neha.kapoor.demo@example.com', 4, 'Color and finish match my factory mirrors almost perfectly, you really have to look closely to tell they\'re aftermarket. A bit pricier than similar caps I found elsewhere, but the fitment quality justifies it in my opinion.', '[]', 0, 'approved', '2026-08-17 21:04:28', '2026-08-17 21:04:28');

DROP TABLE IF EXISTS `leads`;
CREATE TABLE `leads` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `enquiries`;
CREATE TABLE `enquiries` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(191) NOT NULL,
  `message` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `announcements`;
CREATE TABLE `announcements` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `active` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `policies`;
CREATE TABLE `policies` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` varchar(191) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for `policies`
INSERT INTO `policies` (`id`, `slug`, `title`, `content`, `created_at`, `updated_at`) VALUES (1, 'refund-policy', 'Refund & Replacement Policy', 'At RevvMotiv, we carefully package and inspect every order before dispatch. Because our products are precision-fit car accessories, we do not accept returns on delivered products for reasons of personal preference.

## When a refund or replacement applies

We will offer a refund or replacement only when:

- You received the wrong product, or
- The product arrived defective or damaged.

## How to raise a claim

Contact us within 48 hours of delivery. To process your claim, you must provide a complete, uninterrupted unboxing video of the package, along with photos of the issue if we request them. Claims raised without this video cannot be processed.

## What isn\'t covered

We\'re unable to offer a refund or replacement for:

- A change of mind after purchase
- An incorrect size, model, or variant selected by the customer at checkout
- Minor variations in color or finish, which can occur naturally with dyed or finished materials
- Damage caused by improper installation, misuse, modification, or normal wear and tear
- Any claim submitted without the required unboxing video
- Any claim raised more than 48 hours after delivery

If your claim qualifies, we\'ll work with you to arrange a replacement or refund as quickly as possible.', '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `policies` (`id`, `slug`, `title`, `content`, `created_at`, `updated_at`) VALUES (2, 'shipping-policy', 'Shipping Policy', '## Processing time

Orders are dispatched within 48-72 hours of order confirmation. If you place your order over a weekend or on a public holiday, it will be processed on the next business day.

## Delivery time

Once dispatched, most orders arrive within 5-9 business days, depending on your location and the courier partner handling the delivery.

## Tracking

As soon as your order ships, we\'ll send you a shipping confirmation along with a tracking number so you can follow its progress.

## Delays outside our control

While we do our best to get every order to you on time, RevvMotiv is not responsible for delays caused by courier partners, natural disasters, government restrictions, or an incorrect shipping address provided at checkout. Please double-check your address before placing your order.', '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `policies` (`id`, `slug`, `title`, `content`, `created_at`, `updated_at`) VALUES (3, 'contact-information', 'Contact Us', 'We\'re here to help with anything related to your order or our products.

**Email:** revvmotiv@gmail.com
**Instagram:** @revvmotiv

We typically respond within 24-48 business hours.

## What we can help with

- Product questions and fitment advice
- Order status and updates
- Shipping and tracking queries
- Returns and exchanges
- Installation guidance
- Warranty support

Reach out any time — we\'re happy to help.', '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `policies` (`id`, `slug`, `title`, `content`, `created_at`, `updated_at`) VALUES (4, 'terms-of-service', 'Terms of Service', 'Welcome to RevvMotiv. By using our website and placing an order, you agree to the following terms.

## Eligibility

You must be at least 18 years old to place an order on our site. If you are under 18, please use this site only with the involvement and supervision of a parent or guardian.

## Product Information & Pricing

We work hard to keep product descriptions, images, and prices accurate, but errors can occasionally occur. If we discover a pricing or listing error on an order you\'ve placed, we reserve the right to correct it and will contact you before proceeding.

## Order Acceptance

Placing an order is an offer to purchase, not a guaranteed sale. We reserve the right to accept, reject, or cancel any order at our discretion — including in cases of suspected fraud, pricing errors, or insufficient stock. If we cancel an order after payment, we\'ll issue a full refund.

## Payment

Orders are processed and dispatched only after payment is successfully received.

## Shipping & Delivery

Orders are dispatched within 48-72 hours of confirmation, with delivery typically taking 5-9 business days depending on location and courier. See our Shipping Policy for full details.

## Returns, Refunds & Replacements

We do not accept returns for personal preference. Refunds or replacements are offered only for products that are the wrong item or arrive defective or damaged, and only when reported within 48 hours of delivery with a complete unboxing video. See our Refund Policy for full details.

## Installation

Some of our products require professional installation for correct fitment and performance. RevvMotiv is not responsible for damage resulting from improper or amateur installation.

## Limitation of Liability

To the extent permitted by law, RevvMotiv is not liable for any indirect, incidental, or consequential damages arising from the use of our products or website.

## Intellectual Property

All content on this website — including text, images, logos, and design — is the property of RevvMotiv and may not be used or reproduced without our permission.

## Governing Law

These terms are governed by the laws of India, and any disputes will be subject to the jurisdiction of Indian courts.', '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `policies` (`id`, `slug`, `title`, `content`, `created_at`, `updated_at`) VALUES (5, 'legal-notice', 'Legal Notice', 'This website is owned and operated by RevvMotiv.

## Intellectual Property

All content on this site, including product images, descriptions, branding, and design, is the intellectual property of RevvMotiv. Unauthorized use, reproduction, or distribution of this content is prohibited.

## Accuracy of Information

We make every effort to ensure product information on this site is accurate and up to date. However, we do not guarantee that all details are error-free at all times.

## Vehicle Compatibility

Our products are designed to fit specific vehicle makes, models, and body styles. It is the customer\'s responsibility to verify compatibility with their vehicle before placing an order.

## Third-Party Links

Our website may contain links to third-party websites. RevvMotiv is not responsible for the content, policies, or practices of any external sites.

## Limitation of Liability

RevvMotiv shall not be held liable for any loss or damage arising from the use of this website or our products, to the extent permitted by applicable law.

## Governing Law

This notice is governed by the laws of India.', '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `policies` (`id`, `slug`, `title`, `content`, `created_at`, `updated_at`) VALUES (6, 'privacy-policy', 'Privacy Policy', 'Your privacy matters to us. This policy explains what information we collect, how we use it, and the choices you have.

## Information We Collect

When you shop with us, we collect:

- **Contact and shipping details** — your name, email, phone number, and delivery address
- **Payment information** — processed securely through our payment partner, Razorpay; we do not store your card or bank details ourselves
- **Order history** — details of products you\'ve purchased and your order status
- **Device and usage information** — such as your browser type, IP address, and how you interact with our website, which helps us improve your experience

## How We Use Your Information

We use your information to:

- Process and fulfill your orders, including shipping and delivery
- Respond to your questions and provide customer support
- Detect and prevent fraud and unauthorized transactions
- Send you marketing updates about new products and offers, which you can opt out of at any time

## Sharing Your Information

We do not sell your personal information. We share it only where necessary to run our business, including with:

- **Razorpay**, our payment processor, to securely handle transactions
- **Courier and shipping partners**, to deliver your order to you

## Data Security

We take reasonable technical and organizational measures to protect your personal information from unauthorized access, loss, or misuse.

## Your Rights

You have the right to access, correct, or request deletion of your personal information. To exercise any of these rights, contact us at revvmotiv@gmail.com.

## Contact Us

If you have any questions about this privacy policy or how we handle your data, reach out to us at revvmotiv@gmail.com.', '2026-08-17 21:04:28', '2026-08-17 21:04:28');

DROP TABLE IF EXISTS `expense_categories`;
CREATE TABLE `expense_categories` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for `expense_categories`
INSERT INTO `expense_categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (1, 'Rent', 'rent', '2026-08-17 21:04:26', '2026-08-17 21:04:26');
INSERT INTO `expense_categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (2, 'Salary', 'salary', '2026-08-17 21:04:26', '2026-08-17 21:04:26');
INSERT INTO `expense_categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (3, 'Ads', 'ads', '2026-08-17 21:04:26', '2026-08-17 21:04:26');
INSERT INTO `expense_categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (4, 'Shipping', 'shipping', '2026-08-17 21:04:26', '2026-08-17 21:04:26');
INSERT INTO `expense_categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (5, 'Other', 'other', '2026-08-17 21:04:26', '2026-08-17 21:04:26');

DROP TABLE IF EXISTS `expenses`;
CREATE TABLE `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `description` varchar(255) DEFAULT NULL,
  `amount` decimal(10,2) NOT NULL,
  `expense_date` text NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `projects`;
CREATE TABLE `projects` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(191) NOT NULL,
  `car_make` varchar(255) NOT NULL,
  `car_model` varchar(255) NOT NULL,
  `cover_image` varchar(255) DEFAULT NULL,
  `description` longtext DEFAULT NULL,
  `status` varchar(255) NOT NULL DEFAULT 'draft',
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for `projects`
INSERT INTO `projects` (`id`, `title`, `slug`, `car_make`, `car_model`, `cover_image`, `description`, `status`, `sort_order`, `created_at`, `updated_at`) VALUES (1, '2023 Maruti Swift — Full Aero Kit', '2023-maruti-swift-full-aero-kit', 'Maruti Suzuki', 'Swift', '/images/projects/swift_cover.png', 'Complete exterior transformation: carbon front lip, side skirt extensions, and a rear diffuser to match. Customer wanted an aggressive stance without touching the suspension.', 'active', 1, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `projects` (`id`, `title`, `slug`, `car_make`, `car_model`, `cover_image`, `description`, `status`, `sort_order`, `created_at`, `updated_at`) VALUES (2, 'Hyundai i20 N Line — Blackout Package', 'hyundai-i20-n-line-blackout-package', 'Hyundai', 'i20 N Line', '/images/projects/i20_cover.png', 'Full gloss-black trim package: mirror caps, grille surround, and sequential tails, finished with a satin roof wrap for contrast against the factory red paint.', 'active', 2, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `projects` (`id`, `title`, `slug`, `car_make`, `car_model`, `cover_image`, `description`, `status`, `sort_order`, `created_at`, `updated_at`) VALUES (3, 'Volkswagen Polo GT — Track Look Build', 'volkswagen-polo-gt-track-look-build', 'Volkswagen', 'Polo GT', '/images/projects/polo_cover.png', 'Motorsport-inspired refresh for a customer who wanted a track-day look for weekend use — front splitter, tyre stickers, and an audio upgrade for the drive there.', 'active', 3, '2026-08-17 21:04:28', '2026-08-17 21:04:28');

DROP TABLE IF EXISTS `project_views`;
CREATE TABLE `project_views` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `view_type` varchar(255) NOT NULL,
  `images` longtext DEFAULT NULL,
  `work_description` longtext DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Data for `project_views`
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (1, 1, 'front', '[\"\\/images\\/projects\\/swift_front.png\",\"\\/images\\/projects\\/swift_aero_front1.png\"]', 'V-style carbon front lip fitted with factory-matched clips, no drilling. Repainted the surrounding bumper section for a seamless line.', 0, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (2, 1, 'left', '[\"\\/images\\/projects\\/swift_left.png\"]', 'Side skirt extensions installed and blended into the factory skirt line with 3M adhesive plus mechanical clips for long-term hold.', 1, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (3, 1, 'rear', '[\"\\/images\\/projects\\/swift_rear.png\"]', 'Rear diffuser insert fitted below the bumper, paired with a dual-exit exhaust tip upgrade for visual balance.', 2, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (4, 1, 'interior', '[\"\\/images\\/projects\\/swift_interior.png\"]', 'Carbon-finish dash trim and gear knob swap to tie the exterior theme into the cabin.', 3, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (5, 2, 'front', '[\"\\/images\\/projects\\/i20_front.png\"]', 'Grille surround and badge blacked out, factory chrome removed entirely for a cleaner front end.', 0, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (6, 2, 'right', '[\"\\/images\\/projects\\/i20_right.png\"]', 'Forged carbon mirror caps, direct bolt-on replacement, matched to the customer\'s existing carbon splitter.', 1, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (7, 2, 'rear', '[\"\\/images\\/projects\\/i20_rear.png\"]', 'OLED sequential tail lights installed plug-and-play, no wiring modifications needed on this generation.', 2, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (8, 2, 'top', '[\"\\/images\\/projects\\/i20_top.png\"]', 'Satin black roof wrap, edges tucked and heat-sealed under the trim for a factory-look finish.', 3, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (9, 3, 'front', '[\"\\/images\\/projects\\/polo_front.png\"]', 'Wind-tunnel profiled front splitter for a lower, more planted stance at speed.', 0, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (10, 3, 'left', '[\"\\/images\\/projects\\/polo_left.png\"]', 'Custom-cut tyre lettering applied in white for contrast against the black sidewalls.', 1, '2026-08-17 21:04:28', '2026-08-17 21:04:28');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (11, 3, 'interior', '[\"\\/images\\/projects\\/polo_interior.png\"]', 'Component speaker upgrade and sound deadening on both front doors for a noticeably cleaner stage.', 2, '2026-08-17 21:04:28', '2026-08-17 21:04:28');

DROP TABLE IF EXISTS `coupons`;
CREATE TABLE `coupons` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(191) NOT NULL,
  `type` varchar(255) NOT NULL,
  `value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT NULL,
  `starts_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `usage_limit` int(11) DEFAULT NULL,
  `times_used` int(11) NOT NULL DEFAULT '0',
  `active` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `is_public` int(11) NOT NULL DEFAULT '1',
  `influencer_name` varchar(255) DEFAULT NULL,
  `scope_type` varchar(255) NOT NULL DEFAULT 'all',
  `scope_product_ids` longtext DEFAULT NULL,
  `scope_category_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `shipping_address` longtext DEFAULT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `advance_amount` decimal(10,2) NOT NULL,
  `remaining_amount` decimal(10,2) NOT NULL,
  `advance_percent_applied` int(11) NOT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `order_status` varchar(255) NOT NULL DEFAULT 'pending',
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `coupon_id` int(11) DEFAULT NULL,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT '0',
  `source` varchar(255) NOT NULL DEFAULT 'website',
  `payment_mode` varchar(255) DEFAULT NULL,
  `notes` longtext DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DROP TABLE IF EXISTS `gallery_items`;
CREATE TABLE `gallery_items` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `media_url` varchar(255) NOT NULL,
  `media_type` varchar(255) NOT NULL,
  `caption` varchar(255) DEFAULT NULL,
  `sort_order` int(11) NOT NULL DEFAULT '0',
  `active` int(11) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
