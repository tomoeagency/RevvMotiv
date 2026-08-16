<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CouponPreviewRequest extends FormRequest
{
    // Public storefront endpoint — guest checkout, no auth required.
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'coupon_code' => ['required', 'string', 'max:50'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
        ];
    }
}
