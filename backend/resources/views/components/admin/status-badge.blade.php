@props(['status'])
@php
    $classes = match ($status) {
        'active', 'approved', 'delivered', 'fully_paid', 'advance_paid' => 'bg-emerald-100 text-emerald-800',
        'draft', 'pending' => 'bg-slate-100 text-slate-700',
        'confirmed', 'shipped' => 'bg-blue-100 text-blue-800',
        'rejected', 'cancelled', 'failed' => 'bg-red-100 text-red-800',
        'refunded' => 'bg-amber-100 text-amber-800',
        default => 'bg-slate-100 text-slate-700',
    };
@endphp
<span {{ $attributes->merge(['class' => "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize $classes"]) }}>
    {{ str_replace('_', ' ', $status) }}
</span>
