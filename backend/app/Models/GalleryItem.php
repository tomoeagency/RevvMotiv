<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    // Predefined filter categories shown on the public gallery page —
    // value => display label, in display order.
    public const CATEGORIES = [
        'build' => 'Builds',
        'product' => 'Products',
        'workshop' => 'Workshop',
        'review' => 'Reviews',
    ];

    protected $fillable = ['media_url', 'media_type', 'category', 'caption', 'sort_order', 'active'];

    protected $casts = [
        'sort_order' => 'integer',
        'active' => 'boolean',
    ];
}
