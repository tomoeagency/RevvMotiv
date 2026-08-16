<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class CouponStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $valueRules = ['required', 'numeric', 'min:0'];
        if ($this->input('type') === 'percent') {
            $valueRules[] = 'max:100';
        }

        return [
            'code' => ['required', 'string', 'max:50', 'alpha_dash', 'unique:coupons,code'],
            'type' => ['required', 'in:percent,fixed'],
            'value' => $valueRules,
            'min_order_amount' => ['nullable', 'numeric', 'min:0'],
            'starts_at' => ['nullable', 'date'],
            'expires_at' => ['nullable', 'date', 'after_or_equal:starts_at'],
            'usage_limit' => ['nullable', 'integer', 'min:1'],
            'active' => ['nullable', 'boolean'],
            'is_public' => ['nullable', 'boolean'],
            'influencer_name' => ['nullable', 'string', 'max:255'],
            'scope_type' => ['required', 'in:all,products,category'],
            'scope_product_ids' => ['required_if:scope_type,products', 'nullable', 'array'],
            'scope_product_ids.*' => ['integer', 'exists:products,id'],
            'scope_category_id' => ['required_if:scope_type,category', 'nullable', 'integer', 'exists:categories,id'],
        ];
    }
}
