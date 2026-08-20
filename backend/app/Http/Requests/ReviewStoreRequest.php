<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ReviewStoreRequest extends FormRequest
{
    // Public storefront endpoint — no auth required.
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'product_id' => ['nullable', 'integer', 'exists:products,id'],
            'order_id' => ['nullable', 'integer', 'exists:orders,id'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'rating' => ['required', 'integer', 'between:1,5'],
            'comment' => ['required', 'string', 'max:2000'],
            // Client-side checks are never trusted for a money-adjacent,
            // publicly-writable endpoint — mime/size validated server-side too.
            'media' => ['nullable', 'array', 'max:5'],
            'media.*' => ['file', 'mimes:jpg,jpeg,png,webp,mp4,mov', 'max:25600'],
        ];
    }
}
