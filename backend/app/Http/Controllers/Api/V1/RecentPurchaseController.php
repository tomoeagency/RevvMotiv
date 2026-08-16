<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Support\Facades\Cache;

class RecentPurchaseController extends Controller
{
    public function index()
    {
        $purchases = Cache::remember('recent-purchases', now()->addMinutes(10), function () {
            return Order::with('items')
                ->whereNotIn('order_status', ['cancelled'])
                ->where('payment_status', '!=', 'pending')
                ->latest()
                ->limit(20)
                ->get()
                ->map(fn (Order $order) => [
                    'name' => $this->firstNameWithInitial($order->customer_name),
                    'city' => $this->guessCity($order->shipping_address),
                    // product_title is the order_items snapshot, not a live
                    // relation — survives the product being edited/deleted later.
                    'product' => $order->items->first()?->product_title,
                    'time' => $order->created_at->diffForHumans(),
                ])
                ->values();
        });

        return response()->json(['data' => $purchases]);
    }

    private function firstNameWithInitial(string $fullName): string
    {
        $parts = preg_split('/\s+/', trim($fullName), -1, PREG_SPLIT_NO_EMPTY);

        if (count($parts) < 2) {
            return $parts[0] ?? $fullName;
        }

        return $parts[0].' '.strtoupper(substr(end($parts), 0, 1)).'.';
    }

    // Best-effort only: `orders.shipping_address` is a single free-text
    // field, there's no dedicated city column (see CLAUDE.md orders
    // schema). Returns null rather than guessing wrong when the address
    // doesn't look like it has an identifiable city segment — never
    // fabricate a location for this endpoint.
    private function guessCity(string $address): ?string
    {
        $parts = array_values(array_filter(
            array_map('trim', explode(',', $address)),
            fn ($part) => $part !== '' && ! preg_match('/^\d+$/', $part)
        ));

        if (count($parts) < 2) {
            return null;
        }

        return $parts[count($parts) - 2];
    }
}
