<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateRazorpayPercentRequest extends FormRequest
{
    // Route is behind auth:sanctum — authorization is the middleware's job.
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'percent' => ['required', 'integer', 'between:1,100'],
        ];
    }
}
