<x-admin.layout title="Order #{{ $order->id }}">
    <div class="mb-4 flex items-center justify-between">
        <a href="{{ route('admin.orders.index') }}" class="inline-block text-sm text-slate-500 hover:text-slate-900">&larr; Back to orders</a>
        <a href="{{ route('admin.orders.edit', $order) }}" class="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200">
            <x-admin.icon name="edit" class="h-3.5 w-3.5" />
            Edit order
        </a>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-6">
            <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 class="mb-3 text-sm font-semibold text-slate-700">Items</h2>
                <table class="min-w-full divide-y divide-slate-100 text-sm">
                    <thead>
                        <tr class="text-left text-slate-500">
                            <th class="py-1.5">Product</th>
                            <th class="py-1.5">Qty</th>
                            <th class="py-1.5">Unit price</th>
                            <th class="py-1.5 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        @foreach ($order->items as $item)
                            <tr>
                                <td class="py-2">
                                    {{ $item->product_title }}
                                    @unless ($item->product)
                                        <span class="text-xs text-slate-400">(product deleted)</span>
                                    @endunless
                                </td>
                                <td class="py-2">{{ $item->quantity }}</td>
                                <td class="py-2">₹{{ number_format((float) $item->unit_price, 2) }}</td>
                                <td class="py-2 text-right">₹{{ number_format((float) $item->subtotal, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>

            <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 class="mb-3 text-sm font-semibold text-slate-700">Shipping address</h2>
                <p class="text-sm text-slate-600">{{ $order->shipping_address ?? '— (pickup / local)' }}</p>
            </div>

            @if ($order->notes)
                <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                    <h2 class="mb-3 text-sm font-semibold text-slate-700">Notes</h2>
                    <p class="whitespace-pre-line text-sm text-slate-600">{{ $order->notes }}</p>
                </div>
            @endif
        </div>

        <div class="space-y-6">
            <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <div class="mb-3 flex items-center justify-between">
                    <h2 class="text-sm font-semibold text-slate-700">Customer</h2>
                    <x-admin.source-badge :source="$order->source" />
                </div>
                <p class="text-sm text-slate-900">{{ $order->customer_name }}</p>
                <p class="text-sm text-slate-500">{{ $order->customer_email ?? '—' }}</p>
                <p class="text-sm text-slate-500">{{ $order->customer_phone }}</p>
            </div>

            <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 class="mb-3 text-sm font-semibold text-slate-700">Payment</h2>
                <dl class="space-y-1.5 text-sm">
                    <div class="flex justify-between"><dt class="text-slate-500">Total</dt><dd>₹{{ number_format((float) $order->total_amount, 2) }}</dd></div>
                    <div class="flex justify-between"><dt class="text-slate-500">Advance ({{ $order->advance_percent_applied }}%)</dt><dd>₹{{ number_format((float) $order->advance_amount, 2) }}</dd></div>
                    <div class="flex justify-between"><dt class="text-slate-500">Remaining (COD)</dt><dd>₹{{ number_format((float) $order->remaining_amount, 2) }}</dd></div>
                    <div class="flex justify-between"><dt class="text-slate-500">Payment status</dt><dd><x-admin.status-badge :status="$order->payment_status" /></dd></div>
                    <div class="flex items-center justify-between"><dt class="text-slate-500">Order status</dt><dd><x-admin.status-badge :status="$order->order_status" /></dd></div>
                    @if ($order->payment_mode)
                        <div class="flex justify-between"><dt class="text-slate-500">Payment mode</dt><dd class="capitalize">{{ str_replace('_', ' ', $order->payment_mode) }}</dd></div>
                    @endif
                    <div class="flex justify-between"><dt class="text-slate-500">Razorpay order</dt><dd class="text-xs text-slate-500">{{ $order->razorpay_order_id ?? '—' }}</dd></div>
                    <div class="flex justify-between"><dt class="text-slate-500">Razorpay payment</dt><dd class="text-xs text-slate-500">{{ $order->razorpay_payment_id ?? '—' }}</dd></div>
                </dl>

                @if ($order->payment_status !== 'fully_paid')
                    <form method="POST" action="{{ route('admin.orders.markFullyPaid', $order) }}" class="mt-4 border-t border-slate-100 pt-4">
                        @csrf
                        @method('PATCH')
                        <button type="submit" class="w-full rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-500">
                            Mark as fully paid
                        </button>
                        <p class="mt-1.5 text-xs text-slate-400">
                            Moves the remaining ₹{{ number_format((float) $order->remaining_amount, 2) }} into the paid amount — use this once the COD/balance is actually collected.
                        </p>
                    </form>
                @endif
            </div>

            <div class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 class="mb-3 text-sm font-semibold text-slate-700">Update order status</h2>
                <form method="POST" action="{{ route('admin.orders.updateStatus', $order) }}" class="flex gap-2">
                    @csrf
                    @method('PATCH')
                    <select name="order_status" class="flex-1 rounded-md border border-slate-300 px-2.5 py-1.5 text-sm capitalize">
                        @foreach (['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as $status)
                            <option value="{{ $status }}" @selected($order->order_status === $status)>{{ ucfirst($status) }}</option>
                        @endforeach
                    </select>
                    <button type="submit" class="rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700">
                        Update
                    </button>
                </form>
                @if ($order->order_status !== 'delivered')
                    <p class="mt-2 text-xs text-slate-400">Only "Delivered" orders count toward gross profit on the dashboard.</p>
                @endif
            </div>
        </div>
    </div>
</x-admin.layout>
