<x-admin.layout title="Categories">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 class="text-base font-semibold text-slate-800">Product Categories</h2>
            <p class="text-xs text-slate-500">Chassis and component category hierarchy for the storefront.</p>
        </div>

        <div class="flex items-center gap-3">
            <!-- Grid / List Toggle -->
            <div class="inline-flex items-center rounded-lg border border-slate-300 bg-white p-1 shadow-sm">
                <button type="button" id="btnListViewCategories" onclick="setCategoryViewMode('list')"
                        class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-900"
                        title="List View">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span class="hidden sm:inline">List</span>
                </button>
                <button type="button" id="btnGridViewCategories" onclick="setCategoryViewMode('grid')"
                        class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-900"
                        title="Grid View">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span class="hidden sm:inline">Grid</span>
                </button>
            </div>

            <a href="{{ route('admin.categories.create') }}" class="cursor-pointer rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d]">
                + New Category
            </a>
        </div>
    </div>

    <!-- 1. TABLE LIST VIEW -->
    <div id="categoryListView">
        <x-admin.data-table :headers="['Name', 'Slug', 'Products', '']" :paginator="$categories">
            @foreach ($categories as $category)
                <tr>
                    <td class="px-4 py-2.5 font-semibold text-slate-900">{{ $category->name }}</td>
                    <td class="px-4 py-2.5 text-slate-500 font-mono text-xs">{{ $category->slug }}</td>
                    <td class="px-4 py-2.5 text-slate-700 font-bold tabular-nums">{{ $category->products_count }} products</td>
                    <td class="px-4 py-2.5 text-right">
                        <a href="{{ route('admin.categories.edit', $category) }}" class="mr-3 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                        <x-admin.delete-button :action="route('admin.categories.destroy', $category)" confirm="Delete this category?" />
                    </td>
                </tr>
            @endforeach
        </x-admin.data-table>
    </div>

    <!-- 2. CARDS GRID VIEW -->
    <div id="categoryGridView" class="hidden">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            @foreach ($categories as $category)
                <div class="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
                    <div>
                        <div class="mb-2 flex items-center justify-between">
                            <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                                <x-admin.icon name="categories" class="h-5 w-5" />
                            </span>
                            <span class="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700 tabular-nums">
                                {{ $category->products_count }} items
                            </span>
                        </div>
                        <h3 class="text-base font-bold text-slate-900">{{ $category->name }}</h3>
                        <p class="text-xs text-slate-400 font-mono mt-0.5">{{ $category->slug }}</p>
                    </div>

                    <div class="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3 text-xs">
                        <a href="{{ route('admin.categories.edit', $category) }}" 
                           class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200">
                            <x-admin.icon name="edit" class="h-3 w-3" />
                            <span>Edit</span>
                        </a>
                        <x-admin.delete-button :action="route('admin.categories.destroy', $category)" confirm="Delete this category?" />
                    </div>
                </div>
            @endforeach
        </div>

        <div class="mt-6">
            {{ $categories->links() }}
        </div>
    </div>

    <script>
        function setCategoryViewMode(mode) {
            const listEl = document.getElementById('categoryListView');
            const gridEl = document.getElementById('categoryGridView');
            const btnList = document.getElementById('btnListViewCategories');
            const btnGrid = document.getElementById('btnGridViewCategories');

            if (mode === 'grid') {
                listEl.classList.add('hidden');
                gridEl.classList.remove('hidden');
                btnGrid.classList.add('bg-[#1e3a5f]', 'text-white');
                btnGrid.classList.remove('text-slate-700');
                btnList.classList.remove('bg-[#1e3a5f]', 'text-white');
                btnList.classList.add('text-slate-700');
                localStorage.setItem('admin_view_mode_categories', 'grid');
            } else {
                gridEl.classList.add('hidden');
                listEl.classList.remove('hidden');
                btnList.classList.add('bg-[#1e3a5f]', 'text-white');
                btnList.classList.remove('text-slate-700');
                btnGrid.classList.remove('bg-[#1e3a5f]', 'text-white');
                btnGrid.classList.add('text-slate-700');
                localStorage.setItem('admin_view_mode_categories', 'list');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const savedMode = localStorage.getItem('admin_view_mode_categories') || 'grid';
            setCategoryViewMode(savedMode);
        });
    </script>
</x-admin.layout>
