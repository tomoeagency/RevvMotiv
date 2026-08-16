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
                'whatsapp_number' => AdminSetting::getValue('site_whatsapp_number', ''),
                'instagram_handle' => AdminSetting::getValue('site_instagram_handle', ''),
                'contact_email' => AdminSetting::getValue('site_contact_email', ''),
            ],
        ]);
    }
}
