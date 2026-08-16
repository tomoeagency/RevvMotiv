<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AdminSetting;
use App\Models\Announcement;

class AnnouncementController extends Controller
{
    // BREAKING CHANGE from the single-announcement shape: `text`/`link_url`
    // are replaced by an `announcements` list, since the admin panel now
    // manages multiple entries. See announcement_display_mode for how the
    // frontend should render the list ("scroll" = join with a separator and
    // continuously scroll; "rotate" = show one at a time, switching every
    // `rotate_duration` seconds).
    public function index()
    {
        return response()->json([
            'data' => [
                'enabled' => filter_var(AdminSetting::getValue('announcement_enabled', '0'), FILTER_VALIDATE_BOOLEAN),
                'display_mode' => AdminSetting::getValue('announcement_display_mode', 'scroll'),
                'scroll_speed' => (int) AdminSetting::getValue('announcement_scroll_speed', 30),
                'rotate_duration' => (int) AdminSetting::getValue('announcement_rotate_duration', 4),
                'announcements' => Announcement::where('active', true)
                    ->orderBy('sort_order')
                    ->get()
                    ->map(fn (Announcement $a) => [
                        'id' => $a->id,
                        'text' => $a->text,
                        'link_url' => $a->link_url,
                    ]),
            ],
        ]);
    }
}
