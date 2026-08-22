<x-admin.layout title="Products">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <!-- Search & Filters -->
        <form method="GET" class="flex flex-wrap items-center gap-2">
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Search products..."
                   class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
            <select name="status" class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                <option value="">All statuses</option>
                <option value="active" @selected(request('status') === 'active')>Active</option>
                <option value="draft" @selected(request('status') === 'draft')>Draft</option>
            </select>
            <select name="category" class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                <option value="">All categories</option>
                @foreach ($categories as $category)
                    <option value="{{ $category->id }}" @selected((int) request('category') === $category->id)>{{ $category->name }}</option>
                @endforeach
            </select>
            <button type="submit" class="rounded-md bg-slate-200 px-3.5 py-1.5 text-sm font-medium hover:bg-slate-300">Filter</button>
        </form>

        <!-- Right Side: View Mode Toggle & New Product Button -->
        <div class="flex items-center gap-3">
            <!-- Grid / List View Segmented Toggle -->
            <div class="inline-flex items-center rounded-lg border border-slate-300 bg-white p-1 shadow-sm">
                <button type="button" id="btnListView" onclick="setViewMode('list')"
                        class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-900"
                        title="List View">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span class="hidden sm:inline">List</span>
                </button>
                <button type="button" id="btnGridView" onclick="setViewMode('grid')"
                        class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-900"
                        title="Grid View">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span class="hidden sm:inline">Grid</span>
                </button>
            </div>

            <a href="{{ route('admin.products.create') }}" class="cursor-pointer rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d]">
                + New Product
            </a>
        </div>
    </div>

    <!-- 1. LIST / TABLE VIEW CONTAINER -->
    <div id="listViewContainer">
        <x-admin.data-table :headers="['Product', 'Category', 'Price', 'Stock', 'Featured', 'Status', '']" :paginator="$products">
            @foreach ($products as $product)
                <tr>
                    <td class="flex items-center gap-3 px-4 py-2.5">
                        @if ($product->images[0] ?? null)
                            <img src="{{ $product->images[0] }}" alt="" class="h-10 w-10 rounded object-cover">
                        @else
                            <div class="h-10 w-10 rounded bg-slate-100"></div>
                        @endif
                        <span class="font-medium text-slate-900">{{ $product->title }}</span>
                    </td>
                    <td class="px-4 py-2.5 text-slate-600">{{ $product->category?->name ?? '—' }}</td>
                    <td class="px-4 py-2.5 font-medium text-slate-900 tabular-nums">₹{{ number_format((float) $product->price, 2) }}</td>
                    <td class="px-4 py-2.5">
                        <span class="{{ $product->stock < 5 ? 'font-semibold text-red-600' : 'text-slate-600' }}">
                            {{ $product->stock }}
                        </span>
                    </td>
                    <td class="px-4 py-2.5 text-slate-600">{{ $product->is_featured ? 'Yes' : 'No' }}</td>
                    <td class="px-4 py-2.5"><x-admin.status-badge :status="$product->status" /></td>
                    <td class="px-4 py-2.5 text-right">
                        <a href="{{ route('admin.products.edit', $product->id) . (request()->getQueryString() ? '?qs=' . urlencode(request()->getQueryString()) : '') }}" class="mr-3 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                        <x-admin.delete-button :action="route('admin.products.destroy', $product->id)" confirm="Delete this product? This cannot be undone." />
                    </td>
                </tr>
            @endforeach
        </x-admin.data-table>
    </div>

    <!-- 2. GRID / CARDS VIEW CONTAINER -->
    <div id="gridViewContainer" class="hidden">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            @foreach ($products as $product)
                <div class="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
                    <!-- Product Image & Floating Badges -->
                    <div class="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
                        @if ($product->images[0] ?? null)
                            <img src="{{ $product->images[0] }}" alt="{{ $product->title }}"
                                 class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105">
                        @else
                            <div class="flex h-full w-full items-center justify-center text-slate-400">
                                <svg class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                        @endif

                        <!-- Top Badges -->
                        <div class="absolute inset-x-2.5 top-2.5 flex items-center justify-between gap-1.5">
                            @if ($product->category)
                                <span class="rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                                    {{ $product->category->name }}
                                </span>
                            @else
                                <span></span>
                            @endif

                            @if ($product->is_featured)
                                <span class="flex items-center gap-1 rounded-md bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm backdrop-blur-sm">
                                    <svg class="w-3 h-3 fill-current text-white" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                    Featured
                                </span>
                            @endif
                        </div>
                    </div>

                    <!-- Card Body -->
                    <div class="flex flex-1 flex-col p-4">
                        <div class="mb-2 flex items-baseline justify-between gap-2">
                            <span class="text-base font-bold text-slate-900 tabular-nums">
                                ₹{{ number_format((float) $product->price, 2) }}
                            </span>
                            <span class="text-xs font-semibold {{ $product->stock <= 0 ? 'text-red-600' : ($product->stock < 5 ? 'text-amber-600' : 'text-slate-500') }}">
                                {{ $product->stock <= 0 ? 'Out of stock' : $product->stock . ' in stock' }}
                            </span>
                        </div>

                        <h3 class="mb-3 line-clamp-2 text-sm font-semibold text-slate-800" title="{{ $product->title }}">
                            {{ $product->title }}
                        </h3>

                        <!-- Bottom Card Actions -->
                        <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                            <x-admin.status-badge :status="$product->status" />

                            <div class="flex items-center gap-2">
                                <a href="{{ route('admin.products.edit', $product->id) . (request()->getQueryString() ? '?qs=' . urlencode(request()->getQueryString()) : '') }}" 
                                   class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200">
                                    <x-admin.icon name="edit" class="h-3 w-3" />
                                    <span>Edit</span>
                                </a>
                                <x-admin.delete-button :action="route('admin.products.destroy', $product->id)" confirm="Delete this product? This cannot be undone." />
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <!-- Pagination for Grid Mode -->
        <div class="mt-6">
            {{ $products->links() }}
        </div>
    </div>

    <!-- Client-side View Mode Persisted Toggle Script -->
    <script>
        function setViewMode(mode) {
            const listEl = document.getElementById('listViewContainer');
            const gridEl = document.getElementById('gridViewContainer');
            const btnList = document.getElementById('btnListView');
            const btnGrid = document.getElementById('btnGridView');

            if (mode === 'grid') {
                listEl.classList.add('hidden');
                gridEl.classList.remove('hidden');
                btnGrid.classList.add('bg-[#1e3a5f]', 'text-white');
                btnGrid.classList.remove('text-slate-700');
                btnList.classList.remove('bg-[#1e3a5f]', 'text-white');
                btnList.classList.add('text-slate-700');
                localStorage.setItem('admin_view_mode_products', 'grid');
            } else {
                gridEl.classList.add('hidden');
                listEl.classList.remove('hidden');
                btnList.classList.add('bg-[#1e3a5f]', 'text-white');
                btnList.classList.remove('text-slate-700');
                btnGrid.classList.remove('bg-[#1e3a5f]', 'text-white');
                btnGrid.classList.add('text-slate-700');
                localStorage.setItem('admin_view_mode_products', 'list');
            }
        }

        // Initialize based on saved preference (default is 'grid' for modern visual workflow)
        document.addEventListener('DOMContentLoaded', () => {
            const savedMode = localStorage.getItem('admin_view_mode_products') || 'grid';
            setViewMode(savedMode);
        });
    </script>
</x-admin.layout>
