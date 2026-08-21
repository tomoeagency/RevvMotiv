<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Product extends Model
{
    protected $fillable = [
        'title', 'slug', 'description', 'price', 'cost_price', 'compare_at_price',
        'stock', 'category_id', 'fitment', 'is_featured', 'featured_order',
        'images', 'video_url', 'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'cost_price' => 'decimal:2',
        'compare_at_price' => 'decimal:2',
        'is_featured' => 'boolean',
        'images' => 'array',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class)->orderBy('sort_order')->orderBy('id');
    }

    // GET /api/v1/products/{product} accepts either the numeric id or the
    // slug, so the frontend's slug-based product detail route can call it
    // directly without a separate lookup.
    public function resolveRouteBinding($value, $field = null): ?self
    {
        $query = ctype_digit((string) $value)
            ? $this->where('id', $value)
            : $this->where('slug', $value);

        return $query->where('status', 'active')->first();
    }
}
