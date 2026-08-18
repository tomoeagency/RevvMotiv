<?php

namespace Database\Seeders;

use App\Models\AdminSetting;
use Illuminate\Database\Seeder;

class AdminSettingSeeder extends Seeder
{
    public function run(): void
    {
        AdminSetting::updateOrCreate(
            ['key' => 'razorpay_advance_percent'],
            ['value' => '20']
        );

        // Off by default — an empty/unconfigured announcement strip should
        // never show on a fresh install. Actual announcement entries live
        // in the `announcements` table, managed via the admin panel.
        AdminSetting::updateOrCreate(['key' => 'announcement_enabled'], ['value' => '0']);
        AdminSetting::updateOrCreate(['key' => 'announcement_display_mode'], ['value' => 'scroll']);
        AdminSetting::updateOrCreate(['key' => 'announcement_scroll_speed'], ['value' => '30']);
        AdminSetting::updateOrCreate(['key' => 'announcement_rotate_duration'], ['value' => '4']);

        AdminSetting::updateOrCreate(['key' => 'site_whatsapp_number'], ['value' => '+91 83683 43232']);
        AdminSetting::updateOrCreate(['key' => 'site_instagram_handle'], ['value' => '@revvmotiv']);
        AdminSetting::updateOrCreate(['key' => 'site_contact_email'], ['value' => 'support@revvmotiv.com']);
    }
}
