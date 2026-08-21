<x-admin.layout title="Garage Reels">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 class="text-base font-semibold text-slate-800">Garage Reels & Shoppable Videos</h2>
            <p class="text-xs text-slate-500">Manage real video reels displayed on the homepage with instant in-page playback and product buy links.</p>
        </div>

        <div class="flex items-center gap-3">
            <a href="{{ route('admin.reels.create') }}" class="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-700 transition-colors">
                + Upload New Reel
            </a>
        </div>
    </div>

    @if (session('success'))
        <div class="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            {{ session('success') }}
        </div>
    @endif

    <div class="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <x-admin.data-table :headers="['Reel Video', 'Title & Car', 'Tag / Category', 'Linked Product', 'Status', 'Actions']" :paginator="$reels">
            @forelse ($reels as $reel)
                <tr class="hover:bg-slate-50/80 transition-colors">
                    <td class="px-4 py-3">
                        <div class="relative h-20 w-14 rounded-lg overflow-hidden bg-black border border-slate-200 shadow-xs flex items-center justify-center">
                            @if ($reel->thumbnail_url)
                                <img src="{{ $reel->thumbnail_url }}" alt="{{ $reel->title }}" class="h-full w-full object-cover">
                            @else
                                <video src="{{ $reel->video_url }}" class="h-full w-full object-cover" muted></video>
                            @endif
                            <div class="absolute inset-0 bg-black/20 flex items-center justify-center pointer-events-none">
                                <svg class="h-5 w-5 text-white/90 drop-shadow fill-white" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z"/>
                                </svg>
                            </div>
                        </div>
                    </td>
                    <td class="px-4 py-3">
                        <div class="font-bold text-slate-900 text-xs">{{ $reel->title }}</div>
                        <div class="text-[11px] text-slate-500 mt-0.5">{{ $reel->car ?? 'Bespoke Workshop Build' }}</div>
                        @if ($reel->instagram_url)
                            <a href="{{ $reel->instagram_url }}" target="_blank" rel="noopener noreferrer" class="text-[10px] text-red-600 hover:underline mt-0.5 inline-block">
                                Instagram Link ↗
                            </a>
                        @endif
                    </td>
                    <td class="px-4 py-3">
                        <span class="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                            {{ $reel->tag ?? '#REVVMOTIV' }}
                        </span>
                        <div class="text-[10px] text-slate-400 mt-0.5">{{ $reel->category ?? 'Live Workshop Reel' }}</div>
                    </td>
                    <td class="px-4 py-3">
                        @if ($reel->product)
                            <a href="{{ route('admin.products.edit', $reel->product) }}" class="text-xs font-semibold text-slate-800 hover:text-red-600 hover:underline">
                                {{ $reel->product->title }}
                            </a>
                            <div class="text-[11px] text-slate-500">₹{{ number_format($reel->product->price) }}</div>
                        @else
                            <span class="text-xs text-slate-400">None linked</span>
                        @endif
                    </td>
                    <td class="px-4 py-3">
                        <x-admin.status-badge :status="$reel->is_active ? 'active' : 'draft'" />
                    </td>
                    <td class="px-4 py-3 text-right">
                        <div class="flex items-center justify-end gap-2">
                            <a href="{{ route('admin.reels.edit', $reel) }}" class="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors">
                                <x-admin.icon name="edit" class="h-3.5 w-3.5" />
                                Edit
                            </a>
                            <x-admin.delete-button :action="route('admin.reels.destroy', $reel)" confirm="Are you sure you want to delete this reel?" />
                        </div>
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="6" class="px-4 py-8 text-center text-xs text-slate-500">
                        No reels uploaded yet. Click "+ Upload New Reel" to add your first video!
                    </td>
                </tr>
            @endforelse
        </x-admin.data-table>
    </div>
</x-admin.layout>
