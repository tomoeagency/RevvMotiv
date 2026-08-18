<x-admin.layout title="Coupons">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Discount Coupons</h2>
            <p class="text-xs text-slate-500">Promotional discount codes, influencer tags, and cart rules.</p>
        </div>

        <a href="{{ route('admin.coupons.create') }}" class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1e3a5f] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>+ New Coupon</span>
        </a>
    </div>

    <x-admin.data-table :headers="['Code', 'Discount Value', 'Scope', 'Visibility', 'Influencer Campaign', 'Redemptions', 'Status', '']" :paginator="$coupons">
        @foreach ($coupons as $coupon)
            <tr class="hover:bg-slate-50/70 transition-colors">
                <!-- Code -->
                <td class="px-4 py-3 font-mono font-bold text-slate-900 text-xs">
                    <span class="rounded bg-slate-100 px-2 py-0.5 border border-slate-200">{{ $coupon->code }}</span>
                </td>

                <!-- Value -->
                <td class="px-4 py-3 font-bold font-mono text-emerald-700 tabular-nums text-xs">
                    {{ $coupon->type === 'percent' ? $coupon->value.'%' : '₹'.number_format((float) $coupon->value, 2) }}
                </td>

                <!-- Scope -->
                <td class="px-4 py-3 text-xs text-slate-700 font-medium">
                    {{ $coupon->scopeLabel() }}
                </td>

                <!-- Visibility -->
                <td class="px-4 py-3 text-xs">
                    @if ($coupon->is_public)
                        <span class="inline-flex items-center rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">Public Banner</span>
                    @else
                        <span class="inline-flex items-center rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[10px] font-bold text-slate-600">Hidden / Direct</span>
                    @endif
                </td>

                <!-- Influencer -->
                <td class="px-4 py-3 text-xs text-slate-500 font-medium">
                    {{ $coupon->influencer_name ?? '—' }}
                </td>

                <!-- Redemptions -->
                <td class="px-4 py-3 text-xs font-mono font-bold text-slate-700 tabular-nums">
                    {{ $coupon->times_used }}{{ $coupon->usage_limit ? ' / '.$coupon->usage_limit : '' }}
                </td>

                <!-- Status -->
                <td class="px-4 py-3">
                    <x-admin.status-badge :status="$coupon->active ? 'active' : 'draft'" />
                </td>

                <!-- Actions -->
                <td class="px-4 py-3 text-right whitespace-nowrap">
                    <div class="inline-flex items-center gap-2">
                        <a href="{{ route('admin.coupons.edit', $coupon) }}" 
                           class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs">
                            <x-admin.icon name="edit" class="h-3 w-3" />
                            <span>Edit</span>
                        </a>
                        <x-admin.delete-button :action="route('admin.coupons.destroy', $coupon)" confirm="Delete this coupon? Past orders will retain their applied discount." />
                    </div>
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
