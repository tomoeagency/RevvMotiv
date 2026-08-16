@props(['name', 'id' => null, 'value' => '', 'required' => false, 'autocomplete' => 'current-password'])
@php $id = $id ?? $name; @endphp
<div class="relative">
    <input type="password" name="{{ $name }}" id="{{ $id }}" value="{{ $value }}" @if($required) required @endif autocomplete="{{ $autocomplete }}"
           {{ $attributes->merge(['class' => 'block w-full rounded-md border-slate-300 pr-10 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm']) }}>
    <button type="button" data-password-toggle="{{ $id }}" aria-label="Show password"
            class="absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400 hover:text-slate-600">
        <svg data-icon-show xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 3.5c-4.5 0-8.3 3-9.7 6.5 1.4 3.5 5.2 6.5 9.7 6.5s8.3-3 9.7-6.5C18.3 6.5 14.5 3.5 10 3.5Zm0 11a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9Zm0-7a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Z"/>
        </svg>
        <svg data-icon-hide class="hidden h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M3.28 2.22a.75.75 0 0 0-1.06 1.06l14.5 14.5a.75.75 0 1 0 1.06-1.06l-1.86-1.86c1.73-1.2 3.06-2.9 3.83-4.86-1.4-3.5-5.2-6.5-9.7-6.5-1.36 0-2.65.27-3.82.77L3.28 2.22Zm4.02 4.02 1.55 1.55a2.5 2.5 0 0 0 3.36 3.36l1.55 1.55a4.5 4.5 0 0 1-6.46-6.46ZM.5 10c1.02 2.55 3.1 4.6 5.7 5.7l-1.2-1.2C3.16 13.5 1.66 11.9.8 10c.32-.72.73-1.4 1.22-2.02L.5 6.46A9.9 9.9 0 0 0 .5 10Z"/>
        </svg>
    </button>
</div>
