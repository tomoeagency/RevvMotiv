<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class ProjectStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash', 'unique:projects,slug'],
            'car_make' => ['required', 'string', 'max:100'],
            'car_model' => ['required', 'string', 'max:100'],
            'description' => ['nullable', 'string'],
            'status' => ['required', 'in:active,draft'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'cover_image' => ['nullable', 'file', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }
}
