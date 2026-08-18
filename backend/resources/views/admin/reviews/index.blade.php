<x-admin.layout title="Reviews">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
            <form method="GET" class="flex gap-2">
                <select name="status" onchange="this.form.submit()" class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                    <option value="">All statuses</option>
                    @foreach (['pending', 'approved', 'rejected'] as $status)
                        <option value="{{ $status }}" @selected(request('status') === $status)>{{ ucfirst($status) }}</option>
                    @endforeach
                </select>
            </form>
            <a href="{{ route('admin.reviews.export', request()->query()) }}" class="rounded-md bg-slate-200 px-3 py-1.5 text-sm font-medium hover:bg-slate-300">
                Export CSV
            </a>
        </div>

        <!-- Grid / List Toggle -->
        <div class="inline-flex items-center rounded-lg border border-slate-300 bg-white p-1 shadow-sm">
            <button type="button" id="btnListViewReviews" onclick="setReviewViewMode('list')"
                    class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-900"
                    title="List View">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span class="hidden sm:inline">List</span>
            </button>
            <button type="button" id="btnGridViewReviews" onclick="setReviewViewMode('grid')"
                    class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-900"
                    title="Grid View">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                <span class="hidden sm:inline">Grid</span>
            </button>
        </div>
    </div>

    <!-- 1. TABLE LIST VIEW -->
    <div id="reviewListView">
        <x-admin.data-table :headers="['Media', 'Customer', 'Product', 'Rating', 'Comment', 'Verified', 'Status', '']" :paginator="$reviews">
            @foreach ($reviews as $review)
                <tr>
                    <td class="px-4 py-2.5">
                        @if (! empty($review->media_urls))
                            <div class="flex gap-1">
                                @foreach (array_slice($review->media_urls, 0, 3) as $url)
                                    @if (str_contains($url, '/video/'))
                                        <video src="{{ $url }}" class="h-10 w-10 rounded object-cover" muted></video>
                                    @else
                                        <img src="{{ $url }}" alt="" class="h-10 w-10 rounded object-cover">
                                    @endif
                                @endforeach
                            </div>
                        @else
                            <span class="text-xs text-slate-400">None</span>
                        @endif
                    </td>
                    <td class="px-4 py-2.5 text-slate-600">
                        <span class="font-medium text-slate-900">{{ $review->customer_name }}</span>
                        <div class="text-xs text-slate-400">{{ $review->customer_email }}</div>
                    </td>
                    <td class="px-4 py-2.5 text-slate-600">{{ $review->product?->title ?? '—' }}</td>
                    <td class="px-4 py-2.5 text-amber-500 font-bold">★ {{ $review->rating }}/5</td>
                    <td class="px-4 py-2.5 max-w-xs truncate text-slate-600" title="{{ $review->comment }}">{{ $review->comment }}</td>
                    <td class="px-4 py-2.5 text-slate-600">{{ $review->verified_purchase ? 'Yes' : 'No' }}</td>
                    <td class="px-4 py-2.5"><x-admin.status-badge :status="$review->status" /></td>
                    <td class="px-4 py-2.5 text-right whitespace-nowrap">
                        <div class="inline-flex items-center gap-2">
                            @if ($review->status !== 'approved')
                                <form method="POST" action="{{ route('admin.reviews.approve', $review) }}" class="inline">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="text-xs font-semibold text-emerald-600 hover:text-emerald-800">Approve</button>
                                </form>
                            @endif
                            @if ($review->status !== 'rejected')
                                <form method="POST" action="{{ route('admin.reviews.reject', $review) }}" class="inline">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="text-xs font-semibold text-amber-600 hover:text-amber-800">Reject</button>
                                </form>
                            @endif
                            <x-admin.delete-button :action="route('admin.reviews.destroy', $review)" confirm="Delete this review permanently?" />
                        </div>
                    </td>
                </tr>
            @endforeach
        </x-admin.data-table>
    </div>

    <!-- 2. CARDS GRID VIEW -->
    <div id="reviewGridView" class="hidden">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            @foreach ($reviews as $review)
                <div class="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                    <!-- Top Info -->
                    <div class="mb-3 flex items-start justify-between gap-2">
                        <div>
                            <div class="flex items-center gap-1.5">
                                <span class="font-bold text-slate-900 text-sm">{{ $review->customer_name }}</span>
                                @if ($review->verified_purchase)
                                    <span class="rounded bg-emerald-100 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700">Verified</span>
                                @endif
                            </div>
                            <span class="text-xs text-slate-400">{{ $review->customer_email }}</span>
                        </div>
                        <x-admin.status-badge :status="$review->status" />
                    </div>

                    <!-- Rating Stars & Product -->
                    <div class="mb-2 flex items-center justify-between text-xs">
                        <span class="font-bold text-amber-500">
                            {{ str_repeat('★', $review->rating) }}{{ str_repeat('☆', 5 - $review->rating) }}
                        </span>
                        <span class="font-medium text-slate-500 truncate max-w-[150px]">{{ $review->product?->title ?? 'General Review' }}</span>
                    </div>

                    <!-- Review Comment -->
                    <p class="mb-3 text-xs leading-relaxed text-slate-700 line-clamp-3">
                        "{{ $review->comment }}"
                    </p>

                    <!-- Media Thumbnails (if attached) -->
                    @if (! empty($review->media_urls))
                        <div class="mb-3 flex gap-2 overflow-x-auto">
                            @foreach (array_slice($review->media_urls, 0, 3) as $url)
                                <img src="{{ $url }}" alt="Review photo" class="h-14 w-14 rounded-lg object-cover border border-slate-200 flex-none">
                            @endforeach
                        </div>
                    @endif

                    <!-- Bottom Action Controls -->
                    <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                        <span class="text-[11px] text-slate-400">{{ $review->created_at->format('d M Y') }}</span>
                        <div class="flex items-center gap-2">
                            @if ($review->status !== 'approved')
                                <form method="POST" action="{{ route('admin.reviews.approve', $review) }}" class="inline">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="rounded bg-emerald-50 px-2 py-1 font-semibold text-emerald-700 hover:bg-emerald-100">Approve</button>
                                </form>
                            @endif
                            @if ($review->status !== 'rejected')
                                <form method="POST" action="{{ route('admin.reviews.reject', $review) }}" class="inline">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="rounded bg-amber-50 px-2 py-1 font-semibold text-amber-700 hover:bg-amber-100">Reject</button>
                                </form>
                            @endif
                            <x-admin.delete-button :action="route('admin.reviews.destroy', $review)" confirm="Delete this review permanently?" />
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="mt-6">
            {{ $reviews->links() }}
        </div>
    </div>

    <script>
        function setReviewViewMode(mode) {
            const listEl = document.getElementById('reviewListView');
            const gridEl = document.getElementById('reviewGridView');
            const btnList = document.getElementById('btnListViewReviews');
            const btnGrid = document.getElementById('btnGridViewReviews');

            if (mode === 'grid') {
                listEl.classList.add('hidden');
                gridEl.classList.remove('hidden');
                btnGrid.classList.add('bg-[#1e3a5f]', 'text-white');
                btnGrid.classList.remove('text-slate-700');
                btnList.classList.remove('bg-[#1e3a5f]', 'text-white');
                btnList.classList.add('text-slate-700');
                localStorage.setItem('admin_view_mode_reviews', 'grid');
            } else {
                gridEl.classList.add('hidden');
                listEl.classList.remove('hidden');
                btnList.classList.add('bg-[#1e3a5f]', 'text-white');
                btnList.classList.remove('text-slate-700');
                btnGrid.classList.remove('bg-[#1e3a5f]', 'text-white');
                btnGrid.classList.add('text-slate-700');
                localStorage.setItem('admin_view_mode_reviews', 'list');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const savedMode = localStorage.getItem('admin_view_mode_reviews') || 'grid';
            setReviewViewMode(savedMode);
        });
    </script>
</x-admin.layout>
