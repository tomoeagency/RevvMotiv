<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'product_id', 'order_id', 'customer_name', 'customer_email',
        'rating', 'comment', 'media_urls', 'verified_purchase', 'status',
    ];

    protected $casts = [
        'rating' => 'integer',
        'media_urls' => 'array',
        'verified_purchase' => 'boolean',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
