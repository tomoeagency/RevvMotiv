@props(['source'])
@php
    $config = match ($source) {
        'instagram' => 'bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700',
        'call' => 'bg-sky-50 border-sky-200 text-sky-700',
        'whatsapp' => 'bg-emerald-50 border-emerald-200 text-emerald-700',
        'other' => 'bg-amber-50 border-amber-200 text-amber-700',
        default => 'bg-slate-50 border-slate-200 text-slate-700', // website
    };
    $labels = [
        'website' => 'Website',
        'instagram' => 'Instagram',
        'call' => 'Phone Call',
        'whatsapp' => 'WhatsApp',
        'other' => 'Other Channel',
    ];
@endphp
<span {{ $attributes->merge(['class' => "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold $config shadow-2xs"]) }}>
    {{ $labels[$source] ?? ucfirst($source) }}
</span>
