<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductVariantResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $image = $this->image;
        if (is_string($image) && preg_match('#https?://[^/]+(/uploads/.*)#', $image, $matches)) {
            $image = $matches[1];
        }

        return [
            'id' => $this->id,
            'product_id' => $this->product_id,
            'name' => $this->name,
            'sku' => $this->sku,
            'price' => (float) $this->price,
            'compare_at_price' => $this->compare_at_price !== null ? (float) $this->compare_at_price : null,
            'stock' => (int) $this->stock,
            'in_stock' => $this->stock > 0,
            'image' => $image,
            'attributes' => $this->attributes ?? [],
            'is_default' => (bool) $this->is_default,
            'sort_order' => (int) $this->sort_order,
        ];
    }
}
