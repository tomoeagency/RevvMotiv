<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CouponResource extends JsonResource
{
    // influencer_name is intentionally never included here — that's an
    // internal tracking field, not for the public "available coupons" list.
    public function toArray(Request $request): array
    {
        return [
            'code' => $this->code,
            'type' => $this->type,
            'value' => (float) $this->value,
            'min_order_amount' => $this->min_order_amount !== null ? (float) $this->min_order_amount : null,
            'expires_at' => $this->expires_at?->toIso8601String(),
            'applies_to' => $this->scopeLabel(),
        ];
    }
}
