-- RevvMotiv Full MySQL Database Schema & Seed Data
-- Import this directly into phpMyAdmin on cPanel

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `users` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sessions_user_id_index` (`user_id`),
  KEY `sessions_last_activity_index` (`last_activity`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL,
  PRIMARY KEY (`id`),
  KEY `jobs_queue_index` (`queue`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `categories` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `products` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `category_id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `fitment` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `cost_price` decimal(10,2) DEFAULT NULL,
  `compare_at_price` decimal(10,2) DEFAULT NULL,
  `in_stock` tinyint(1) NOT NULL DEFAULT 1,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`images`)),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `products_slug_unique` (`slug`),
  KEY `products_category_id_foreign` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `admins` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(255) NOT NULL DEFAULT 'manager',
  `avatar_url` varchar(255) DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admins_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `admin_settings` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `admin_settings_key_unique` (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `orders` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `customer_name` varchar(255) NOT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `customer_phone` varchar(255) NOT NULL,
  `shipping_address` text DEFAULT NULL,
  `payment_option` varchar(255) NOT NULL DEFAULT 'advance',
  `total_amount` decimal(10,2) NOT NULL,
  `advance_amount` decimal(10,2) NOT NULL,
  `remaining_amount` decimal(10,2) NOT NULL,
  `advance_percent_applied` int(11) NOT NULL DEFAULT 20,
  `discount_amount` decimal(10,2) NOT NULL DEFAULT 0.00,
  `coupon_code` varchar(255) DEFAULT NULL,
  `payment_status` varchar(255) NOT NULL DEFAULT 'pending',
  `order_status` varchar(255) NOT NULL DEFAULT 'placed',
  `razorpay_order_id` varchar(255) DEFAULT NULL,
  `razorpay_payment_id` varchar(255) DEFAULT NULL,
  `source` varchar(255) NOT NULL DEFAULT 'website',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `orders_razorpay_order_id_index` (`razorpay_order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `order_items` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `order_id` bigint(20) UNSIGNED NOT NULL,
  `product_id` bigint(20) UNSIGNED NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `unit_price` decimal(10,2) NOT NULL,
  `cost_price_applied` decimal(10,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `order_items_order_id_foreign` (`order_id`),
  KEY `order_items_product_id_foreign` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `reviews` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `product_id` bigint(20) UNSIGNED DEFAULT NULL,
  `customer_name` varchar(255) NOT NULL,
  `rating` int(11) NOT NULL,
  `comment` text NOT NULL,
  `media_urls` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`media_urls`)),
  `verified_purchase` tinyint(1) NOT NULL DEFAULT 0,
  `is_featured` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `reviews_product_id_foreign` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `expense_categories` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `expense_categories_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `incurred_at` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `expenses_category_id_foreign` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `coupons` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `code` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'percent',
  `value` decimal(10,2) NOT NULL,
  `min_order_amount` decimal(10,2) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `is_public` tinyint(1) NOT NULL DEFAULT 0,
  `applies_to` varchar(255) NOT NULL DEFAULT 'all',
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `product_ids` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`product_ids`)),
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `coupons_code_unique` (`code`),
  KEY `coupons_category_id_foreign` (`category_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `leads` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `enquiries` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `announcements` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `text` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `policies` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `slug` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `policies_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `projects` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `car_make` varchar(255) NOT NULL,
  `car_model` varchar(255) NOT NULL,
  `cover_image` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `projects_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `project_views` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `project_id` bigint(20) UNSIGNED NOT NULL,
  `view_type` varchar(255) NOT NULL,
  `images` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`images`)),
  `work_description` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `project_views_project_id_foreign` (`project_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `gallery_items` (
  `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
  `media_url` varchar(255) NOT NULL,
  `media_type` varchar(255) NOT NULL DEFAULT 'image',
  `caption` text DEFAULT NULL,
  `order` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- DATA INSERTS
-- --------------------------------------------------------

-- Data for table `categories`
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (1, 'Splitters/Side Skirts', 'splittersside-skirts', '2026-08-16 17:03:25', '2026-08-16 17:03:25');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (2, 'Spoilers', 'spoilers', '2026-08-16 17:03:25', '2026-08-16 17:03:25');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (3, 'Batman Cover', 'batman-cover', '2026-08-16 17:03:25', '2026-08-16 17:53:52');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (4, 'Tyre Stickers', 'tyre-stickers', '2026-08-16 17:03:25', '2026-08-16 17:03:25');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (5, 'Diffusers', 'diffusers', '2026-08-16 17:03:25', '2026-08-16 17:03:25');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (6, 'Lights & Flashers', 'lights-flashers', '2026-08-16 17:03:25', '2026-08-16 17:03:25');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (7, 'Combo', 'combo', '2026-08-16 17:03:25', '2026-08-16 17:03:25');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (8, 'Car Audio & Utilities', 'car-audio-utilities', '2026-08-16 17:03:25', '2026-08-16 17:03:25');
INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (9, 'test', 'test', '2026-08-16 17:54:05', '2026-08-16 17:54:05');

-- Data for table `products`
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (1, 'Twill Weave Side Skirt Extensions', 'twill-weave-side-skirt-extensions', 'Direct-fit side skirt extensions in a 2x2 twill carbon weave finish, blended into the factory skirt line with 3M adhesive plus mechanical clips.', 12500, 15000, 17, 1, 1, 0, '[\"\\/images\\/products\\/splitter_twill_side_skirts.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:11:19', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (2, 'ABS Chin Spoiler Splitter', 'abs-chin-spoiler-splitter', 'Lightweight ABS chin splitter for a lower front stance, includes factory-matched mounting clips, no drilling required.', 6500, NULL, 13, 1, 0, 1, '[\"\\/images\\/products\\/splitter_abs_chin_spoiler.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (3, 'Adjustable Front Splitter Winglets (Pair)', 'adjustable-front-splitter-winglets-pair', 'Bolt-on splitter winglets with adjustable angle for fine-tuning front-end aero without a full splitter swap.', 4200, NULL, 20, 1, 0, 2, '[\"\\/images\\/products\\/splitter_winglets_pair.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (4, 'Gloss Black Rocker Panel Side Skirts', 'gloss-black-rocker-panel-side-skirts', 'Rocker panel side skirts in gloss black, wind-tunnel profiled to reduce underbody turbulence.', 9800, 11500, 23, 1, 0, 3, '[\"\\/images\\/products\\/splitter_gloss_black_side_skirts.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (5, 'GT-Style Rear Wing Spoiler', 'gt-style-rear-wing-spoiler', 'Motorsport-style GT wing with adjustable uprights, dual-position angle adjustment for street or track setup.', 18500, NULL, 23, 2, 1, 0, '[\"\\/images\\/products\\/spoiler_gt_style.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (6, 'Carbon Fiber Trunk Lip Spoiler', 'carbon-fiber-trunk-lip-spoiler', 'Subtle trunk lip spoiler in real carbon fiber weave, adds rear downforce without altering the car\'s factory lines.', 9500, NULL, 23, 2, 0, 1, '[\"\\/images\\/products\\/spoiler_carbon_trunk_lip.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (7, 'Ducktail Spoiler — Universal Fit', 'ducktail-spoiler-universal-fit', 'Classic ducktail-profile spoiler, universal trunk mount kit included, paintable ABS construction.', 5500, NULL, 12, 2, 0, 2, '[\"\\/images\\/products\\/spoiler_ducktail_universal.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (8, 'Roof Spoiler Extension', 'roof-spoiler-extension', 'Roof-edge spoiler extension for hatchbacks, improves rear visibility-neutral airflow and adds a track-look finish.', 7200, NULL, 32, 2, 0, 3, '[\"\\/images\\/products\\/spoiler_roof_extension.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (9, 'Adjustable Rear Wing with Uprights', 'adjustable-rear-wing-with-uprights', 'Tall adjustable rear wing on aluminium uprights, multiple angle settings, includes trunk-mount hardware.', 22000, 26000, 17, 2, 0, 4, '[\"\\/images\\/products\\/spoiler_adjustable_rear_wing.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (10, 'Bat-Wing Hood Vent Covers (Pair)', 'bat-wing-hood-vent-covers-pair', 'Bat-wing profiled hood vent covers for a distinctive bonnet silhouette, ABS construction with factory-color-matched or gloss black finish.', 3200, NULL, 20, 3, 1, 0, '[\"\\/images\\/products\\/bat_wing_hood_vents.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:44:27', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (11, 'Batman-Style Side Mirror Covers', 'batman-style-side-mirror-covers', 'Angular bat-wing mirror covers, direct bolt-on replacement over factory mirror housings.', 2800, NULL, 37, 3, 0, 1, '[\"\\/images\\/products\\/batman_mirror_covers.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (12, 'Bat-Wing Fender Vent Trim (Pair)', 'bat-wing-fender-vent-trim-pair', 'Fender-mounted vent trim with a bat-wing edge profile, adhesive-backed for clean installation.', 2400, NULL, 24, 3, 0, 2, '[\"\\/images\\/products\\/bat_fender_trim.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (13, 'Batman Bonnet Scoop Cover', 'batman-bonnet-scoop-cover', 'Functional-look bonnet scoop cover with an angular bat-wing outline, lightweight ABS shell.', 4500, NULL, 8, 3, 0, 3, '[\"\\/images\\/products\\/bat_bonnet_scoop.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (14, 'Bat-Style Rear Window Louver Cover', 'bat-style-rear-window-louver-cover', 'Rear window louver cover with a bat-wing slat pattern, snap-fit installation, no drilling into the glass.', 6800, NULL, 38, 3, 0, 4, '[\"\\/images\\/products\\/bat_window_louver.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (15, 'Tyre Lettering Kit — White (Set of 8)', 'tyre-lettering-kit-white-set-of-8', 'Raised-letter permanent tyre stickers in white, fits most 15\"-19\" sidewalls, heat-cure adhesive application.', 1800, NULL, 28, 4, 1, 0, '[\"\\/images\\/products\\/tyre_stickers_white.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (16, 'Tyre Lettering Kit — Red (Set of 8)', 'tyre-lettering-kit-red-set-of-8', 'Raised-letter permanent tyre stickers in red for a track-day contrast look, same application as the white set.', 1800, NULL, 10, 4, 0, 1, '[\"\\/images\\/products\\/tyre_stickers_red.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (17, 'Raised Rubber Tyre Letters — Universal', 'raised-rubber-tyre-letters-universal', 'Individually applied raised rubber letters for a custom lettering layout, sold as a full alphabet + number set.', 2400, NULL, 24, 4, 0, 2, '[\"\\/images\\/products\\/tyre_stickers_universal.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (18, 'Permanent Tyre Stickers — Yellow', 'permanent-tyre-stickers-yellow', 'High-visibility yellow tyre lettering, weatherproof and rated for daily driving use.', 1600, NULL, 27, 4, 0, 3, '[\"\\/images\\/products\\/tyre_stickers_yellow.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (19, 'Tyre Sidewall Decal Kit — Silver', 'tyre-sidewall-decal-kit-silver', 'Silver metallic tyre sidewall decals, semi-permanent application, easily replaced when tyres are changed.', 1900, NULL, 33, 4, 0, 4, '[\"\\/images\\/products\\/tyre_stickers_silver.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (20, 'Quad-Fin Rear Diffuser', 'quad-fin-rear-diffuser', 'Four-fin rear diffuser insert, bolts below the rear bumper for a motorsport-look rear end.', 8500, NULL, 11, 5, 1, 0, '[\"\\/images\\/products\\/diffuser_quad_fin.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (21, 'Carbon Fiber Rear Diffuser', 'carbon-fiber-rear-diffuser', 'Real carbon fiber rear diffuser with a deep fin profile, includes heat-resistant mounting hardware for exhaust clearance.', 16500, NULL, 38, 5, 0, 1, '[\"\\/images\\/products\\/diffuser_carbon_fiber.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (22, 'Gloss Black Bumper Diffuser', 'gloss-black-bumper-diffuser', 'Gloss black ABS diffuser insert, direct-fit for most hatchback rear bumpers.', 6200, NULL, 36, 5, 0, 2, '[\"\\/images\\/products\\/diffuser_gloss_black.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (23, 'Dual-Exit Diffuser with Fins', 'dual-exit-diffuser-with-fins', 'Diffuser designed around dual-exit exhaust tips, paired fin layout for visual width.', 9200, NULL, 18, 5, 0, 3, '[\"\\/images\\/products\\/diffuser_dual_exit.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (24, 'Universal Bolt-On Diffuser Fins (Set of 4)', 'universal-bolt-on-diffuser-fins-set-of-4', 'Individual bolt-on diffuser fins for custom layouts on bumpers without a factory diffuser cutout.', 3500, NULL, 40, 5, 0, 4, '[\"\\/images\\/products\\/diffuser_universal_fins.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (25, 'LED DRL Fog Lamp Kit', 'led-drl-fog-lamp-kit', 'Daytime running light + fog lamp combo kit, plug-and-play harness for most hatchback and sedan platforms.', 5500, NULL, 30, 6, 1, 0, '[\"\\/images\\/products\\/led_drl_fog_lamps.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (26, 'Sequential Turn Signal Mirror Indicators', 'sequential-turn-signal-mirror-indicators', 'Direct-fit mirror indicators with a sequential sweep animation, matches the sequential tail light look.', 3200, NULL, 40, 6, 0, 1, '[\"\\/images\\/products\\/sequential_mirror_indicators.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (27, 'Smoked LED Third Brake Light', 'smoked-led-third-brake-light', 'Smoked-lens third brake light with bright LED array, retains full brightness despite the tint.', 2800, NULL, 24, 6, 0, 2, '[\"\\/images\\/products\\/smoked_third_brake_light.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (28, 'LED Headlight Halo Rings (Pair)', 'led-headlight-halo-rings-pair', 'Angel-eye halo ring kit for projector headlights, even illumination with no visible hotspots.', 4500, NULL, 31, 6, 0, 3, '[\"\\/images\\/products\\/led_halo_rings.png\"]', 'active', '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (29, 'Front + Rear Aero Combo Kit', 'front-rear-aero-combo-kit', 'Bundle: front splitter + rear diffuser, matched finish, installed together for a complete aero refresh at a bundled price.', 38000, 45000, 25, 7, 1, 0, '[\"\\/images\\/products\\/combo_aero_kit.png\"]', 'active', '2026-08-16 17:03:26', '2026-08-16 17:42:10', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (30, 'Complete Lighting Upgrade Combo', 'complete-lighting-upgrade-combo', 'Bundle: sequential tail lights + LED DRL fog lamp kit, everything needed for a full front-and-rear lighting refresh.', 12500, 15000, 15, 7, 0, 1, '[\"\\/images\\/products\\/combo_lighting.png\"]', 'active', '2026-08-16 17:03:26', '2026-08-16 17:03:26', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (31, 'Exterior Styling Starter Combo', 'exterior-styling-starter-combo', 'Bundle: mirror caps + side skirt extensions + tyre lettering kit — an easy first styling upgrade.', 15500, NULL, 40, 7, 0, 2, '[\"\\/images\\/products\\/combo_starter_styling.png\"]', 'active', '2026-08-16 17:03:26', '2026-08-16 17:03:26', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (32, 'Track Look Combo — Splitter + Diffuser + Stickers', 'track-look-combo-splitter-diffuser-stickers', 'Bundle: front splitter, rear diffuser, and a tyre lettering kit for a coordinated track-day look.', 21000, 25000, 16, 7, 0, 3, '[\"\\/images\\/products\\/combo_track_look.png\"]', 'active', '2026-08-16 17:03:26', '2026-08-16 17:03:26', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (33, 'Component Speaker Upgrade Kit', 'component-speaker-upgrade-kit', 'Front component speaker set with dedicated tweeters and crossovers, plug-and-play with most factory harnesses.', 8500, NULL, 16, 8, 1, 0, '[\"\\/images\\/products\\/component_speaker_kit.png\"]', 'active', '2026-08-16 17:03:26', '2026-08-16 17:14:56', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (34, 'Subwoofer + Amplifier Combo', 'subwoofer-amplifier-combo', 'Compact under-seat subwoofer paired with a matched amplifier, minimal boot space used.', 15500, NULL, 20, 8, 0, 1, '[\"\\/images\\/products\\/subwoofer_amp_combo.png\"]', 'active', '2026-08-16 17:03:26', '2026-08-16 17:03:26', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (35, 'Android Auto / CarPlay Head Unit', 'android-auto-carplay-head-unit', 'Wireless Android Auto and CarPlay head unit, direct-fit dash kit included for most compact sedans and hatchbacks.', 22000, NULL, 32, 8, 0, 2, '[\"\\/images\\/products\\/android_head_unit.png\"]', 'active', '2026-08-16 17:03:26', '2026-08-16 17:03:26', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (36, 'Dash Cam with Night Vision', 'dash-cam-with-night-vision', 'Front-facing dash cam with night vision recording and loop recording, includes a hardwire kit for parked-car monitoring.', 6500, NULL, 37, 8, 0, 3, '[\"\\/images\\/products\\/dash_cam_night_vision.png\"]', 'active', '2026-08-16 17:03:26', '2026-08-16 17:03:26', NULL, NULL);
INSERT INTO `products` (`id`, `title`, `slug`, `description`, `price`, `compare_at_price`, `stock`, `category_id`, `is_featured`, `featured_order`, `images`, `status`, `created_at`, `updated_at`, `cost_price`, `fitment`) VALUES (37, 'Wireless Phone Charger Mount', 'wireless-phone-charger-mount', 'Vent-mount wireless charger with auto-clamp arms, Qi-compatible up to 15W.', 1800, NULL, 17, 8, 0, 4, '[\"\\/images\\/products\\/wireless_phone_charger.png\"]', 'active', '2026-08-16 17:03:26', '2026-08-16 17:03:26', NULL, NULL);

-- Data for table `admins`
INSERT INTO `admins` (`id`, `name`, `email`, `password`, `remember_token`, `created_at`, `updated_at`, `avatar_url`) VALUES (1, 'RevvMotiv Admin', 'admin@revvmotiv.test', '$2y$12$J/PvybDIfoPOjqREVETZ3O.Bh/H8R9d4pPPYyBd5vH9qVadQSbM7G', NULL, '2026-08-16 17:03:25', '2026-08-16 17:03:25', NULL);

-- Data for table `admin_settings`
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (1, 'razorpay_advance_percent', '20', '2026-08-16 17:03:24', '2026-08-16 17:03:24');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (2, 'announcement_enabled', '0', '2026-08-16 17:03:24', '2026-08-16 17:03:24');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (3, 'announcement_display_mode', 'scroll', '2026-08-16 17:03:24', '2026-08-16 17:03:24');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (4, 'announcement_scroll_speed', '30', '2026-08-16 17:03:24', '2026-08-16 17:03:24');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (5, 'announcement_rotate_duration', '4', '2026-08-16 17:03:24', '2026-08-16 17:03:24');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (6, 'site_whatsapp_number', '+91 8368343232', '2026-08-16 17:03:24', '2026-08-16 17:03:24');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (7, 'site_instagram_handle', '@revvmotiv', '2026-08-16 17:03:24', '2026-08-16 17:03:24');
INSERT INTO `admin_settings` (`id`, `key`, `value`, `created_at`, `updated_at`) VALUES (8, 'site_contact_email', 'revvmotiv@gmail.com', '2026-08-16 17:03:24', '2026-08-16 17:03:24');

-- Data for table `reviews`
INSERT INTO `reviews` (`id`, `product_id`, `order_id`, `customer_name`, `customer_email`, `rating`, `comment`, `media_urls`, `verified_purchase`, `status`, `created_at`, `updated_at`) VALUES (2, 26, NULL, 'Priya Nair', 'priya.nair.demo@example.com', 5, 'Plug and play like they promised — no relay or resistor hassle. The sequential sweep looks genuinely premium at night, not gimmicky. Only wish the packaging had a bit more padding, one corner of the box was dented in transit but the lights themselves were fine.', '[]', 1, 'approved', '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `reviews` (`id`, `product_id`, `order_id`, `customer_name`, `customer_email`, `rating`, `comment`, `media_urls`, `verified_purchase`, `status`, `created_at`, `updated_at`) VALUES (3, 11, NULL, 'Rohit Sharma', 'rohit.sharma.demo@example.com', 4, 'Good build quality and the twill weave is genuinely nice in person, not the printed-vinyl look some cheaper caps have. Direct bolt-on took maybe 15 minutes per side. Docking a star only because shipping took about 9 days, a bit longer than I expected.', '[]', 0, 'approved', '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `reviews` (`id`, `product_id`, `order_id`, `customer_name`, `customer_email`, `rating`, `comment`, `media_urls`, `verified_purchase`, `status`, `created_at`, `updated_at`) VALUES (4, NULL, NULL, 'Sana Fernandes', 'sana.fernandes.demo@example.com', 5, 'Completely changes the front-end stance of the car. A few people at a meet asked if it was a factory aero package. Ground clearance is a bit tighter now so I\'m careful on speed breakers, but that\'s expected with any front lip.', '[\"\\/images\\/products\\/v_style_carbon_front_lip.png\"]', 0, 'approved', '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `reviews` (`id`, `product_id`, `order_id`, `customer_name`, `customer_email`, `rating`, `comment`, `media_urls`, `verified_purchase`, `status`, `created_at`, `updated_at`) VALUES (5, 4, NULL, 'Karan Deshmukh', 'karan.deshmukh.demo@example.com', 3, 'Lights themselves work well, but I noticed the sequential animation on the right side is very slightly less bright than the left when both are running. Reached out to support about it and they were responsive, still waiting on a resolution though so adjusting my rating until it\'s sorted.', '[]', 1, 'approved', '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `reviews` (`id`, `product_id`, `order_id`, `customer_name`, `customer_email`, `rating`, `comment`, `media_urls`, `verified_purchase`, `status`, `created_at`, `updated_at`) VALUES (6, 2, NULL, 'Neha Kapoor', 'neha.kapoor.demo@example.com', 4, 'Color and finish match my factory mirrors almost perfectly, you really have to look closely to tell they\'re aftermarket. A bit pricier than similar caps I found elsewhere, but the fitment quality justifies it in my opinion.', '[]', 0, 'approved', '2026-08-16 17:03:26', '2026-08-16 17:03:26');

-- Data for table `expense_categories`
INSERT INTO `expense_categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (1, 'Rent', 'rent', '2026-08-16 17:03:22', '2026-08-16 17:03:22');
INSERT INTO `expense_categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (2, 'Salary', 'salary', '2026-08-16 17:03:22', '2026-08-16 17:03:22');
INSERT INTO `expense_categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (3, 'Ads', 'ads', '2026-08-16 17:03:22', '2026-08-16 17:03:22');
INSERT INTO `expense_categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (4, 'Shipping', 'shipping', '2026-08-16 17:03:22', '2026-08-16 17:03:22');
INSERT INTO `expense_categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES (5, 'Other', 'other', '2026-08-16 17:03:23', '2026-08-16 17:03:23');

-- Data for table `policies`
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

If your claim qualifies, we\'ll work with you to arrange a replacement or refund as quickly as possible.', '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `policies` (`id`, `slug`, `title`, `content`, `created_at`, `updated_at`) VALUES (2, 'shipping-policy', 'Shipping Policy', '## Processing time

Orders are dispatched within 48-72 hours of order confirmation. If you place your order over a weekend or on a public holiday, it will be processed on the next business day.

## Delivery time

Once dispatched, most orders arrive within 5-9 business days, depending on your location and the courier partner handling the delivery.

## Tracking

As soon as your order ships, we\'ll send you a shipping confirmation along with a tracking number so you can follow its progress.

## Delays outside our control

While we do our best to get every order to you on time, RevvMotiv is not responsible for delays caused by courier partners, natural disasters, government restrictions, or an incorrect shipping address provided at checkout. Please double-check your address before placing your order.', '2026-08-16 17:03:26', '2026-08-16 17:03:26');
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

Reach out any time — we\'re happy to help.', '2026-08-16 17:03:26', '2026-08-16 17:03:26');
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

These terms are governed by the laws of India, and any disputes will be subject to the jurisdiction of Indian courts.', '2026-08-16 17:03:26', '2026-08-16 17:03:26');
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

This notice is governed by the laws of India.', '2026-08-16 17:03:26', '2026-08-16 17:03:26');
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

If you have any questions about this privacy policy or how we handle your data, reach out to us at revvmotiv@gmail.com.', '2026-08-16 17:03:26', '2026-08-16 17:03:26');

-- Data for table `projects`
INSERT INTO `projects` (`id`, `title`, `slug`, `car_make`, `car_model`, `cover_image`, `description`, `status`, `sort_order`, `created_at`, `updated_at`) VALUES (1, '2023 Maruti Swift — Full Aero Kit', '2023-maruti-swift-full-aero-kit', 'Maruti Suzuki', 'Swift', '/images/projects/swift_cover.png', 'Complete exterior transformation: carbon front lip, side skirt extensions, and a rear diffuser to match. Customer wanted an aggressive stance without touching the suspension.', 'active', 1, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `projects` (`id`, `title`, `slug`, `car_make`, `car_model`, `cover_image`, `description`, `status`, `sort_order`, `created_at`, `updated_at`) VALUES (2, 'Hyundai i20 N Line — Blackout Package', 'hyundai-i20-n-line-blackout-package', 'Hyundai', 'i20 N Line', '/images/projects/i20_cover.png', 'Full gloss-black trim package: mirror caps, grille surround, and sequential tails, finished with a satin roof wrap for contrast against the factory red paint.', 'active', 2, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `projects` (`id`, `title`, `slug`, `car_make`, `car_model`, `cover_image`, `description`, `status`, `sort_order`, `created_at`, `updated_at`) VALUES (3, 'Volkswagen Polo GT — Track Look Build', 'volkswagen-polo-gt-track-look-build', 'Volkswagen', 'Polo GT', '/images/projects/polo_cover.png', 'Motorsport-inspired refresh for a customer who wanted a track-day look for weekend use — front splitter, tyre stickers, and an audio upgrade for the drive there.', 'active', 3, '2026-08-16 17:03:26', '2026-08-16 17:03:26');

-- Data for table `project_views`
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (1, 1, 'front', '[\"\\/images\\/projects\\/swift_front.png\",\"\\/images\\/projects\\/swift_aero_front1.png\"]', 'V-style carbon front lip fitted with factory-matched clips, no drilling. Repainted the surrounding bumper section for a seamless line.', 0, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (2, 1, 'left', '[\"\\/images\\/projects\\/swift_left.png\"]', 'Side skirt extensions installed and blended into the factory skirt line with 3M adhesive plus mechanical clips for long-term hold.', 1, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (3, 1, 'rear', '[\"\\/images\\/projects\\/swift_rear.png\"]', 'Rear diffuser insert fitted below the bumper, paired with a dual-exit exhaust tip upgrade for visual balance.', 2, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (4, 1, 'interior', '[\"\\/images\\/projects\\/swift_interior.png\"]', 'Carbon-finish dash trim and gear knob swap to tie the exterior theme into the cabin.', 3, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (5, 2, 'front', '[\"\\/images\\/projects\\/i20_front.png\"]', 'Grille surround and badge blacked out, factory chrome removed entirely for a cleaner front end.', 0, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (6, 2, 'right', '[\"\\/images\\/projects\\/i20_right.png\"]', 'Forged carbon mirror caps, direct bolt-on replacement, matched to the customer\'s existing carbon splitter.', 1, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (7, 2, 'rear', '[\"\\/images\\/projects\\/i20_rear.png\"]', 'OLED sequential tail lights installed plug-and-play, no wiring modifications needed on this generation.', 2, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (8, 2, 'top', '[\"\\/images\\/projects\\/i20_top.png\"]', 'Satin black roof wrap, edges tucked and heat-sealed under the trim for a factory-look finish.', 3, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (9, 3, 'front', '[\"\\/images\\/projects\\/polo_front.png\"]', 'Wind-tunnel profiled front splitter for a lower, more planted stance at speed.', 0, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (10, 3, 'left', '[\"\\/images\\/projects\\/polo_left.png\"]', 'Custom-cut tyre lettering applied in white for contrast against the black sidewalls.', 1, '2026-08-16 17:03:26', '2026-08-16 17:03:26');
INSERT INTO `project_views` (`id`, `project_id`, `view_type`, `images`, `work_description`, `sort_order`, `created_at`, `updated_at`) VALUES (11, 3, 'interior', '[\"\\/images\\/projects\\/polo_interior.png\"]', 'Component speaker upgrade and sound deadening on both front doors for a noticeably cleaner stage.', 2, '2026-08-16 17:03:26', '2026-08-16 17:03:26');

SET FOREIGN_KEY_CHECKS=1;
COMMIT;
