@props(['headers', 'empty' => 'No records found.', 'paginator' => null])
<div class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    <div class="overflow-x-auto">
        <table class="admin-table min-w-full divide-y divide-slate-200 text-sm">
            <thead class="bg-slate-50">
                <tr>
                    @foreach ($headers as $header)
                        <th class="whitespace-nowrap px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{{ $header }}</th>
                    @endforeach
                </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
                {{ $slot }}
            </tbody>
        </table>
    </div>
    @if ($slot->isEmpty())
        <div class="flex flex-col items-center gap-2 px-4 py-12 text-center">
            <x-admin.icon name="inbox" class="h-8 w-8 text-slate-300" />
            <p class="text-sm text-slate-500">{{ $empty }}</p>
        </div>
    @endif
</div>
@if ($paginator)
    <div class="mt-4">
        {{ $paginator->links() }}
    </div>
@endif
