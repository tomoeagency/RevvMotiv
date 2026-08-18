@php $announcement = $announcement ?? null; @endphp
<form method="POST" action="{{ $announcement ? route('admin.announcements.update', $announcement) : route('admin.announcements.store') }}" class="space-y-6 max-w-xl">
    @csrf
    @if ($announcement) @method('PUT') @endif

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Announcement Message
        </h2>

        <x-admin.form-field name="text" label="Headline / Ticker Text" required hint="Max 500 characters.">
            <input type="text" name="text" id="text" value="{{ old('text', $announcement->text ?? '') }}" maxlength="500" required placeholder="e.g. Free shipping on all custom aero kits across India this week!"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>

        <x-admin.form-field name="link_url" label="Clickable Action URL" hint="Optional — makes the ticker item clickable.">
            <input type="url" name="link_url" id="link_url" value="{{ old('link_url', $announcement->link_url ?? '') }}" placeholder="https://www.revvmotiv.com/shop"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>

        <x-admin.form-field name="sort_order" label="Marquee Sequence Position" hint="Lower numbers appear first in the ticker loop.">
            <input type="number" min="0" name="sort_order" id="sort_order" value="{{ old('sort_order', $announcement->sort_order ?? 0) }}"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>

        <div class="pt-2">
            <label class="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input type="checkbox" name="active" value="1" class="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500" @checked(old('active', $announcement->active ?? true))>
                <span>Announcement is active and visible in ticker</span>
            </label>
        </div>
    </div>

    <!-- Actions Deck -->
    <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>{{ $announcement ? 'Save Changes' : 'Create Announcement' }}</span>
        </button>
        <a href="{{ route('admin.announcements.index') }}" class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
            Cancel
        </a>
    </div>
</form>
