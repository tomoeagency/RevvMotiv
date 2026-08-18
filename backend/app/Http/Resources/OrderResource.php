<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'access_token' => $this->access_token,
            'total_amount' => (float) $this->total_amount,
            'advance_amount' => (float) $this->advance_amount,
            'remaining_amount' => (float) $this->remaining_amount,
            'advance_percent_applied' => $this->advance_percent_applied,
            'discount_amount' => (float) $this->discount_amount,
            'coupon_code' => $this->coupon?->code,
            'payment_status' => $this->payment_status,
            'order_status' => $this->order_status,
            'source' => $this->source,
            'payment_mode' => $this->payment_mode,
            'notes' => $this->notes,
            // Everything the frontend needs to open Razorpay Checkout.js —
            // amount is in paise, as Razorpay's widget requires.
            'razorpay' => [
                'key_id' => config('services.razorpay.key_id'),
                'order_id' => $this->razorpay_order_id,
                'amount' => (int) round(((float) $this->advance_amount) * 100),
                'currency' => 'INR',
            ],
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
