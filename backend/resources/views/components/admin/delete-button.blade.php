@props(['action', 'confirm' => 'Are you sure? This action cannot be undone.', 'label' => 'Delete'])
<form method="POST" action="{{ $action }}" onsubmit="return confirm({{ Js::from($confirm) }})" class="inline-block">
    @csrf
    @method('DELETE')
    <button type="submit" {{ $attributes->merge(['class' => 'inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50/70 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 hover:text-rose-800 transition-all cursor-pointer shadow-2xs']) }}>
        <x-admin.icon name="trash" class="h-3.5 w-3.5" />
        <span>{{ $label }}</span>
    </button>
</form>
