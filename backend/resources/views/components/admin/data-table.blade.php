@props(['headers', 'empty' => 'No records found.', 'paginator' => null])
<div class="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xs">
    <div class="overflow-x-auto">
        <table class="admin-table min-w-full divide-y divide-slate-200 text-sm">
            <thead>
                <tr class="bg-slate-50/90 border-b border-slate-200">
                    @foreach ($headers as $header)
                        <th class="whitespace-nowrap px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-slate-600">{{ $header }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                {{ $slot }}
            </tbody>
        </table>
    </div>
    @if ($slot->isEmpty())
        <div class="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
            <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <x-admin.icon name="inbox" class="h-6 w-6" />
            </div>
            <p class="text-sm font-medium text-slate-500">{{ $empty }}</p>
        </div>
    @endif
</div>
@if ($paginator)
    <div class="mt-5">
        {{ $paginator->links() }}
    </div>
@endif
