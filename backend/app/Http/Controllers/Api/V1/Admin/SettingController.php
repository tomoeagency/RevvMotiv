<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateRazorpayPercentRequest;
use App\Models\AdminSetting;

class SettingController extends Controller
{
    // Note: does NOT touch any already-created order — orders snapshot
    // advance_percent_applied at creation time, per razorpay-advance-payment
    // skill. This only changes the value used for orders placed from now on.
    public function updateRazorpayAdvancePercent(UpdateRazorpayPercentRequest $request)
    {
        $validated = $request->validated();

        $setting = AdminSetting::updateOrCreate(
            ['key' => 'razorpay_advance_percent'],
            ['value' => (string) $validated['percent']]
        );

        return response()->json([
            'data' => [
                'key' => $setting->key,
                'value' => (int) $setting->value,
            ],
        ]);
    }
}
