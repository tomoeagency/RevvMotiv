<x-admin.layout title="Reviews Moderation">
    <!-- Header Controls & View Switcher -->
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3">
            <form method="GET" class="flex gap-2">
                <select name="status" onchange="this.form.submit()"
                        class="rounded-lg border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                    <option value="">All moderation statuses</option>
                    @foreach (['pending', 'approved', 'rejected'] as $status)
                        <option value="{{ $status }}" @selected(request('status') === $status)>{{ ucfirst($status) }}</option>
                    @endforeach
                </select>
            </form>
            <a href="{{ route('admin.reviews.export', request()->query()) }}" 
               class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
                <svg class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export CSV</span>
            </a>
        </div>

        <!-- Grid / List Toggle -->
        <div class="inline-flex items-center rounded-lg border border-slate-300 bg-white p-1 shadow-2xs">
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
                <tr class="hover:bg-slate-50/70 transition-colors">
                    <td class="px-4 py-3 w-24">
                        @if (! empty($review->media_urls))
                            <div class="flex items-center -space-x-2">
                                @foreach (array_slice($review->media_urls, 0, 2) as $url)
                                    @if (str_contains($url, '/video/'))
                                        <video src="{{ $url }}" class="h-8 w-8 rounded-lg object-cover ring-2 ring-white border border-slate-200 shadow-2xs" muted></video>
                                    @else
                                        <img src="{{ $url }}" alt="" class="h-8 w-8 rounded-lg object-cover ring-2 ring-white border border-slate-200 shadow-2xs">
                                    @endif
                                @endforeach
                                @if (count($review->media_urls) > 2)
                                    <span class="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-[10px] font-bold text-white ring-2 ring-white shadow-2xs">
                                        +{{ count($review->media_urls) - 2 }}
                                    </span>
                                @endif
                            </div>
                        @else
                            <span class="text-xs text-slate-400">No media</span>
                        @endif
                    </td>
                    <td class="px-4 py-3 min-w-[160px]">
                        <span class="font-bold text-slate-900 block text-xs whitespace-nowrap">{{ $review->customer_name }}</span>
                        <span class="text-[11px] text-slate-400 font-mono block whitespace-nowrap">{{ $review->customer_email }}</span>
                    </td>
                    <td class="px-4 py-3 text-xs font-medium text-slate-700 max-w-[180px] truncate" title="{{ $review->product?->title ?? '—' }}">
                        {{ $review->product?->title ?? '—' }}
                    </td>
                    <td class="px-4 py-3 text-amber-500 font-bold font-mono text-xs whitespace-nowrap">
                        <div class="flex items-center gap-0.5">
                            @for ($s = 1; $s <= 5; $s++)
                                <svg class="w-3.5 h-3.5 {{ $s <= $review->rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200' }}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                            @endfor
                        </div>
                    </td>
                    <td class="px-4 py-3 max-w-xs truncate text-xs text-slate-600" title="{{ $review->comment }}">
                        {{ $review->comment }}
                    </td>
                    <td class="px-4 py-3 text-xs">
                        @if ($review->verified_purchase)
                            <span class="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">Verified</span>
                        @else
                            <span class="text-slate-400 text-xs">No</span>
                        @endif
                    </td>
                    <td class="px-4 py-3"><x-admin.status-badge :status="$review->status" /></td>
                    <td class="px-4 py-3 text-right whitespace-nowrap">
                        <div class="inline-flex items-center gap-2">
                            @if ($review->status !== 'approved')
                                <form method="POST" action="{{ route('admin.reviews.approve', $review) }}" class="inline">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer">
                                        Approve
                                    </button>
                                </form>
                            @endif
                            @if ($review->status !== 'rejected')
                                <form method="POST" action="{{ route('admin.reviews.reject', $review) }}" class="inline">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="rounded-md bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100 border border-amber-200 transition-all cursor-pointer">
                                        Reject
                                    </button>
                                </form>
                            @endif
                            <x-admin.delete-button :action="route('admin.reviews.destroy', $review)" confirm="Delete this customer review permanently?" />
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
                <div class="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md">
                    <div>
                        <!-- Top Info Bar -->
                        <div class="mb-3 flex items-start justify-between gap-2">
                            <div>
                                <div class="flex items-center gap-1.5">
                                    <span class="font-bold text-slate-900 text-xs">{{ $review->customer_name }}</span>
                                    @if ($review->verified_purchase)
                                        <span class="rounded bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 border border-emerald-200">Verified Driver</span>
                                    @endif
                                </div>
                                <span class="text-[11px] text-slate-400 font-mono">{{ $review->customer_email }}</span>
                            </div>
                            <x-admin.status-badge :status="$review->status" />
                        </div>

                        <!-- Rating Stars & Product -->
                        <div class="mb-2 flex items-center justify-between text-xs">
                            <div class="flex items-center gap-0.5">
                                @for ($s = 1; $s <= 5; $s++)
                                    <svg class="w-3.5 h-3.5 {{ $s <= $review->rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200' }}" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                                @endfor
                            </div>
                            <span class="font-medium text-slate-500 truncate max-w-[140px] text-[11px]">{{ $review->product?->title ?? 'General Review' }}</span>
                        </div>

                        <!-- Review Comment -->
                        <p class="mb-3 text-xs leading-relaxed text-slate-700 line-clamp-3">
                            &ldquo;{{ $review->comment }}&rdquo;
                        </p>

                        <!-- Media Thumbnails (if attached) -->
                        @if (! empty($review->media_urls))
                            <div class="mb-3 flex gap-2 overflow-x-auto">
                                @foreach (array_slice($review->media_urls, 0, 3) as $url)
                                    <img src="{{ $url }}" alt="Review photo" class="h-12 w-12 rounded-lg object-cover border border-slate-200 flex-none shadow-2xs">
                                @endforeach
                            </div>
                        @endif
                    </div>

                    <!-- Bottom Action Controls -->
                    <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                        <span class="text-[11px] text-slate-400 font-medium">{{ $review->created_at->format('d M Y') }}</span>
                        <div class="flex items-center gap-1.5">
                            @if ($review->status !== 'approved')
                                <form method="POST" action="{{ route('admin.reviews.approve', $review) }}" class="inline">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-all cursor-pointer">
                                        Approve
                                    </button>
                                </form>
                            @endif
                            @if ($review->status !== 'rejected')
                                <form method="POST" action="{{ route('admin.reviews.reject', $review) }}" class="inline">
                                    @csrf @method('PATCH')
                                    <button type="submit" class="rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 hover:bg-amber-100 border border-amber-200 transition-all cursor-pointer">
                                        Reject
                                    </button>
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
