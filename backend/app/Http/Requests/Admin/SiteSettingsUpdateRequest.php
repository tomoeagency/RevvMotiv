<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class SiteSettingsUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'site_whatsapp_number' => ['nullable', 'string', 'max:20'],
            'site_instagram_handle' => ['nullable', 'string', 'max:50'],
            'site_contact_email' => ['nullable', 'email', 'max:255'],
        ];
    }
}
