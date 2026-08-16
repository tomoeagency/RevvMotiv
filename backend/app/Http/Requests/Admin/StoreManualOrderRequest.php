<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

// Shared by both the JSON admin endpoint (POST /api/v1/admin/orders/manual,
// Sanctum-gated) and the Blade admin panel's "Create manual order" form
// (session-gated) — the route middleware on each side already restricts
// access to admins, so there's nothing extra to check here.
class StoreManualOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:20'],
            // Optional — pickup/local sales don't need a shipping address.
            'customer_address' => ['nullable', 'string', 'max:1000'],
            'coupon_code' => ['nullable', 'string', 'max:50'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1', 'max:99'],
            // Admin override for negotiated deals — optional per item; falls
            // back to the product's catalog price in OrderService when omitted.
            'items.*.price_at_order' => ['nullable', 'numeric', 'min:0'],

            'source' => ['required', 'string', 'in:instagram,call,whatsapp,other'],
            'payment_status' => ['required', 'string', 'in:paid,unpaid,partial'],
            'payment_mode' => ['required', 'string', 'in:cod,upi,cash,bank_transfer'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /** Shapes the validated request into OrderService::create()'s $input array. */
    public function toOrderInput(): array
    {
        $validated = $this->validated();

        return [
            'customer_name' => $validated['customer_name'],
            'customer_email' => null, // not collected for manual orders
            'customer_phone' => $validated['customer_phone'],
            'shipping_address' => $validated['customer_address'] ?? null,
            'coupon_code' => $validated['coupon_code'] ?? null,
            'items' => collect($validated['items'])->map(fn ($item) => [
                'product_id' => $item['product_id'],
                'quantity' => $item['quantity'],
                'unit_price' => isset($item['price_at_order']) ? (float) $item['price_at_order'] : null,
            ])->all(),
        ];
    }

    /** Shapes the validated request into OrderService::create()'s $overrides array. */
    public function toOrderOverrides(): array
    {
        $validated = $this->validated();

        // The admin-facing paid/unpaid/partial vocabulary maps onto the
        // existing payment_status enum rather than extending it — 'partial'
        // reuses 'advance_paid', matching the meaning that value already
        // carries for Razorpay-driven orders (some money in, more expected).
        $paymentStatus = match ($validated['payment_status']) {
            'paid' => 'fully_paid',
            'partial' => 'advance_paid',
            default => 'pending',
        };

        return [
            'source' => $validated['source'],
            'payment_status' => $paymentStatus,
            // The dashboard's gross-profit figure only counts `delivered`
            // orders (the strongest signal a sale is real and won't be
            // reversed — see DashboardController). A manual order marked
            // fully paid is that same strong signal for an offline sale, so
            // it's set straight to 'delivered' rather than sitting in
            // 'confirmed' with no admin UI currently able to advance it.
            // Unpaid/partial orders stay at 'confirmed' — still in progress.
            'order_status' => $paymentStatus === 'fully_paid' ? 'delivered' : 'confirmed',
            'payment_mode' => $validated['payment_mode'],
            'notes' => $validated['notes'] ?? null,
        ];
    }
}
