@php $project = $project ?? null; @endphp
<form method="POST" action="{{ $project ? route('admin.projects.update', $project) : route('admin.projects.store') }}" enctype="multipart/form-data" class="max-w-2xl space-y-1">
    @csrf
    @if ($project) @method('PUT') @endif

    <x-admin.form-field name="title" label="Title" required hint="e.g. &quot;2023 Swift — Full Aero Kit&quot;">
        <input type="text" name="title" id="title" value="{{ old('title', $project->title ?? '') }}" required
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
    </x-admin.form-field>

    <x-admin.form-field name="slug" label="Slug" hint="Leave blank to auto-generate from the title.">
        <input type="text" name="slug" id="slug" value="{{ old('slug', $project->slug ?? '') }}"
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
    </x-admin.form-field>

    <div class="grid grid-cols-2 gap-4">
        <x-admin.form-field name="car_make" label="Car make" required>
            <input type="text" name="car_make" id="car_make" value="{{ old('car_make', $project->car_make ?? '') }}" required
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
        </x-admin.form-field>

        <x-admin.form-field name="car_model" label="Car model" required>
            <input type="text" name="car_model" id="car_model" value="{{ old('car_model', $project->car_model ?? '') }}" required
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
        </x-admin.form-field>
    </div>

    <x-admin.form-field name="description" label="Description">
        <textarea name="description" id="description" rows="4"
                  class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">{{ old('description', $project->description ?? '') }}</textarea>
    </x-admin.form-field>

    <div class="grid grid-cols-2 gap-4">
        <x-admin.form-field name="status" label="Status" required>
            <select name="status" id="status" required
                    class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                <option value="draft" @selected(old('status', $project->status ?? 'draft') === 'draft')>Draft</option>
                <option value="active" @selected(old('status', $project->status ?? 'draft') === 'active')>Active</option>
            </select>
        </x-admin.form-field>

        <x-admin.form-field name="sort_order" label="Sort order" hint="Lower numbers show first.">
            <input type="number" min="0" name="sort_order" id="sort_order" value="{{ old('sort_order', $project->sort_order ?? 0) }}"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
        </x-admin.form-field>
    </div>

    @if ($project && $project->cover_image)
        <div class="mb-4">
            <p class="mb-2 text-sm font-medium text-slate-700">Current cover image</p>
            <img src="{{ $project->cover_image }}" alt="" class="h-24 w-36 rounded object-cover">
        </div>
    @endif

    <x-admin.form-field name="cover_image" label="{{ $project && $project->cover_image ? 'Replace cover image' : 'Cover image' }}" hint="JPG/PNG/WebP, up to 5MB.">
        <input type="file" name="cover_image" id="cover_image" accept="image/png,image/jpeg,image/webp"
               class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-sm hover:file:bg-slate-300">
    </x-admin.form-field>

    <div class="flex gap-3 pt-2">
        <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            {{ $project ? 'Save changes' : 'Create project' }}
        </button>
        <a href="{{ route('admin.projects.index') }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
    </div>
</form>
