@props(['source'])
@php
    // Separate from status-badge on purpose — these are sales-channel
    // labels, not status semantics, so reusing the same color vocabulary
    // (e.g. blue = "confirmed") would misleadingly imply a status meaning.
    $classes = match ($source) {
        'instagram' => 'bg-fuchsia-100 text-fuchsia-800',
        'call' => 'bg-sky-100 text-sky-800',
        'whatsapp' => 'bg-emerald-100 text-emerald-800',
        'other' => 'bg-amber-100 text-amber-800',
        default => 'bg-slate-100 text-slate-700', // website
    };
    $labels = [
        'website' => 'Website',
        'instagram' => 'Instagram',
        'call' => 'Call',
        'whatsapp' => 'WhatsApp',
        'other' => 'Other',
    ];
@endphp
<span {{ $attributes->merge(['class' => "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium $classes"]) }}>
    {{ $labels[$source] ?? ucfirst($source) }}
</span>
