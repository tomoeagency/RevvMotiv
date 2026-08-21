<x-admin.layout title="Edit Gallery Item">
    <a href="{{ route('admin.gallery.index') }}" class="mb-4 inline-block text-sm text-slate-500 hover:text-slate-900">&larr; Back to gallery</a>

    <div class="mb-6 max-w-md">
        @if ($item->media_type === 'video')
            <video src="{{ $item->media_url }}" class="w-full rounded-lg border border-slate-200 bg-slate-100" controls></video>
        @else
            <img src="{{ $item->media_url }}" alt="" class="w-full rounded-lg border border-slate-200 bg-slate-100">
        @endif
        <p class="mt-2 text-xs text-slate-400">
            To replace the media itself, delete this item and upload a new one — editing here only changes
            caption, order, and visibility.
        </p>
    </div>

    <form method="POST" action="{{ route('admin.gallery.update', $item) }}" class="max-w-md space-y-1">
        @csrf
        @method('PUT')

        <x-admin.form-field name="category" label="Category" hint="Powers the filter buttons on the public gallery page.">
            <select name="category" id="category"
                    class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
                <option value="">Uncategorized</option>
                @foreach (\App\Models\GalleryItem::CATEGORIES as $value => $label)
                    <option value="{{ $value }}" @selected(old('category', $item->category) === $value)>{{ $label }}</option>
                @endforeach
            </select>
        </x-admin.form-field>

        <x-admin.form-field name="caption" label="Caption" hint="Optional — shown under the media on the Gallery page.">
            <input type="text" name="caption" id="caption" value="{{ old('caption', $item->caption) }}" maxlength="255"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
        </x-admin.form-field>

        <x-admin.form-field name="sort_order" label="Sort order" hint="Lower numbers show first.">
            <input type="number" min="0" name="sort_order" id="sort_order" value="{{ old('sort_order', $item->sort_order) }}"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
        </x-admin.form-field>

        <label class="mb-4 flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" name="active" value="1" class="rounded border-slate-300" @checked(old('active', $item->active))>
            Active
        </label>

        <div class="flex gap-3 pt-2">
            <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
                Save changes
            </button>
            <a href="{{ route('admin.gallery.index') }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
        </div>
    </form>
</x-admin.layout>
