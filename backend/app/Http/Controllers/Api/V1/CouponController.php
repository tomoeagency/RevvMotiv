<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\CouponPreviewRequest;
use App\Http\Resources\CouponResource;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Validation\ValidationException;

class CouponController extends Controller
{
    // Only coupons the admin has explicitly marked is_public=true, and that
    // are currently valid (active, within date range, under usage limit).
    // influencer_name is intentionally never included — that's an internal
    // tracking field, and influencer/campaign codes are typically NOT
    // public anyway (handed out off-platform, redeemable but not browsable).
    public function available()
    {
        $coupons = Coupon::where('is_public', true)
            ->where('active', true)
            ->where(function ($q) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('expires_at')->orWhere('expires_at', '>=', now());
            })
            ->where(function ($q) {
                $q->whereNull('usage_limit')->orWhereColumn('times_used', '<', 'usage_limit');
            })
            ->with('scopeCategory')
            ->orderByDesc('created_at')
            ->get();

        return response()->json([
            'data' => CouponResource::collection($coupons),
        ]);
    }

    // Lets the checkout page's "Apply" button show a real discount before
    // the customer pays, without creating an order or touching Razorpay.
    // Deliberately allows any currently-valid code here (not just
    // is_public=true ones) — a hidden influencer code the customer typed
    // in by hand should still preview correctly, same as it would at
    // actual checkout; is_public only controls what's browsable up front.
    public function preview(CouponPreviewRequest $request)
    {
        $validated = $request->validated();

        $productIds = collect($validated['items'])->pluck('product_id');
        $products = Product::whereIn('id', $productIds)
            ->where('status', 'active')
            ->get()
            ->keyBy('id');

        foreach ($validated['items'] as $item) {
            if (! $products->has($item['product_id'])) {
                throw ValidationException::withMessages([
                    'items' => ['One or more items are no longer available.'],
                ]);
            }
        }

        $subtotal = collect($validated['items'])->sum(
            fn ($item) => $products[$item['product_id']]->price * $item['quantity']
        );

        $resolved = Coupon::resolveForCart($validated['coupon_code'], (float) $subtotal, $validated['items'], $products);
        $coupon = $resolved['coupon'];
        $discountAmount = $resolved['discountAmount'];

        return response()->json([
            'data' => [
                'code' => $coupon->code,
                'discount_amount' => $discountAmount,
                'subtotal' => (float) $subtotal,
                'total_after_discount' => round($subtotal - $discountAmount, 2),
                'applies_to' => $coupon->scopeLabel(),
            ],
        ]);
    }
}
