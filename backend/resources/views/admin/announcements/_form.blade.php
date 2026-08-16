@php $announcement = $announcement ?? null; @endphp
<form method="POST" action="{{ $announcement ? route('admin.announcements.update', $announcement) : route('admin.announcements.store') }}" class="max-w-md space-y-1">
    @csrf
    @if ($announcement) @method('PUT') @endif

    <x-admin.form-field name="text" label="Text" required>
        <input type="text" name="text" id="text" value="{{ old('text', $announcement->text ?? '') }}" maxlength="500" required
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
    </x-admin.form-field>

    <x-admin.form-field name="link_url" label="Link URL" hint="Optional — makes this entry clickable.">
        <input type="url" name="link_url" id="link_url" value="{{ old('link_url', $announcement->link_url ?? '') }}"
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
    </x-admin.form-field>

    <x-admin.form-field name="sort_order" label="Sort order" hint="Lower numbers show first.">
        <input type="number" min="0" name="sort_order" id="sort_order" value="{{ old('sort_order', $announcement->sort_order ?? 0) }}"
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
    </x-admin.form-field>

    <label class="mb-4 flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="active" value="1" class="rounded border-slate-300" @checked(old('active', $announcement->active ?? true))>
        Active
    </label>

    <div class="flex gap-3 pt-2">
        <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            {{ $announcement ? 'Save changes' : 'Create announcement' }}
        </button>
        <a href="{{ route('admin.announcements.index') }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
    </div>
</form>
