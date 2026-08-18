<x-admin.layout title="Announcements">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Storefront Marquee Announcements</h2>
            <p class="text-xs text-slate-500">Live news tickers and promotional ribbons displayed at the top of the storefront.</p>
        </div>

        <a href="{{ route('admin.announcements.create') }}" class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1e3a5f] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>+ New Announcement</span>
        </a>
    </div>

    <x-admin.data-table :headers="['Headline Text', 'Destination Link', 'Sort Order', 'Status', '']" :paginator="$announcements">
        @foreach ($announcements as $announcement)
            <tr class="hover:bg-slate-50/70 transition-colors">
                <td class="px-4 py-3 text-xs font-bold text-slate-900">{{ $announcement->text }}</td>
                <td class="px-4 py-3 text-xs font-mono text-slate-500 max-w-xs truncate">
                    @if ($announcement->link_url)
                        <a href="{{ $announcement->link_url }}" target="_blank" class="hover:underline text-slate-700">{{ $announcement->link_url }}</a>
                    @else
                        <span>—</span>
                    @endif
                </td>
                <td class="px-4 py-3 text-xs font-mono font-bold text-slate-700 tabular-nums">#{{ $announcement->sort_order }}</td>
                <td class="px-4 py-3">
                    <x-admin.status-badge :status="$announcement->active ? 'active' : 'draft'" />
                </td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                    <div class="inline-flex items-center gap-2">
                        <a href="{{ route('admin.announcements.edit', $announcement) }}" 
                           class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs">
                            <x-admin.icon name="edit" class="h-3 w-3" />
                            <span>Edit</span>
                        </a>
                        <x-admin.delete-button :action="route('admin.announcements.destroy', $announcement)" confirm="Delete this announcement?" />
                    </div>
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
