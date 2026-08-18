@props(['name', 'label', 'hint' => null, 'required' => false])
<div class="space-y-1.5 mb-5">
    <label for="{{ $name }}" class="block text-xs font-bold uppercase tracking-wider text-slate-700">
        {{ $label }}
        @if ($required)
            <span class="text-rose-500">*</span>
        @endif
    </label>
    {{ $slot }}
    @if ($hint)
        <p class="text-xs text-slate-500 leading-normal">{{ $hint }}</p>
    @endif
    @error($name)
        <p class="text-xs font-medium text-rose-600 flex items-center gap-1">
            <svg class="h-3.5 w-3.5 flex-none" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            <span>{{ $message }}</span>
        </p>
    @enderror
</div>
