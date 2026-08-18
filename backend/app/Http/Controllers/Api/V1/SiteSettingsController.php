<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AdminSetting;

class SiteSettingsController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => [
                'whatsapp_number' => AdminSetting::getValue('site_whatsapp_number', '+91 83683 43232'),
                'instagram_handle' => AdminSetting::getValue('site_instagram_handle', '@revvmotiv'),
                'contact_email' => AdminSetting::getValue('site_contact_email', 'support@revvmotiv.com'),
                'razorpay_advance_percent' => max(1, (int) AdminSetting::getValue('razorpay_advance_percent', '20')),
            ],
        ]);
    }
}
