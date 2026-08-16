@php $view = $view ?? null; @endphp
<form method="POST" action="{{ $view ? route('admin.projects.views.update', [$project, $view]) : route('admin.projects.views.store', $project) }}" enctype="multipart/form-data" class="max-w-xl space-y-1">
    @csrf
    @if ($view) @method('PUT') @endif

    <x-admin.form-field name="view_type" label="View" required>
        <select name="view_type" id="view_type" required
                class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
            @foreach (['front', 'rear', 'left', 'right', 'top', 'bottom', 'interior'] as $type)
                <option value="{{ $type }}" @selected(old('view_type', $view->view_type ?? '') === $type)>{{ ucfirst($type) }}</option>
            @endforeach
        </select>
    </x-admin.form-field>

    <x-admin.form-field name="work_description" label="Work description" hint="What was done for this angle.">
        <textarea name="work_description" id="work_description" rows="3"
                  class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">{{ old('work_description', $view->work_description ?? '') }}</textarea>
    </x-admin.form-field>

    <x-admin.form-field name="sort_order" label="Sort order" hint="Lower numbers show first among this project's views.">
        <input type="number" min="0" name="sort_order" id="sort_order" value="{{ old('sort_order', $view->sort_order ?? 0) }}"
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
    </x-admin.form-field>

    @if ($view && ! empty($view->images))
        <div class="mb-4">
            <p class="mb-2 text-sm font-medium text-slate-700">Existing images</p>
            <div class="flex flex-wrap gap-3">
                @foreach ($view->images as $url)
                    <label class="relative block">
                        <img src="{{ $url }}" alt="" class="h-20 w-20 rounded object-cover">
                        <span class="mt-1 flex items-center gap-1 text-xs text-red-600">
                            <input type="checkbox" name="remove_images[]" value="{{ $url }}">
                            Remove
                        </span>
                    </label>
                @endforeach
            </div>
        </div>
    @endif

    <x-admin.form-field name="images" label="{{ $view ? 'Add images' : 'Images' }}" hint="JPG/PNG/WebP, up to 5MB each, max 6 files.">
        <input type="file" name="images[]" id="images" multiple accept="image/png,image/jpeg,image/webp"
               class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-sm hover:file:bg-slate-300">
    </x-admin.form-field>

    <div class="flex gap-3 pt-2">
        <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            {{ $view ? 'Save changes' : 'Add view' }}
        </button>
        <a href="{{ route('admin.projects.edit', $project) }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
    </div>
</form>
