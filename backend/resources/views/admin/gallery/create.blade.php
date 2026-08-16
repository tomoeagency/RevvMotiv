<x-admin.layout title="New Gallery Item">
    <a href="{{ route('admin.gallery.index') }}" class="mb-4 inline-block text-sm text-slate-500 hover:text-slate-900">&larr; Back to gallery</a>

    @error('media')
        <div class="mb-6 max-w-md rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {{ $message }}
        </div>
    @enderror

    <form method="POST" action="{{ route('admin.gallery.store') }}" enctype="multipart/form-data" class="max-w-md space-y-1">
        @csrf

        <x-admin.form-field name="media" label="Image or video" required hint="JPG, PNG, WEBP, MP4, MOV, or WEBM — up to 50MB.">
            <input type="file" name="media" id="media" accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/webm" required
                   class="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-medium hover:file:bg-slate-200">
        </x-admin.form-field>

        <x-admin.form-field name="caption" label="Caption" hint="Optional — shown under the media on the Gallery page.">
            <input type="text" name="caption" id="caption" value="{{ old('caption') }}" maxlength="255"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
        </x-admin.form-field>

        <x-admin.form-field name="sort_order" label="Sort order" hint="Lower numbers show first.">
            <input type="number" min="0" name="sort_order" id="sort_order" value="{{ old('sort_order', 0) }}"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
        </x-admin.form-field>

        <div class="flex gap-3 pt-2">
            <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
                Upload
            </button>
            <a href="{{ route('admin.gallery.index') }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
        </div>
    </form>
</x-admin.layout>
