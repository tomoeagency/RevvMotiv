<?php

namespace App\Http\Requests\Admin;

use App\Models\GalleryItem;
use Illuminate\Foundation\Http\FormRequest;

// Metadata only — replacing the media file itself means deleting/creating
// a whole new gallery entry, same as every other media-bearing admin form
// in this app (e.g. project views handle replacement via remove+re-add,
// not in-place file swap).
class GalleryItemUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category' => ['nullable', 'string', 'in:' . implode(',', array_keys(GalleryItem::CATEGORIES))],
            'caption' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'active' => ['nullable', 'boolean'],
        ];
    }
}
