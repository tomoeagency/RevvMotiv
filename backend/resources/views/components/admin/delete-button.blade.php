@props(['action', 'confirm' => 'Are you sure? This cannot be undone.', 'label' => 'Delete'])
<form method="POST" action="{{ $action }}" onsubmit="return confirm({{ Js::from($confirm) }})">
    @csrf
    @method('DELETE')
    <button type="submit" {{ $attributes->merge(['class' => 'inline-flex items-center gap-1 text-red-600 hover:text-red-800 cursor-pointer']) }}>
        <x-admin.icon name="trash" class="h-3.5 w-3.5" />
        {{ $label }}
    </button>
</form>
