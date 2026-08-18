<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class GalleryItemStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            // Accepts single file or bulk multiple files (images and videos)
            'media' => ['required'],
            'media.*' => ['file', 'mimes:jpg,jpeg,png,webp,mp4,mov,webm,PNG,JPG,JPEG,WEBP,MP4,MOV,WEBM', 'max:102400'],
            'caption' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ];
    }
}
