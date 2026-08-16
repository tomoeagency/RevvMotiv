<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReviewResource extends JsonResource
{
    // customer_email is moderation-only and intentionally never included here.
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'customer_name' => $this->customer_name,
            'rating' => (int) $this->rating,
            'comment' => $this->comment,
            'media_urls' => $this->media_urls ?? [],
            'verified_purchase' => (bool) $this->verified_purchase,
            'product' => $this->whenLoaded('product', fn () => [
                'id' => $this->product->id,
                'title' => $this->product->title,
                'slug' => $this->product->slug,
            ]),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
