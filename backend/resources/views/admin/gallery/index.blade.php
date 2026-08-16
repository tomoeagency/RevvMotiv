<x-admin.layout title="Gallery">
    <p class="mb-4 text-sm text-slate-500">
        Images and videos shown on the storefront's Gallery page. Caption is optional; sort order controls
        display sequence (lower shows first); inactive items are hidden from the site but not deleted.
    </p>

    <div class="mb-4 flex justify-end">
        <a href="{{ route('admin.gallery.create') }}" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            + New Gallery Item
        </a>
    </div>

    <x-admin.data-table :headers="['Preview', 'Type', 'Caption', 'Sort Order', 'Active', '']" :paginator="$items">
        @foreach ($items as $item)
            <tr>
                <td class="px-4 py-2.5">
                    @if ($item->media_type === 'video')
                        <video src="{{ $item->media_url }}" class="h-14 w-14 rounded object-cover bg-slate-100" muted></video>
                    @else
                        <img src="{{ $item->media_url }}" alt="" class="h-14 w-14 rounded object-cover bg-slate-100">
                    @endif
                </td>
                <td class="px-4 py-2.5 text-slate-600 capitalize">{{ $item->media_type }}</td>
                <td class="px-4 py-2.5 max-w-xs truncate text-slate-500">{{ $item->caption ?? '—' }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $item->sort_order }}</td>
                <td class="px-4 py-2.5"><x-admin.status-badge :status="$item->active ? 'active' : 'draft'" /></td>
                <td class="px-4 py-2.5 text-right">
                    <a href="{{ route('admin.gallery.edit', $item) }}" class="mr-3 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                    <x-admin.delete-button :action="route('admin.gallery.destroy', $item)" confirm="Delete this gallery item?" />
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
