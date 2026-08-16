@php $category = $category ?? null; @endphp
<form method="POST" action="{{ $category ? route('admin.categories.update', $category) : route('admin.categories.store') }}" class="max-w-md space-y-1">
    @csrf
    @if ($category) @method('PUT') @endif

    <x-admin.form-field name="name" label="Name" required>
        <input type="text" name="name" id="name" value="{{ old('name', $category->name ?? '') }}" required
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
    </x-admin.form-field>

    <x-admin.form-field name="slug" label="Slug" hint="Leave blank to auto-generate from the name.">
        <input type="text" name="slug" id="slug" value="{{ old('slug', $category->slug ?? '') }}"
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
    </x-admin.form-field>

    <div class="flex gap-3 pt-2">
        <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            {{ $category ? 'Save changes' : 'Create category' }}
        </button>
        <a href="{{ route('admin.categories.index') }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
    </div>
</form>
