<x-admin.layout title="Orders">
    <!-- Header Controls & Filters -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <!-- Search & Filter Controls -->
        <form method="GET" class="flex flex-wrap items-center gap-2.5">
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Search customer, email, phone..."
                   class="rounded-lg border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 shadow-2xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20 w-56">

            <select name="status" class="rounded-lg border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                <option value="">All order statuses</option>
                @foreach (['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as $status)
                    <option value="{{ $status }}" @selected(request('status') === $status)>{{ ucfirst($status) }}</option>
                @endforeach
            </select>

            <select name="payment_status" class="rounded-lg border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                <option value="">All payment statuses</option>
                @foreach (['pending', 'advance_paid', 'fully_paid', 'failed', 'refunded'] as $status)
                    <option value="{{ $status }}" @selected(request('payment_status') === $status)>{{ ucfirst(str_replace('_', ' ', $status)) }}</option>
                @endforeach
            </select>

            <select name="source" class="rounded-lg border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 shadow-2xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                <option value="">All sources</option>
                @foreach (['website', 'instagram', 'call', 'whatsapp', 'other'] as $source)
                    <option value="{{ $source }}" @selected(request('source') === $source)>{{ ucfirst($source) }}</option>
                @endforeach
            </select>

            <button type="submit" class="inline-flex items-center justify-center rounded-lg bg-[#1e3a5f] px-4 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-[#16304d] transition-all cursor-pointer">
                Filter
            </button>
        </form>

        <!-- Right Side: Create Manual Order -->
        <a href="{{ route('admin.orders.create') }}" class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1e3a5f] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>+ New Manual Order</span>
        </a>
    </div>

    <!-- Orders Data Table -->
    <x-admin.data-table :headers="['Order ID', 'Customer Details', 'Channel', 'Total', 'Advance / Remaining', 'Payment', 'Status', 'Placed Date', '']" :paginator="$orders">
        @foreach ($orders as $order)
            <tr class="hover:bg-slate-50/70 transition-colors">
                <!-- Order ID -->
                <td class="px-4 py-3 font-mono text-xs font-bold text-slate-900">
                    <span class="rounded bg-slate-100 px-2 py-0.5 border border-slate-200">#{{ $order->id }}</span>
                </td>

                <!-- Customer Details -->
                <td class="px-4 py-3">
                    <span class="font-bold text-slate-900 block text-xs">{{ $order->customer_name }}</span>
                    <span class="text-[11px] text-slate-500 font-mono">{{ $order->customer_email ?? $order->customer_phone }}</span>
                </td>

                <!-- Channel Source -->
                <td class="px-4 py-3">
                    <x-admin.source-badge :source="$order->source" />
                </td>

                <!-- Total Amount -->
                <td class="px-4 py-3 font-bold font-mono text-slate-900 tabular-nums text-xs">
                    ₹{{ number_format((float) $order->total_amount, 2) }}
                </td>

                <!-- Advance / Remaining Breakdown -->
                <td class="px-4 py-3 text-xs font-mono tabular-nums">
                    <span class="text-emerald-700 font-semibold">₹{{ number_format((float) $order->advance_amount, 2) }}</span>
                    <span class="text-slate-400">/</span>
                    <span class="text-amber-700 font-semibold">₹{{ number_format((float) $order->remaining_amount, 2) }}</span>
                </td>

                <!-- Payment Status -->
                <td class="px-4 py-3">
                    <x-admin.status-badge :status="$order->payment_status" />
                </td>

                <!-- Order Fulfillment Status -->
                <td class="px-4 py-3">
                    <x-admin.status-badge :status="$order->order_status" />
                </td>

                <!-- Date Placed -->
                <td class="px-4 py-3 text-xs text-slate-500 font-medium whitespace-nowrap">
                    {{ $order->created_at->timezone('Asia/Kolkata')->format('d M Y, H:i') }}
                </td>

                <!-- Action Links -->
                <td class="px-4 py-3 text-right">
                    <a href="{{ route('admin.orders.show', $order) }}" 
                       class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs">
                        View Details
                    </a>
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
