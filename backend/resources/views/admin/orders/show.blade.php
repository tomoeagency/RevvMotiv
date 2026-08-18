<x-admin.layout title="Order #{{ $order->id }}">
    <!-- Top Action Bar -->
    <div class="mb-6 flex items-center justify-between">
        <a href="{{ route('admin.orders.index') }}" class="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Orders</span>
        </a>

        <div class="flex items-center gap-3">
            <a href="{{ route('admin.orders.edit', $order) }}" 
               class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
                <x-admin.icon name="edit" class="h-3.5 w-3.5" />
                <span>Edit Order</span>
            </a>
        </div>
    </div>

    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <!-- Left Column: Order Items & Delivery Information -->
        <div class="lg:col-span-2 space-y-6">
            <!-- Ordered Products Table Card -->
            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center justify-between">
                    <span>Order Items</span>
                    <span class="text-xs font-normal text-slate-400">{{ $order->items->count() }} item{{ $order->items->count() === 1 ? '' : 's' }}</span>
                </h2>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-slate-100 text-xs">
                        <thead>
                            <tr class="text-left text-slate-500 font-bold uppercase tracking-wider">
                                <th class="pb-2.5">Product Title</th>
                                <th class="pb-2.5 text-center">Qty</th>
                                <th class="pb-2.5 text-right">Unit Price</th>
                                <th class="pb-2.5 text-right">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-slate-100">
                            @foreach ($order->items as $item)
                                <tr class="text-slate-800 font-medium">
                                    <td class="py-3">
                                        <span class="font-bold text-slate-900 block">{{ $item->product_title }}</span>
                                        @unless ($item->product)
                                            <span class="text-[10px] text-slate-400">(archived product)</span>
                                        @endunless
                                    </td>
                                    <td class="py-3 text-center font-mono font-bold">{{ $item->quantity }}</td>
                                    <td class="py-3 text-right font-mono tabular-nums">₹{{ number_format((float) $item->unit_price, 2) }}</td>
                                    <td class="py-3 text-right font-mono font-bold text-slate-900 tabular-nums">₹{{ number_format((float) $item->subtotal, 2) }}</td>
                                </tr>
                            @endforeach
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Delivery & Shipping Address Card -->
            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-2">
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                    Shipping & Delivery Address
                </h2>
                <p class="text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">
                    {{ $order->shipping_address ?? '— (Store pickup / Local fitment)' }}
                </p>
            </div>

            @if ($order->notes)
                <!-- Order Notes Card -->
                <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-2">
                    <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                        Internal Notes / Special Instructions
                    </h2>
                    <p class="whitespace-pre-line text-xs sm:text-sm text-slate-700 leading-relaxed pt-1">{{ $order->notes }}</p>
                </div>
            @endif
        </div>

        <!-- Right Column: Customer Details, Payment, & Status Transitions -->
        <div class="space-y-6">
            <!-- Customer Card -->
            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
                <div class="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Customer</h2>
                    <x-admin.source-badge :source="$order->source" />
                </div>
                <div class="space-y-1 text-xs">
                    <p class="font-bold text-slate-900 text-sm">{{ $order->customer_name }}</p>
                    <p class="text-slate-500 font-mono">{{ $order->customer_email ?? 'No email provided' }}</p>
                    <p class="text-slate-700 font-semibold font-mono">{{ $order->customer_phone }}</p>
                </div>
            </div>

            <!-- Financial Payment Summary Card -->
            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                    Payment Ledger
                </h2>

                <dl class="space-y-2 text-xs">
                    <div class="flex justify-between items-center py-1">
                        <dt class="text-slate-500 font-medium">Order Total</dt>
                        <dd class="font-bold font-mono text-slate-900 text-sm tabular-nums">₹{{ number_format((float) $order->total_amount, 2) }}</dd>
                    </div>
                    <div class="flex justify-between items-center py-1 border-t border-slate-50">
                        <dt class="text-slate-500 font-medium">Advance Paid ({{ $order->advance_percent_applied }}%)</dt>
                        <dd class="font-bold font-mono text-emerald-700 tabular-nums">₹{{ number_format((float) $order->advance_amount, 2) }}</dd>
                    </div>
                    <div class="flex justify-between items-center py-1 border-t border-slate-50">
                        <dt class="text-slate-500 font-medium">Remaining COD Balance</dt>
                        <dd class="font-bold font-mono text-amber-700 tabular-nums">₹{{ number_format((float) $order->remaining_amount, 2) }}</dd>
                    </div>
                    <div class="flex justify-between items-center py-1 border-t border-slate-50">
                        <dt class="text-slate-500 font-medium">Payment Status</dt>
                        <dd><x-admin.status-badge :status="$order->payment_status" /></dd>
                    </div>
                    <div class="flex items-center justify-between py-1 border-t border-slate-50">
                        <dt class="text-slate-500 font-medium">Fulfillment Status</dt>
                        <dd><x-admin.status-badge :status="$order->order_status" /></dd>
                    </div>
                    @if ($order->payment_mode)
                        <div class="flex justify-between items-center py-1 border-t border-slate-50">
                            <dt class="text-slate-500 font-medium">Payment Mode</dt>
                            <dd class="capitalize font-semibold text-slate-800">{{ str_replace('_', ' ', $order->payment_mode) }}</dd>
                        </div>
                    @endif
                    @if ($order->razorpay_order_id)
                        <div class="flex justify-between items-center py-1 border-t border-slate-50">
                            <dt class="text-slate-500 font-medium">Razorpay Order</dt>
                            <dd class="font-mono text-[11px] text-slate-600">{{ $order->razorpay_order_id }}</dd>
                        </div>
                    @endif
                    @if ($order->razorpay_payment_id)
                        <div class="flex justify-between items-center py-1 border-t border-slate-50">
                            <dt class="text-slate-500 font-medium">Razorpay Payment</dt>
                            <dd class="font-mono text-[11px] text-slate-600">{{ $order->razorpay_payment_id }}</dd>
                        </div>
                    @endif
                </dl>

                @if ($order->payment_status !== 'fully_paid')
                    <form method="POST" action="{{ route('admin.orders.markFullyPaid', $order) }}" class="mt-4 border-t border-slate-100 pt-4">
                        @csrf
                        @method('PATCH')
                        <button type="submit" class="w-full inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-all cursor-pointer">
                            Mark Remaining Balance as Paid
                        </button>
                        <p class="mt-2 text-[11px] text-slate-400 text-center">
                            Transfers remaining ₹{{ number_format((float) $order->remaining_amount, 2) }} into collected funds.
                        </p>
                    </form>
                @endif
            </div>

            <!-- Fulfillment Status Transition Form -->
            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                    Update Fulfillment Status
                </h2>

                <form method="POST" action="{{ route('admin.orders.updateStatus', $order) }}" class="flex gap-2">
                    @csrf
                    @method('PATCH')
                    <select name="order_status" class="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold capitalize text-slate-800 shadow-2xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                        @foreach (['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as $status)
                            <option value="{{ $status }}" @selected($order->order_status === $status)>{{ ucfirst($status) }}</option>
                        @endforeach
                    </select>
                    <button type="submit" class="inline-flex items-center justify-center rounded-lg bg-[#1e3a5f] px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#16304d] transition-all cursor-pointer">
                        Update
                    </button>
                </form>
                @if ($order->order_status !== 'delivered')
                    <p class="text-[11px] text-slate-400">Only "Delivered" orders count toward gross profit on the operations dashboard.</p>
                @endif
            </div>
        </div>
    </div>
</x-admin.layout>
