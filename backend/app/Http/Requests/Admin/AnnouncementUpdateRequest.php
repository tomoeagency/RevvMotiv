<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

// Updates the GLOBAL announcement display settings (admin_settings) — the
// actual list of announcement entries is managed separately via
// Admin\AnnouncementController / AnnouncementStoreRequest.
class AnnouncementUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'announcement_enabled' => ['nullable', 'boolean'],
            'announcement_display_mode' => ['required', 'in:scroll,rotate'],
            'announcement_scroll_speed' => ['required_if:announcement_display_mode,scroll', 'nullable', 'integer', 'min:1', 'max:300'],
            'announcement_rotate_duration' => ['required_if:announcement_display_mode,rotate', 'nullable', 'integer', 'min:1', 'max:60'],
        ];
    }
}
