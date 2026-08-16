<?php

namespace App\Services;

use App\Mail\OrderInvoiceMail;
use App\Models\AdminSetting;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Validation\ValidationException;
use Razorpay\Api\Api as RazorpayApi;

class OrderService
{
    /**
     * Core order-creation flow shared by the public storefront checkout and
     * admin-entered manual/offline orders (Instagram/call/WhatsApp sales).
     * Validates stock, resolves any coupon, snapshots cost_price onto each
     * item, and decrements stock — all inside one row-locked transaction so
     * a failure at any point (including the optional Razorpay call) rolls
     * everything back together, and two concurrent orders for the same
     * product can't both oversell it.
     *
     * @param  array{
     *     customer_name: string, customer_email: ?string, customer_phone: string,
     *     shipping_address: ?string, coupon_code: ?string,
     *     items: array<int, array{product_id: int, quantity: int, unit_price?: float}>
     * }  $input  `unit_price` is an admin-only override for negotiated manual-order
     *   deals — the public storefront never sends it, so those items always
     *   price from the DB exactly as before this refactor.
     * @param  array<string, mixed>  $overrides  Order-level column overrides merged
     *   into the Order::create() payload — e.g. source/payment_status/order_status/
     *   payment_mode/notes for a manual order, or [] for the public flow (which
     *   keeps the historical pending/pending + 'website' defaults).
     * @param  bool  $withRazorpay  When true (public storefront only), creates the
     *   Razorpay order for the advance amount inside the same transaction, exactly
     *   as the original inline implementation did. Manual orders never do this —
     *   payment happens outside the platform and is recorded via $overrides instead.
     *
     * @throws ValidationException
     * @throws \Razorpay\Api\Errors\Error
     */
    public function create(array $input, array $overrides = [], bool $withRazorpay = true): Order
    {
        return DB::transaction(function () use ($input, $overrides, $withRazorpay) {
            $productIds = collect($input['items'])->pluck('product_id');

            // Locked for the rest of the transaction — without this, two
            // concurrent orders for the last unit of the same product could
            // both pass the stock check below before either decrements it.
            $products = Product::whereIn('id', $productIds)
                ->where('status', 'active')
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($input['items'] as $item) {
                if (! $products->has($item['product_id'])) {
                    throw ValidationException::withMessages([
                        'items' => ["Product {$item['product_id']} is not available."],
                    ]);
                }

                $product = $products[$item['product_id']];
                if ($product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ["\"{$product->title}\" only has {$product->stock} in stock."],
                    ]);
                }
            }

            $subtotal = collect($input['items'])->sum(
                fn ($item) => ($item['unit_price'] ?? $products[$item['product_id']]->price) * $item['quantity']
            );

            // Coupon is validated and its discount applied to the subtotal
            // BEFORE the advance % split, so the advance is calculated on the
            // post-discount total — same order the checkout total is shown to
            // the customer.
            $coupon = null;
            $discountAmount = 0;

            if (! empty($input['coupon_code'])) {
                $resolved = Coupon::resolveForCart($input['coupon_code'], (float) $subtotal, $input['items'], $products);
                $coupon = $resolved['coupon'];
                $discountAmount = $resolved['discountAmount'];
            }

            $totalAmount = round($subtotal - $discountAmount, 2);

            if ($withRazorpay) {
                // If customer chose full online payment, charge 100% advance (0 COD)
                if (($input['payment_option'] ?? 'advance') === 'full') {
                    $advancePercent = 100;
                } else {
                    // Admin-configurable advance %, per razorpay-advance-payment
                    // skill — never hardcoded, always read live at order-creation time.
                    $advancePercent = (int) AdminSetting::getValue('razorpay_advance_percent', 20);
                }
            } else {
                // Manual orders have no Razorpay advance/COD split concept —
                // there's no "amount actually collected" input on the manual-
                // order form to compute a real partial split from, so the
                // money fields just reflect whether payment_status says the
                // sale was collected in full ('fully_paid' -> 100%) or not
                // (0% — 'pending'/'advance_paid' communicate "not fully
                // settled yet" via the status badge alone, not a fabricated split).
                $advancePercent = ($overrides['payment_status'] ?? null) === 'fully_paid' ? 100 : 0;
            }

            $advanceAmount = round($totalAmount * $advancePercent / 100, 2);
            $remainingAmount = round($totalAmount - $advanceAmount, 2);

            $order = Order::create(array_merge([
                'customer_name' => $input['customer_name'],
                'customer_email' => $input['customer_email'] ?? null,
                'customer_phone' => $input['customer_phone'],
                'shipping_address' => $input['shipping_address'] ?? null,
                'total_amount' => $totalAmount,
                'advance_amount' => $advanceAmount,
                'remaining_amount' => $remainingAmount,
                'advance_percent_applied' => $advancePercent,
                'coupon_id' => $coupon?->id,
                'discount_amount' => $discountAmount,
                'payment_status' => 'pending',
                'order_status' => 'pending',
                'source' => 'website',
            ], $overrides));

            foreach ($input['items'] as $item) {
                $product = $products[$item['product_id']];
                $unitPrice = $item['unit_price'] ?? $product->price;

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_title' => $product->title,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'cost_price_applied' => $product->cost_price,
                    'subtotal' => $unitPrice * $item['quantity'],
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            if ($coupon) {
                // Atomic, limit-checked increment — a plain ->increment()
                // has a race window between the pre-transaction validity
                // check and this write, where two concurrent checkouts
                // could both slip in under a usage_limit. This re-checks
                // the limit as part of the same UPDATE.
                if ($coupon->usage_limit !== null) {
                    $rows = Coupon::where('id', $coupon->id)
                        ->where('times_used', '<', $coupon->usage_limit)
                        ->increment('times_used');

                    if ($rows === 0) {
                        throw ValidationException::withMessages([
                            'coupon_code' => ['This coupon just reached its usage limit. Please remove it and try again.'],
                        ]);
                    }
                } else {
                    $coupon->increment('times_used');
                }
            }

            if ($withRazorpay) {
                // Razorpay order is created for the advance amount only —
                // the remainder is COD, per the advance/COD split.
                $razorpay = new RazorpayApi(
                    config('services.razorpay.key_id'),
                    config('services.razorpay.key_secret')
                );

                $razorpayOrder = $razorpay->order->create([
                    'receipt' => 'order_'.$order->id,
                    'amount' => (int) round($advanceAmount * 100), // paise
                    'currency' => 'INR',
                    'notes' => ['local_order_id' => (string) $order->id],
                ]);

                $order->update(['razorpay_order_id' => $razorpayOrder['id']]);
            }

            return $order;
        });
    }

    /**
     * Sends the order confirmation tax invoice email to the customer.
     * Includes a robust fallback: if SMTP is set to log, missing, or fails,
     * it writes the full invoice to laravel.log and never interrupts the order flow.
     */
    public function sendInvoiceEmail(Order $order): bool
    {
        if (empty($order->customer_email)) {
            Log::info("Order #{$order->id} has no customer email; skipping invoice email.");
            return false;
        }

        try {
            Mail::to($order->customer_email)->send(new OrderInvoiceMail($order));
            Log::info("Order #{$order->id} confirmation invoice dispatched to {$order->customer_email}");
            return true;
        } catch (\Throwable $e) {
            Log::warning("Failed to dispatch SMTP invoice for Order #{$order->id}: {$e->getMessage()}. Fallback logged.");
            return false;
        }
    }
}
