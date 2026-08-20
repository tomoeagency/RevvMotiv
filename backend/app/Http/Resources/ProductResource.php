<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $normalizedImages = collect($this->images ?? [])->map(function ($img) {
            if (is_string($img) && preg_match('#https?://[^/]+(/uploads/.*)#', $img, $matches)) {
                return $matches[1];
            }
            return $img;
        })->values()->all();

        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (float) $this->price,
            'compare_at_price' => $this->compare_at_price !== null ? (float) $this->compare_at_price : null,
            'in_stock' => $this->stock > 0,
            'fitment' => $this->fitment,
            'is_featured' => (bool) $this->is_featured,
            'images' => $normalizedImages,
            'category' => new CategoryResource($this->whenLoaded('category')),
            'variants' => ProductVariantResource::collection($this->variants),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
