@php $project = $project ?? null; @endphp
<form method="POST" action="{{ $project ? route('admin.projects.update', $project) : route('admin.projects.store') }}" enctype="multipart/form-data" class="space-y-6 max-w-2xl">
    @csrf
    @if ($project) @method('PUT') @endif

    <!-- Card 1: Build Details -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Vehicle & Build Information
        </h2>

        <x-admin.form-field name="title" label="Project Title" required hint="e.g. 2019 Hyundai Verna — Stealth Aero & Carbon Edition">
            <input type="text" name="title" id="title" value="{{ old('title', $project->title ?? '') }}" required placeholder="e.g. 2023 Maruti Swift — Full Aero Kit"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>

        <x-admin.form-field name="slug" label="URL Slug" hint="Leave blank to auto-generate from project title.">
            <input type="text" name="slug" id="slug" value="{{ old('slug', $project->slug ?? '') }}" placeholder="2023-maruti-swift-full-aero-kit"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono text-xs shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <x-admin.form-field name="car_make" label="Car Make" required>
                <input type="text" name="car_make" id="car_make" value="{{ old('car_make', $project->car_make ?? '') }}" required placeholder="e.g. Hyundai"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>

            <x-admin.form-field name="car_model" label="Car Model / Year" required>
                <input type="text" name="car_model" id="car_model" value="{{ old('car_model', $project->car_model ?? '') }}" required placeholder="e.g. Verna 2019"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>
        </div>

        <x-admin.form-field name="description" label="Build Case Study / Work Summary">
            <textarea name="description" id="description" rows="4" placeholder="Detailed breakdown of custom parts installed, carbon fiber aero components, laser scanning, and fitment results..."
                      class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">{{ old('description', $project->description ?? '') }}</textarea>
        </x-admin.form-field>
    </div>

    <!-- Card 2: Status & Display Order -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Publishing Status
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <x-admin.form-field name="status" label="Publish Status" required>
                <select name="status" id="status" required
                        class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                    <option value="draft" @selected(old('status', $project->status ?? 'draft') === 'draft')>Draft (Hidden)</option>
                    <option value="active" @selected(old('status', $project->status ?? 'draft') === 'active')>Active (Published)</option>
                </select>
            </x-admin.form-field>

            <x-admin.form-field name="sort_order" label="Showcase Sort Order" hint="Lower numbers appear first on the Our Work page.">
                <input type="number" min="0" name="sort_order" id="sort_order" value="{{ old('sort_order', $project->sort_order ?? 0) }}"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>
        </div>
    </div>

    <!-- Card 3: Cover Image -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Project Cover Photo
        </h2>

        @if ($project && $project->cover_image)
            <div class="mb-2">
                <p class="text-xs font-bold text-slate-700 mb-2">Current Showcase Cover</p>
                <div class="overflow-hidden rounded-lg border border-slate-200 bg-slate-50 p-1 w-48 shadow-2xs">
                    <img src="{{ $project->cover_image }}" alt="" class="aspect-video w-full rounded object-cover">
                </div>
            </div>
        @endif

        <x-admin.form-field name="cover_image" label="{{ $project && $project->cover_image ? 'Replace Cover Image' : 'Cover Image' }}" hint="JPG, PNG, WEBP — up to 5MB.">
            <input type="file" name="cover_image" id="cover_image" accept="image/png,image/jpeg,image/webp"
                   class="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3.5 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 cursor-pointer">
        </x-admin.form-field>
    </div>

    <!-- Actions Deck -->
    <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>{{ $project ? 'Save Changes' : 'Create Project' }}</span>
        </button>
        <a href="{{ route('admin.projects.index') }}" class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
            Cancel
        </a>
    </div>
</form>
