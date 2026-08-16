<x-admin.layout title="Orders">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-3">
        <form method="GET" class="flex flex-wrap gap-2">
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Search name, email, phone..."
                   class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
            <select name="status" class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                <option value="">All order statuses</option>
                @foreach (['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as $status)
                    <option value="{{ $status }}" @selected(request('status') === $status)>{{ ucfirst($status) }}</option>
                @endforeach
            </select>
            <select name="payment_status" class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                <option value="">All payment statuses</option>
                @foreach (['pending', 'advance_paid', 'fully_paid', 'failed', 'refunded'] as $status)
                    <option value="{{ $status }}" @selected(request('payment_status') === $status)>{{ ucfirst(str_replace('_', ' ', $status)) }}</option>
                @endforeach
            </select>
            <select name="source" class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                <option value="">All sources</option>
                @foreach (['website', 'instagram', 'call', 'whatsapp', 'other'] as $source)
                    <option value="{{ $source }}" @selected(request('source') === $source)>{{ ucfirst($source) }}</option>
                @endforeach
            </select>
            <button type="submit" class="rounded-md bg-slate-200 px-3 py-1.5 text-sm hover:bg-slate-300">Filter</button>
        </form>
        <a href="{{ route('admin.orders.create') }}" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            + New manual order
        </a>
    </div>

    <x-admin.data-table :headers="['Order', 'Customer', 'Source', 'Total', 'Advance / Remaining', 'Payment', 'Order Status', 'Placed', '']" :paginator="$orders">
        @foreach ($orders as $order)
            <tr>
                <td class="px-4 py-2.5 font-medium text-slate-900">#{{ $order->id }}</td>
                <td class="px-4 py-2.5 text-slate-600">
                    {{ $order->customer_name }}
                    <div class="text-xs text-slate-400">{{ $order->customer_email ?? $order->customer_phone }}</div>
                </td>
                <td class="px-4 py-2.5"><x-admin.source-badge :source="$order->source" /></td>
                <td class="px-4 py-2.5 text-slate-600">₹{{ number_format((float) $order->total_amount, 2) }}</td>
                <td class="px-4 py-2.5 text-slate-600">
                    ₹{{ number_format((float) $order->advance_amount, 2) }} / ₹{{ number_format((float) $order->remaining_amount, 2) }}
                </td>
                <td class="px-4 py-2.5"><x-admin.status-badge :status="$order->payment_status" /></td>
                <td class="px-4 py-2.5"><x-admin.status-badge :status="$order->order_status" /></td>
                <td class="px-4 py-2.5 text-slate-500">{{ $order->created_at->format('d M Y, H:i') }}</td>
                <td class="px-4 py-2.5 text-right">
                    <a href="{{ route('admin.orders.show', $order) }}" class="text-slate-600 hover:text-slate-900">View</a>
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
