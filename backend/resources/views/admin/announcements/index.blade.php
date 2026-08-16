<x-admin.layout title="Announcements">
    <p class="mb-4 text-sm text-slate-500">
        These entries make up the announcement strip. Display behavior (on/off, scroll vs. one-at-a-time, timing) is configured on the
        <a href="{{ route('admin.settings.edit') }}" class="underline hover:text-slate-700">Settings page</a>.
    </p>

    <div class="mb-4 flex justify-end">
        <a href="{{ route('admin.announcements.create') }}" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            + New Announcement
        </a>
    </div>

    <x-admin.data-table :headers="['Text', 'Link', 'Sort Order', 'Active', '']" :paginator="$announcements">
        @foreach ($announcements as $announcement)
            <tr>
                <td class="px-4 py-2.5 text-slate-900">{{ $announcement->text }}</td>
                <td class="px-4 py-2.5 max-w-xs truncate text-slate-500">{{ $announcement->link_url ?? '—' }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $announcement->sort_order }}</td>
                <td class="px-4 py-2.5"><x-admin.status-badge :status="$announcement->active ? 'active' : 'draft'" /></td>
                <td class="px-4 py-2.5 text-right">
                    <a href="{{ route('admin.announcements.edit', $announcement) }}" class="mr-3 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                    <x-admin.delete-button :action="route('admin.announcements.destroy', $announcement)" confirm="Delete this announcement?" />
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
