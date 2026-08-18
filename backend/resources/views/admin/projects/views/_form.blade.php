@php $view = $view ?? null; @endphp
<form method="POST" action="{{ $view ? route('admin.projects.views.update', [$project, $view]) : route('admin.projects.views.store', $project) }}" enctype="multipart/form-data" class="space-y-6 max-w-2xl">
    @csrf
    @if ($view) @method('PUT') @endif

    <!-- Card 1: Angle Details -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Angle & Perspective Details
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <x-admin.form-field name="view_type" label="Vehicle Angle / View" required>
                <select name="view_type" id="view_type" required
                        class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                    @foreach (['front', 'rear', 'left', 'right', 'top', 'bottom', 'interior'] as $type)
                        <option value="{{ $type }}" @selected(old('view_type', $view->view_type ?? '') === $type)>{{ ucfirst($type) }} View</option>
                    @endforeach
                </select>
            </x-admin.form-field>

            <x-admin.form-field name="sort_order" label="Display Order" hint="Lower numbers appear first among this vehicle's angle tabs.">
                <input type="number" min="0" name="sort_order" id="sort_order" value="{{ old('sort_order', $view->sort_order ?? 0) }}"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>
        </div>

        <x-admin.form-field name="work_description" label="Work Summary for this Angle" hint="Describe the exact modifications shown in this perspective.">
            <textarea name="work_description" id="work_description" rows="3" placeholder="e.g. Dual carbon rear diffuser, high-flow exhaust tips, and dynamic LED tail lamps..."
                      class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">{{ old('work_description', $view->work_description ?? '') }}</textarea>
        </x-admin.form-field>
    </div>

    <!-- Card 2: Photos for this Angle -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Angle Photos
        </h2>

        @if ($view && ! empty($view->images))
            <div class="mb-2">
                <p class="text-xs font-bold text-slate-700 mb-2">Current Photos</p>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    @foreach ($view->images as $url)
                        <div class="relative group rounded-lg border border-slate-200 bg-slate-50 p-1 overflow-hidden shadow-2xs">
                            <img src="{{ $url }}" alt="" class="aspect-square w-full rounded object-cover">
                            <label class="mt-1.5 flex items-center justify-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 cursor-pointer">
                                <input type="checkbox" name="remove_images[]" value="{{ $url }}" class="rounded border-slate-300 text-rose-600 focus:ring-rose-500">
                                <span>Delete</span>
                            </label>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif

        <x-admin.form-field name="images" label="{{ $view ? 'Upload Additional Photos' : 'Upload Photos' }}" hint="JPG, PNG, WEBP — up to 5MB each (Max 6 files).">
            <input type="file" name="images[]" id="images" multiple accept="image/png,image/jpeg,image/webp"
                   class="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3.5 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 cursor-pointer">
        </x-admin.form-field>
    </div>

    <!-- Actions Deck -->
    <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>{{ $view ? 'Save Changes' : 'Add Angle View' }}</span>
        </button>
        <a href="{{ route('admin.projects.edit', $project) }}" class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
            Cancel
        </a>
    </div>
</form>
