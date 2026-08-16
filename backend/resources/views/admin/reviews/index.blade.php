<x-admin.layout title="Reviews">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
        <form method="GET" class="flex gap-2">
            <select name="status" onchange="this.form.submit()" class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                <option value="">All statuses</option>
                @foreach (['pending', 'approved', 'rejected'] as $status)
                    <option value="{{ $status }}" @selected(request('status') === $status)>{{ ucfirst($status) }}</option>
                @endforeach
            </select>
        </form>
        <a href="{{ route('admin.reviews.export', request()->query()) }}" class="rounded-md bg-slate-200 px-3 py-1.5 text-sm hover:bg-slate-300">
            Export CSV
        </a>
    </div>

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
                    {{ $review->customer_name }}
                    <div class="text-xs text-slate-400">{{ $review->customer_email }}</div>
                </td>
                <td class="px-4 py-2.5 text-slate-600">{{ $review->product?->title ?? '—' }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $review->rating }}/5</td>
                <td class="px-4 py-2.5 max-w-xs truncate text-slate-600" title="{{ $review->comment }}">{{ $review->comment }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $review->verified_purchase ? 'Yes' : 'No' }}</td>
                <td class="px-4 py-2.5"><x-admin.status-badge :status="$review->status" /></td>
                <td class="px-4 py-2.5 text-right whitespace-nowrap">
                    @if ($review->status !== 'approved')
                        <form method="POST" action="{{ route('admin.reviews.approve', $review) }}">
                            @csrf @method('PATCH')
                            <button type="submit" class="mr-2 text-green-600 hover:text-green-800">Approve</button>
                        </form>
                    @endif
                    @if ($review->status !== 'rejected')
                        <form method="POST" action="{{ route('admin.reviews.reject', $review) }}">
                            @csrf @method('PATCH')
                            <button type="submit" class="mr-2 text-amber-600 hover:text-amber-800">Reject</button>
                        </form>
                    @endif
                    <x-admin.delete-button :action="route('admin.reviews.destroy', $review)" confirm="Delete this review permanently?" />
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
