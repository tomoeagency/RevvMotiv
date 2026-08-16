<x-admin.layout title="Coupons">
    <div class="mb-4 flex justify-end">
        <a href="{{ route('admin.coupons.create') }}" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            + New Coupon
        </a>
    </div>

    <x-admin.data-table :headers="['Code', 'Value', 'Applies to', 'Public', 'Influencer', 'Usage', 'Active', '']" :paginator="$coupons">
        @foreach ($coupons as $coupon)
            <tr>
                <td class="px-4 py-2.5 font-mono font-medium text-slate-900">{{ $coupon->code }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $coupon->type === 'percent' ? $coupon->value.'%' : '₹'.number_format((float) $coupon->value, 2) }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $coupon->scopeLabel() }}</td>
                <td class="px-4 py-2.5">
                    @if ($coupon->is_public)
                        <span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Public</span>
                    @else
                        <span class="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">Hidden</span>
                    @endif
                </td>
                <td class="px-4 py-2.5 text-slate-500">{{ $coupon->influencer_name ?? '—' }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $coupon->times_used }}{{ $coupon->usage_limit ? ' / '.$coupon->usage_limit : '' }}</td>
                <td class="px-4 py-2.5"><x-admin.status-badge :status="$coupon->active ? 'active' : 'draft'" /></td>
                <td class="px-4 py-2.5 text-right">
                    <a href="{{ route('admin.coupons.edit', $coupon) }}" class="mr-3 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                    <x-admin.delete-button :action="route('admin.coupons.destroy', $coupon)" confirm="Delete this coupon? Past orders keep their applied discount either way." />
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
