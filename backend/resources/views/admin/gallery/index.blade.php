<x-admin.layout title="Gallery">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 class="text-base font-semibold text-slate-800">Media Gallery Items</h2>
            <p class="text-xs text-slate-500">Visual showcase media displayed on the public storefront gallery.</p>
        </div>

        <div class="flex items-center gap-3">
            <!-- Grid / List Toggle -->
            <div class="inline-flex items-center rounded-lg border border-slate-300 bg-white p-1 shadow-sm">
                <button type="button" id="btnListViewGallery" onclick="setGalleryViewMode('list')"
                        class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-900"
                        title="List View">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span class="hidden sm:inline">List</span>
                </button>
                <button type="button" id="btnGridViewGallery" onclick="setGalleryViewMode('grid')"
                        class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-900"
                        title="Grid View">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span class="hidden sm:inline">Grid</span>
                </button>
            </div>

            <a href="{{ route('admin.gallery.create') }}" class="cursor-pointer rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d]">
                + New Gallery Item
            </a>
        </div>
    </div>

    <!-- 1. TABLE LIST VIEW -->
    <div id="galleryListView">
        <x-admin.data-table :headers="['Preview', 'Type', 'Category', 'Caption', 'Sort Order', 'Active', '']" :paginator="$items">
            @foreach ($items as $item)
                <tr>
                    <td class="px-4 py-2.5">
                        @if ($item->media_type === 'video')
                            <video src="{{ $item->media_url }}" class="h-12 w-12 rounded object-cover bg-slate-100" muted></video>
                        @else
                            <img src="{{ $item->media_url }}" alt="" class="h-12 w-12 rounded object-cover bg-slate-100">
                        @endif
                    </td>
                    <td class="px-4 py-2.5 text-slate-600 capitalize font-medium">{{ $item->media_type }}</td>
                    <td class="px-4 py-2.5 text-slate-600">{{ \App\Models\GalleryItem::CATEGORIES[$item->category] ?? '—' }}</td>
                    <td class="px-4 py-2.5 max-w-xs truncate text-slate-600">{{ $item->caption ?? '—' }}</td>
                    <td class="px-4 py-2.5 text-slate-600 tabular-nums">{{ $item->sort_order }}</td>
                    <td class="px-4 py-2.5"><x-admin.status-badge :status="$item->active ? 'active' : 'draft'" /></td>
                    <td class="px-4 py-2.5 text-right">
                        <a href="{{ route('admin.gallery.edit', $item) }}" class="mr-3 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                        <x-admin.delete-button :action="route('admin.gallery.destroy', $item)" confirm="Delete this gallery item?" />
                    </td>
                </tr>
            @endforeach
        </x-admin.data-table>
    </div>

    <!-- 2. CARDS GRID VIEW -->
    <div id="galleryGridView" class="hidden">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            @foreach ($items as $item)
                <div class="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                    <div class="relative aspect-square w-full overflow-hidden bg-slate-100">
                        @if ($item->media_type === 'video')
                            <video src="{{ $item->media_url }}" class="h-full w-full object-cover" muted></video>
                            <span class="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
                                <svg class="w-3 h-3 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                                Video
                            </span>
                        @else
                            <img src="{{ $item->media_url }}" alt="{{ $item->caption ?? 'Gallery Item' }}"
                                 class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105">
                        @endif

                        <div class="absolute inset-x-2.5 top-2.5 flex items-center justify-between">
                            <span class="rounded bg-black/70 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur-sm">
                                #{{ $item->sort_order }}
                            </span>
                            <x-admin.status-badge :status="$item->active ? 'active' : 'draft'" />
                        </div>
                    </div>

                    <div class="flex flex-1 flex-col p-3.5">
                        <p class="mb-3 line-clamp-2 text-xs text-slate-700 font-medium">
                            {{ $item->caption ?: 'No caption provided' }}
                        </p>

                        <div class="mt-auto flex items-center justify-end gap-2 border-t border-slate-100 pt-2.5 text-xs">
                            <a href="{{ route('admin.gallery.edit', $item) }}" 
                               class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200">
                                <x-admin.icon name="edit" class="h-3 w-3" />
                                <span>Edit</span>
                            </a>
                            <x-admin.delete-button :action="route('admin.gallery.destroy', $item)" confirm="Delete this gallery item?" />
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="mt-6">
            {{ $items->links() }}
        </div>
    </div>

    <script>
        function setGalleryViewMode(mode) {
            const listEl = document.getElementById('galleryListView');
            const gridEl = document.getElementById('galleryGridView');
            const btnList = document.getElementById('btnListViewGallery');
            const btnGrid = document.getElementById('btnGridViewGallery');

            if (mode === 'grid') {
                listEl.classList.add('hidden');
                gridEl.classList.remove('hidden');
                btnGrid.classList.add('bg-[#1e3a5f]', 'text-white');
                btnGrid.classList.remove('text-slate-700');
                btnList.classList.remove('bg-[#1e3a5f]', 'text-white');
                btnList.classList.add('text-slate-700');
                localStorage.setItem('admin_view_mode_gallery', 'grid');
            } else {
                gridEl.classList.add('hidden');
                listEl.classList.remove('hidden');
                btnList.classList.add('bg-[#1e3a5f]', 'text-white');
                btnList.classList.remove('text-slate-700');
                btnGrid.classList.remove('bg-[#1e3a5f]', 'text-white');
                btnGrid.classList.add('text-slate-700');
                localStorage.setItem('admin_view_mode_gallery', 'list');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const savedMode = localStorage.getItem('admin_view_mode_gallery') || 'grid';
            setGalleryViewMode(savedMode);
        });
    </script>
</x-admin.layout>
