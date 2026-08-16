<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreManualOrderRequest;
use App\Http\Requests\Admin\UpdateOrderRequest;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Illuminate\View\View;
use Throwable;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    public function index(Request $request): View
    {
        $orders = Order::query()
            ->when($request->filled('status'), fn ($q) => $q->where('order_status', $request->string('status')))
            ->when($request->filled('payment_status'), fn ($q) => $q->where('payment_status', $request->string('payment_status')))
            ->when($request->filled('source'), fn ($q) => $q->where('source', $request->string('source')))
            ->when($request->filled('search'), function ($q) use ($request) {
                $term = '%'.$request->string('search').'%';
                $q->where(fn ($q2) => $q2->where('customer_name', 'like', $term)
                    ->orWhere('customer_email', 'like', $term)
                    ->orWhere('customer_phone', 'like', $term));
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return view('admin.orders.index', compact('orders'));
    }

    public function show(Order $order): View
    {
        $order->load('items.product');

        return view('admin.orders.show', compact('order'));
    }

    // Manual/offline order entry — a sale made outside the platform
    // (Instagram DM, phone call, WhatsApp) that the admin is recording
    // after the fact.
    public function create(): View
    {
        // Active products only, with their current stock — the same set a
        // real checkout could actually buy from. Categories tag along so
        // the picker can group/filter without an extra request.
        $products = Product::where('status', 'active')
            ->orderBy('title')
            ->get(['id', 'title', 'price', 'stock', 'category_id']);

        $categories = Category::orderBy('name')->get(['id', 'name']);

        return view('admin.orders.create', compact('products', 'categories'));
    }

    public function store(StoreManualOrderRequest $request): RedirectResponse
    {
        try {
            $order = $this->orderService->create(
                $request->toOrderInput(),
                $request->toOrderOverrides(),
                withRazorpay: false
            );
        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            Log::error('Manual order creation failed', ['error' => $e->getMessage()]);

            return back()->withInput()->withErrors([
                'items' => 'Could not create the order. Please try again.',
            ]);
        }

        return redirect()->route('admin.orders.show', $order)
            ->with('status', "Order #{$order->id} created.");
    }

    // No enforced pipeline order (e.g. pending -> confirmed -> shipped ->
    // delivered) — an admin correcting a mistake (a "delivered" order that
    // actually needs to be cancelled/refunded) is a real, ordinary case for
    // a small team, so any status can move to any other. Note: marking an
    // order 'delivered' is what makes it count toward the dashboard's gross
    // -profit figure (see DashboardController) — that's intentional, not a
    // side effect to guard against.
    public function updateStatus(Request $request, Order $order): RedirectResponse
    {
        $validated = $request->validate([
            'order_status' => ['required', 'string', 'in:pending,confirmed,shipped,delivered,cancelled'],
        ]);

        $order->update(['order_status' => $validated['order_status']]);

        return redirect()->route('admin.orders.show', $order)
            ->with('status', "Order #{$order->id} marked as ".str_replace('_', ' ', $validated['order_status']).'.');
    }

    // The common case for a partially-paid manual order: the COD/remaining
    // balance was just collected. Shifts remaining_amount into
    // advance_amount rather than blindly setting advance_amount =
    // total_amount — safe for real Razorpay-originated orders too (where
    // advance_amount is a real, already-verified figure this must not
    // overwrite), since advance + remaining always equals total already.
    public function markFullyPaid(Order $order): RedirectResponse
    {
        $order->update([
            'payment_status' => 'fully_paid',
            'advance_amount' => (float) $order->advance_amount + (float) $order->remaining_amount,
            'remaining_amount' => 0,
        ]);

        return redirect()->route('admin.orders.show', $order)
            ->with('status', "Order #{$order->id} marked as fully paid.");
    }

    // Customer/fulfillment details only — never line items, see
    // UpdateOrderRequest for why.
    public function edit(Order $order): View
    {
        $order->load('items.product');

        return view('admin.orders.edit', compact('order'));
    }

    public function update(UpdateOrderRequest $request, Order $order): RedirectResponse
    {
        $validated = $request->validated();

        $wasFullyPaid = $order->payment_status === 'fully_paid';
        $becomingFullyPaid = $validated['payment_status'] === 'fully_paid';

        $order->fill([
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'] ?? null,
            'shipping_address' => $validated['customer_address'] ?? null,
            'source' => $validated['source'],
            'payment_mode' => $validated['payment_mode'] ?? null,
            'payment_status' => $validated['payment_status'],
            'order_status' => $validated['order_status'],
            'notes' => $validated['notes'] ?? null,
        ]);

        // Same amount-consistency rule as markFullyPaid() — only applied on
        // the actual transition into fully_paid, so editing an
        // already-fully-paid order (e.g. just fixing a typo'd phone number)
        // never touches the amounts a second time.
        if ($becomingFullyPaid && ! $wasFullyPaid) {
            $order->advance_amount = (float) $order->advance_amount + (float) $order->remaining_amount;
            $order->remaining_amount = 0;
        }

        $order->save();

        return redirect()->route('admin.orders.show', $order)
            ->with('status', "Order #{$order->id} updated.");
    }
}
