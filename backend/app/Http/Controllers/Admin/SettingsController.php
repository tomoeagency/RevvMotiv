<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AnnouncementUpdateRequest;
use App\Http\Requests\Admin\SiteSettingsUpdateRequest;
use App\Http\Requests\UpdateRazorpayPercentRequest;
use App\Models\AdminSetting;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class SettingsController extends Controller
{
    public function edit(): View
    {
        return view('admin.settings.edit', [
            'razorpayAdvancePercent' => (int) AdminSetting::getValue('razorpay_advance_percent', 20),
            'announcementEnabled' => filter_var(AdminSetting::getValue('announcement_enabled', '0'), FILTER_VALIDATE_BOOLEAN),
            'announcementDisplayMode' => AdminSetting::getValue('announcement_display_mode', 'scroll'),
            'announcementScrollSpeed' => (int) AdminSetting::getValue('announcement_scroll_speed', 30),
            'announcementRotateDuration' => (int) AdminSetting::getValue('announcement_rotate_duration', 4),
            'siteWhatsappNumber' => AdminSetting::getValue('site_whatsapp_number', ''),
            'siteInstagramHandle' => AdminSetting::getValue('site_instagram_handle', ''),
            'siteContactEmail' => AdminSetting::getValue('site_contact_email', ''),
        ]);
    }

    // Reuses UpdateRazorpayPercentRequest — the exact same validation rules
    // and write path as the API's SettingController@updateRazorpayAdvancePercent
    // (Api/V1/Admin/SettingController.php) — so this form isn't a second,
    // divergent implementation of the same setting update.
    public function update(UpdateRazorpayPercentRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        AdminSetting::updateOrCreate(
            ['key' => 'razorpay_advance_percent'],
            ['value' => (string) $validated['percent']]
        );

        return redirect()->route('admin.settings.edit')->with('status', 'Settings updated.');
    }

    public function updateAnnouncement(AnnouncementUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        AdminSetting::updateOrCreate(['key' => 'announcement_enabled'], ['value' => $request->boolean('announcement_enabled') ? '1' : '0']);
        AdminSetting::updateOrCreate(['key' => 'announcement_display_mode'], ['value' => $validated['announcement_display_mode']]);
        AdminSetting::updateOrCreate(['key' => 'announcement_scroll_speed'], ['value' => (string) ($validated['announcement_scroll_speed'] ?? 30)]);
        AdminSetting::updateOrCreate(['key' => 'announcement_rotate_duration'], ['value' => (string) ($validated['announcement_rotate_duration'] ?? 4)]);

        return redirect()->route('admin.settings.edit')->with('status', 'Announcement settings updated.');
    }

    public function updateSiteSettings(SiteSettingsUpdateRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        AdminSetting::updateOrCreate(['key' => 'site_whatsapp_number'], ['value' => $validated['site_whatsapp_number'] ?? '']);
        AdminSetting::updateOrCreate(['key' => 'site_instagram_handle'], ['value' => $validated['site_instagram_handle'] ?? '']);
        AdminSetting::updateOrCreate(['key' => 'site_contact_email'], ['value' => $validated['site_contact_email'] ?? '']);

        return redirect()->route('admin.settings.edit')->with('status', 'Contact/footer settings updated.');
    }
}
