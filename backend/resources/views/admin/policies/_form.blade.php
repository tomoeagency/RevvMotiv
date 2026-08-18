@php $policy = $policy ?? null; @endphp
<form method="POST" action="{{ $policy ? route('admin.policies.update', $policy) : route('admin.policies.store') }}" class="space-y-6 max-w-3xl">
    @csrf
    @if ($policy) @method('PUT') @endif

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Policy Page Metadata
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <x-admin.form-field name="title" label="Document Title" required>
                <input type="text" name="title" id="title" value="{{ old('title', $policy->title ?? '') }}" required placeholder="e.g. Terms of Service"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>

            <x-admin.form-field name="slug" label="URL Slug" hint="Used in the public URL/API routes." required>
                <input type="text" name="slug" id="slug" value="{{ old('slug', $policy->slug ?? '') }}" required placeholder="terms-of-service"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono text-xs shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>
        </div>

        <x-admin.form-field name="content" label="Policy Content (Markdown)" hint="Supports headings (##), bold (**text**), lists (- item), and links ([text](url))." required>
            <textarea name="content" id="content" rows="18" placeholder="# Terms of Service&#10;&#10;Welcome to RevvMotiv..."
                      class="block w-full rounded-lg border-slate-300 bg-white p-4 text-xs font-mono leading-relaxed text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">{{ old('content', $policy->content ?? '') }}</textarea>
        </x-admin.form-field>
    </div>

    <!-- Actions Deck -->
    <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>{{ $policy ? 'Save Changes' : 'Create Policy' }}</span>
        </button>
        <a href="{{ route('admin.policies.index') }}" class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
            Cancel
        </a>
    </div>
</form>
