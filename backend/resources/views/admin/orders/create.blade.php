<x-admin.layout title="New Manual Order">
    <a href="{{ route('admin.orders.index') }}" class="mb-4 inline-block text-sm text-slate-500 hover:text-slate-900">&larr; Back to orders</a>

    <p class="mb-6 max-w-2xl text-sm text-slate-500">
        Record a sale made outside the website — an Instagram DM, a phone call, a WhatsApp order. Stock is
        checked and deducted exactly like a real checkout; payment is just recorded as given, since it
        already happened (or is being followed up on) outside the platform.
    </p>

    @error('items')
        <div class="mb-6 max-w-2xl rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {{ $message }}
        </div>
    @enderror

    <form method="POST" action="{{ route('admin.orders.store') }}" class="max-w-3xl space-y-1" id="manual-order-form">
        @csrf

        <div class="grid grid-cols-2 gap-4">
            <x-admin.form-field name="customer_name" label="Customer name" required>
                <input type="text" name="customer_name" id="customer_name" value="{{ old('customer_name') }}" required
                       class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
            </x-admin.form-field>

            <x-admin.form-field name="customer_phone" label="Phone" required>
                <input type="text" name="customer_phone" id="customer_phone" value="{{ old('customer_phone') }}" required
                       class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
            </x-admin.form-field>
        </div>

        <x-admin.form-field name="customer_address" label="Address" hint="Optional — leave blank for pickup / local delivery.">
            <textarea name="customer_address" id="customer_address" rows="2"
                      class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">{{ old('customer_address') }}</textarea>
        </x-admin.form-field>

        <div class="mb-4 mt-4">
            <label class="mb-1 block text-sm font-medium text-slate-700">Items <span class="text-red-500">*</span></label>
            <div class="overflow-hidden rounded-md border border-slate-200">
                <table class="min-w-full divide-y divide-slate-200 text-sm">
                    <thead class="bg-slate-50">
                        <tr class="text-left text-xs font-medium uppercase tracking-wide text-slate-500">
                            <th class="px-3 py-2">Product</th>
                            <th class="px-3 py-2">In stock</th>
                            <th class="px-3 py-2 w-24">Qty</th>
                            <th class="px-3 py-2 w-32">Price (₹)</th>
                            <th class="px-3 py-2 w-32 text-right">Subtotal</th>
                            <th class="px-3 py-2 w-10"></th>
                        </tr>
                    </thead>
                    <tbody id="item-rows" class="divide-y divide-slate-100 bg-white"></tbody>
                </table>
            </div>
            <button type="button" id="add-item-row" class="mt-2 inline-flex items-center gap-1 rounded-md bg-slate-200 px-3 py-1.5 text-sm hover:bg-slate-300">
                <x-admin.icon name="plus" class="h-3.5 w-3.5" /> Add item
            </button>
            <p class="mt-2 text-sm text-slate-600">Order total: <span id="order-total" class="font-semibold tabular-nums">₹0.00</span></p>
        </div>

        <div class="grid grid-cols-3 gap-4">
            <x-admin.form-field name="source" label="Source" required>
                <select name="source" id="source" required
                        class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                    <option value="">Select a source</option>
                    @foreach (['instagram' => 'Instagram', 'call' => 'Call', 'whatsapp' => 'WhatsApp', 'other' => 'Other'] as $value => $label)
                        <option value="{{ $value }}" @selected(old('source') === $value)>{{ $label }}</option>
                    @endforeach
                </select>
            </x-admin.form-field>

            <x-admin.form-field name="payment_status" label="Payment status" required>
                <select name="payment_status" id="payment_status" required
                        class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                    <option value="">Select a status</option>
                    @foreach (['paid' => 'Paid in full', 'partial' => 'Partially paid', 'unpaid' => 'Unpaid'] as $value => $label)
                        <option value="{{ $value }}" @selected(old('payment_status') === $value)>{{ $label }}</option>
                    @endforeach
                </select>
            </x-admin.form-field>

            <x-admin.form-field name="payment_mode" label="Payment mode" required>
                <select name="payment_mode" id="payment_mode" required
                        class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                    <option value="">Select a mode</option>
                    @foreach (['cod' => 'Cash on delivery', 'upi' => 'UPI', 'cash' => 'Cash', 'bank_transfer' => 'Bank transfer'] as $value => $label)
                        <option value="{{ $value }}" @selected(old('payment_mode') === $value)>{{ $label }}</option>
                    @endforeach
                </select>
            </x-admin.form-field>
        </div>

        <x-admin.form-field name="notes" label="Notes" hint="Optional — internal only, e.g. what was agreed over DM/call.">
            <textarea name="notes" id="notes" rows="3"
                      class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">{{ old('notes') }}</textarea>
        </x-admin.form-field>

        <div class="flex gap-3 pt-2">
            <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
                Create order
            </button>
            <a href="{{ route('admin.orders.index') }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
        </div>
    </form>

    @php
        // Active products with live stock, for the client-side item picker —
        // the same catalog a real checkout could buy from. Small catalog
        // (product count is in the tens), so shipping it inline avoids a
        // separate search endpoint for what's currently a simple picker.
        $productOptions = $products->map(fn ($p) => [
            'id' => $p->id,
            'title' => $p->title,
            'price' => (float) $p->price,
            'stock' => $p->stock,
        ]);
        $oldItems = old('items', []);
    @endphp
    <script>
        window.__manualOrderProducts = @json($productOptions);
        window.__manualOrderOldItems = @json($oldItems);
    </script>
</x-admin.layout>
