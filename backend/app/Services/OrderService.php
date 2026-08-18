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
     * Validates stock, resolves any coupon, snapshots cost_price onto each item.
     *
     * IMPORTANT: For online website checkouts ($withRazorpay = true), stock is NOT
     * decremented immediately so that abandoned or cancelled payment attempts
     * do NOT disturb warehouse inventory. Stock is decremented once payment is
     * confirmed via webhook/gateway confirmation.
     * For manual admin sales ($withRazorpay = false), stock is decremented immediately.
     */
    public function create(array $input, array $overrides = [], bool $withRazorpay = true): Order
    {
        return DB::transaction(function () use ($input, $overrides, $withRazorpay) {
            $productIds = collect($input['items'])->pluck('product_id');

            // Locked for the rest of the transaction
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
                fn ($item) => ($item['admin_unit_price'] ?? $item['unit_price'] ?? $products[$item['product_id']]->price) * $item['quantity']
            );

            // Coupon is validated and discount applied
            $coupon = null;
            $discountAmount = 0;

            if (! empty($input['coupon_code'])) {
                $resolved = Coupon::resolveForCart($input['coupon_code'], (float) $subtotal, $input['items'], $products);
                $coupon = $resolved['coupon'];
                $discountAmount = $resolved['discountAmount'];
            }

            $totalAmount = round($subtotal - $discountAmount, 2);

            if ($withRazorpay) {
                if (($input['payment_option'] ?? 'advance') === 'full') {
                    $advancePercent = 100;
                } else {
                    $advancePercent = (int) AdminSetting::getValue('razorpay_advance_percent', 20);
                }
            } else {
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
                // Authoritative price: customer requests cannot override price; admin_unit_price allowed for manual orders
                $unitPrice = $item['admin_unit_price'] ?? $item['unit_price'] ?? $product->price;

                $order->items()->create([
                    'product_id' => $product->id,
                    'product_title' => $product->title,
                    'quantity' => $item['quantity'],
                    'unit_price' => $unitPrice,
                    'cost_price_applied' => $product->cost_price,
                    'subtotal' => $unitPrice * $item['quantity'],
                ]);

                // Only decrement stock immediately for manual admin offline sales
                if (! $withRazorpay) {
                    $product->decrement('stock', $item['quantity']);
                }
            }

            if ($coupon) {
                // Reserve coupon usage slot at order creation time
                $coupon->increment('times_used');
            }

            if ($withRazorpay) {
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
     * Called when Razorpay captures payment (webhook or checkout verification).
     * Authoritatively decrements product stock and transitions status to confirmed.
     */
    public function confirmPayment(Order $order, string $paymentId): void
    {
        DB::transaction(function () use ($order, $paymentId) {
            $paymentStatus = $order->advance_percent_applied >= 100 ? 'fully_paid' : 'advance_paid';

            // Decrement stock only once upon confirmed payment using lockForUpdate to avoid race conditions
            if (in_array($order->payment_status, ['pending', 'failed'], true)) {
                $itemProductIds = $order->items->pluck('product_id')->unique();
                $lockedProducts = Product::whereIn('id', $itemProductIds)
                    ->lockForUpdate()
                    ->get()
                    ->keyBy('id');

                foreach ($order->items as $item) {
                    if ($lockedProducts->has($item->product_id)) {
                        $lockedProducts[$item->product_id]->decrement('stock', $item->quantity);
                    }
                }
            }

            $order->update([
                'razorpay_payment_id' => $paymentId,
                'payment_status' => $paymentStatus,
                'order_status' => 'confirmed',
            ]);
        });

        $this->sendInvoiceEmail($order);
    }

    /**
     * Sends the order confirmation tax invoice email to the customer.
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
