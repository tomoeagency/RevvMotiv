@php $category = $category ?? null; @endphp
<form method="POST" action="{{ $category ? route('admin.categories.update', $category) : route('admin.categories.store') }}" class="max-w-xl space-y-6">
    @csrf
    @if ($category) @method('PUT') @endif

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Category Details
        </h2>

        <x-admin.form-field name="name" label="Category Name" required>
            <input type="text" name="name" id="name" value="{{ old('name', $category->name ?? '') }}" required placeholder="e.g. Front Splitters & Lips"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>

        <x-admin.form-field name="slug" label="URL Slug" hint="Leave blank to auto-generate from category name.">
            <input type="text" name="slug" id="slug" value="{{ old('slug', $category->slug ?? '') }}" placeholder="front-splitters-lips"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono text-xs shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>
    </div>

    <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>{{ $category ? 'Save Changes' : 'Create Category' }}</span>
        </button>
        <a href="{{ route('admin.categories.index') }}" class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
            Cancel
        </a>
    </div>
</form>
