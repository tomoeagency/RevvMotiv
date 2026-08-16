<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class Coupon extends Model
{
    protected $fillable = [
        'code', 'type', 'value', 'min_order_amount', 'starts_at', 'expires_at',
        'usage_limit', 'times_used', 'active',
        'is_public', 'influencer_name', 'scope_type', 'scope_product_ids', 'scope_category_id',
    ];

    protected $casts = [
        'value' => 'decimal:2',
        'min_order_amount' => 'decimal:2',
        'starts_at' => 'datetime',
        'expires_at' => 'datetime',
        'usage_limit' => 'integer',
        'times_used' => 'integer',
        'active' => 'boolean',
        'is_public' => 'boolean',
        'scope_product_ids' => 'array',
    ];

    public function scopeCategory(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'scope_category_id');
    }

    // Checks status/date-range/usage-limit only — the min_order_amount vs.
    // cart total check happens in OrderController@store where the total is
    // actually known.
    public function isCurrentlyValid(): bool
    {
        if (! $this->active) {
            return false;
        }

        $now = now();

        if ($this->starts_at && $now->lt($this->starts_at)) {
            return false;
        }

        if ($this->expires_at && $now->gt($this->expires_at)) {
            return false;
        }

        if ($this->usage_limit !== null && $this->times_used >= $this->usage_limit) {
            return false;
        }

        return true;
    }

    public function discountFor(float $amount): float
    {
        $discount = $this->type === 'percent'
            ? $amount * ((float) $this->value / 100)
            : (float) $this->value;

        return round(min($discount, $amount), 2);
    }

    // Whether a given product's line item is within this coupon's discount
    // scope. 'all' matches everything; a category coupon whose category was
    // deleted (scope_category_id nulled via nullOnDelete) safely matches
    // nothing rather than silently falling back to discounting everything.
    public function matchesProduct(Product $product): bool
    {
        return match ($this->scope_type) {
            'all' => true,
            'products' => in_array($product->id, $this->scope_product_ids ?? [], true),
            'category' => $this->scope_category_id !== null && $product->category_id === $this->scope_category_id,
            default => false,
        };
    }

    // Human-readable summary for the public "available coupons" list.
    public function scopeLabel(): string
    {
        return match ($this->scope_type) {
            'products' => 'Select products',
            'category' => $this->scopeCategory?->name ? "{$this->scopeCategory->name} only" : 'Select category',
            default => 'All products',
        };
    }

    /**
     * @param  array<int, array{product_id: int, quantity: int}>  $items
     * @param  Collection<int, Product>  $productsById
     * @return array{discountBase: float, discountAmount: float}
     */
    public function computeDiscount(array $items, Collection $productsById): array
    {
        $discountBase = collect($items)
            ->filter(fn ($item) => $this->matchesProduct($productsById[$item['product_id']]))
            ->sum(fn ($item) => $productsById[$item['product_id']]->price * $item['quantity']);

        $discountBase = (float) $discountBase;

        return [
            'discountBase' => $discountBase,
            'discountAmount' => $discountBase > 0 ? $this->discountFor($discountBase) : 0.0,
        ];
    }

    /**
     * Resolves a code and validates it against a priced cart — status,
     * date range, usage limit, min order amount, and scope match — the same
     * rules order creation and the checkout preview endpoint both need.
     * Kept in one place after the scope_product_ids bug: money-logic
     * duplicated across two controllers is exactly how that drifted.
     *
     * @param  array<int, array{product_id: int, quantity: int}>  $items
     * @param  Collection<int, Product>  $productsById
     *
     * @throws ValidationException
     */
    public static function resolveForCart(string $code, float $subtotal, array $items, Collection $productsById): array
    {
        $coupon = static::where('code', strtoupper($code))->first();

        if (! $coupon || ! $coupon->isCurrentlyValid()) {
            throw ValidationException::withMessages([
                'coupon_code' => ['This coupon code is invalid or has expired.'],
            ]);
        }

        // Checked against the FULL cart regardless of scope — "spend
        // ₹2000, get 10% off Category X" is the intended pattern, not
        // "spend ₹2000 worth of Category X".
        if ($coupon->min_order_amount !== null && $subtotal < (float) $coupon->min_order_amount) {
            throw ValidationException::withMessages([
                'coupon_code' => ['This coupon requires a minimum order of ₹'.number_format((float) $coupon->min_order_amount, 2).'.'],
            ]);
        }

        $discount = $coupon->computeDiscount($items, $productsById);

        if ($discount['discountBase'] <= 0) {
            throw ValidationException::withMessages([
                'coupon_code' => ['This coupon doesn\'t apply to any items in your cart.'],
            ]);
        }

        return ['coupon' => $coupon, 'discountAmount' => $discount['discountAmount']];
    }
}
