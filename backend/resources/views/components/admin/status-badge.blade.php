@props(['status'])
@php
    $config = match ($status) {
        'active', 'approved', 'delivered', 'fully_paid' => [
            'bg' => 'bg-emerald-50 border-emerald-200/80 text-emerald-700',
            'dot' => 'bg-emerald-500',
        ],
        'confirmed', 'shipped' => [
            'bg' => 'bg-blue-50 border-blue-200/80 text-blue-700',
            'dot' => 'bg-blue-500',
        ],
        'advance_paid', 'pending', 'draft' => [
            'bg' => 'bg-amber-50 border-amber-200/80 text-amber-700',
            'dot' => 'bg-amber-500',
        ],
        'rejected', 'cancelled', 'failed' => [
            'bg' => 'bg-rose-50 border-rose-200/80 text-rose-700',
            'dot' => 'bg-rose-500',
        ],
        'refunded' => [
            'bg' => 'bg-purple-50 border-purple-200/80 text-purple-700',
            'dot' => 'bg-purple-500',
        ],
        default => [
            'bg' => 'bg-slate-50 border-slate-200 text-slate-700',
            'dot' => 'bg-slate-400',
        ],
    };
@endphp
<span {{ $attributes->merge(['class' => "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize shadow-2xs {$config['bg']}"]) }}>
    <span class="h-1.5 w-1.5 rounded-full {{ $config['dot'] }}"></span>
    <span>{{ str_replace('_', ' ', $status) }}</span>
</span>
