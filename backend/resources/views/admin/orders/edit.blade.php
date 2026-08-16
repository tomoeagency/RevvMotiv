<x-admin.layout title="Edit Order #{{ $order->id }}">
    <a href="{{ route('admin.orders.show', $order) }}" class="mb-4 inline-block text-sm text-slate-500 hover:text-slate-900">&larr; Back to order</a>

    <p class="mb-6 max-w-2xl text-sm text-slate-500">
        Customer, source, and payment/status details only — line items can't be edited here. If the products
        or quantities on this order are wrong, cancel it (Order status &rarr; Cancelled) and record a new
        manual order with the correct items instead, so stock stays accurate.
    </p>

    @error('customer_name')
        <div class="mb-6 max-w-2xl rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {{ $message }}
        </div>
    @enderror

    <form method="POST" action="{{ route('admin.orders.update', $order) }}" class="max-w-3xl space-y-1">
        @csrf
        @method('PUT')

        <div class="grid grid-cols-2 gap-4">
            <x-admin.form-field name="customer_name" label="Customer name" required>
                <input type="text" name="customer_name" id="customer_name" value="{{ old('customer_name', $order->customer_name) }}" required
                       class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
            </x-admin.form-field>

            <x-admin.form-field name="customer_phone" label="Phone" required>
                <input type="text" name="customer_phone" id="customer_phone" value="{{ old('customer_phone', $order->customer_phone) }}" required
                       class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
            </x-admin.form-field>
        </div>

        <div class="grid grid-cols-2 gap-4">
            <x-admin.form-field name="customer_email" label="Email" hint="Optional.">
                <input type="email" name="customer_email" id="customer_email" value="{{ old('customer_email', $order->customer_email) }}"
                       class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
            </x-admin.form-field>

            <x-admin.form-field name="source" label="Source" required>
                <select name="source" id="source" required
                        class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                    @foreach (['website' => 'Website', 'instagram' => 'Instagram', 'call' => 'Call', 'whatsapp' => 'WhatsApp', 'other' => 'Other'] as $value => $label)
                        <option value="{{ $value }}" @selected(old('source', $order->source) === $value)>{{ $label }}</option>
                    @endforeach
                </select>
            </x-admin.form-field>
        </div>

        <x-admin.form-field name="customer_address" label="Address" hint="Optional — blank for pickup / local delivery.">
            <textarea name="customer_address" id="customer_address" rows="2"
                      class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">{{ old('customer_address', $order->shipping_address) }}</textarea>
        </x-admin.form-field>

        <div class="mt-4 mb-4">
            <label class="mb-1 block text-sm font-medium text-slate-700">Items (read-only)</label>
            <div class="overflow-hidden rounded-md border border-slate-200">
                <table class="min-w-full divide-y divide-slate-200 text-sm">
                    <thead class="bg-slate-50">
                        <tr class="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                            <th class="px-3 py-2">Product</th>
                            <th class="px-3 py-2">Qty</th>
                            <th class="px-3 py-2 text-right">Unit price</th>
                            <th class="px-3 py-2 text-right">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100 bg-white">
                        @foreach ($order->items as $item)
                            <tr>
                                <td class="px-3 py-2">{{ $item->product_title }}</td>
                                <td class="px-3 py-2">{{ $item->quantity }}</td>
                                <td class="px-3 py-2 text-right">₹{{ number_format((float) $item->unit_price, 2) }}</td>
                                <td class="px-3 py-2 text-right">₹{{ number_format((float) $item->subtotal, 2) }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>

        <div class="grid grid-cols-3 gap-4">
            <x-admin.form-field name="order_status" label="Order status" required>
                <select name="order_status" id="order_status" required
                        class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                    @foreach (['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as $value)
                        <option value="{{ $value }}" @selected(old('order_status', $order->order_status) === $value)>{{ ucfirst($value) }}</option>
                    @endforeach
                </select>
            </x-admin.form-field>

            <x-admin.form-field name="payment_status" label="Payment status" required
                hint="Setting this to 'Fully paid' moves any remaining balance into the paid amount automatically.">
                <select name="payment_status" id="payment_status" required
                        class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                    @foreach (['pending' => 'Pending', 'advance_paid' => 'Advance paid (partial)', 'fully_paid' => 'Fully paid', 'failed' => 'Failed', 'refunded' => 'Refunded'] as $value => $label)
                        <option value="{{ $value }}" @selected(old('payment_status', $order->payment_status) === $value)>{{ $label }}</option>
                    @endforeach
                </select>
            </x-admin.form-field>

            <x-admin.form-field name="payment_mode" label="Payment mode" hint="Optional — blank for website/Razorpay orders.">
                <select name="payment_mode" id="payment_mode"
                        class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                    <option value="" @selected(old('payment_mode', $order->payment_mode) === null)>&mdash;</option>
                    @foreach (['cod' => 'Cash on delivery', 'upi' => 'UPI', 'cash' => 'Cash', 'bank_transfer' => 'Bank transfer'] as $value => $label)
                        <option value="{{ $value }}" @selected(old('payment_mode', $order->payment_mode) === $value)>{{ $label }}</option>
                    @endforeach
                </select>
            </x-admin.form-field>
        </div>

        <x-admin.form-field name="notes" label="Notes" hint="Internal only.">
            <textarea name="notes" id="notes" rows="3"
                      class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">{{ old('notes', $order->notes) }}</textarea>
        </x-admin.form-field>

        <div class="flex gap-3 pt-2">
            <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
                Save changes
            </button>
            <a href="{{ route('admin.orders.show', $order) }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
        </div>
    </form>
</x-admin.layout>
