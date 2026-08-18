<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Illuminate\Support\Str;

class Order extends Model
{
    protected $fillable = [
        'customer_name', 'customer_email', 'customer_phone', 'shipping_address',
        'total_amount', 'advance_amount', 'remaining_amount', 'advance_percent_applied',
        'coupon_id', 'discount_amount',
        'payment_status', 'order_status', 'razorpay_order_id', 'razorpay_payment_id',
        'source', 'payment_mode', 'notes', 'access_token',
    ];

    protected static function booted(): void
    {
        static::creating(function (Order $order) {
            if (empty($order->access_token)) {
                $order->access_token = Str::random(40);
            }
        });
    }

    protected $casts = [
        'total_amount' => 'decimal:2',
        'advance_amount' => 'decimal:2',
        'remaining_amount' => 'decimal:2',
        'advance_percent_applied' => 'integer',
        'discount_amount' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }
}
