<x-admin.layout title="Expenses">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <form method="GET" class="flex items-center gap-2.5">
            <input type="month" name="month" value="{{ $month }}" onchange="this.form.submit()"
                   class="rounded-lg border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-800 shadow-2xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </form>

        <a href="{{ route('admin.expenses.create') }}" class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1e3a5f] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>+ New Expense</span>
        </a>
    </div>

    <!-- Monthly Summary Metric Card -->
    <div class="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-xs flex items-center justify-between">
        <div>
            <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Monthly Operating Expenses</span>
            <p class="mt-1 text-2xl font-bold font-mono text-slate-900 tabular-nums">₹{{ number_format((float) $monthlyTotal, 2) }}</p>
        </div>
        <div class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700">
            {{ \Carbon\Carbon::parse($month.'-01')->format('F Y') }}
        </div>
    </div>

    <!-- Expenses Data Table -->
    <x-admin.data-table :headers="['Date', 'Category', 'Description', 'Amount', 'Recorded By', '']" :paginator="$expenses">
        @foreach ($expenses as $expense)
            <tr class="hover:bg-slate-50/70 transition-colors">
                <td class="px-4 py-3 text-xs text-slate-700 font-medium whitespace-nowrap">{{ $expense->expense_date->format('d M Y') }}</td>
                <td class="px-4 py-3 text-xs font-semibold text-slate-900">{{ $expense->category?->name ?? '—' }}</td>
                <td class="px-4 py-3 text-xs text-slate-600 max-w-xs truncate" title="{{ $expense->description ?? '' }}">{{ $expense->description ?? '—' }}</td>
                <td class="px-4 py-3 text-xs font-bold font-mono text-slate-900 tabular-nums">₹{{ number_format((float) $expense->amount, 2) }}</td>
                <td class="px-4 py-3 text-xs text-slate-500 font-medium">{{ $expense->creator?->name ?? '—' }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                    <div class="inline-flex items-center gap-2">
                        <a href="{{ route('admin.expenses.edit', $expense) }}" 
                           class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs">
                            <x-admin.icon name="edit" class="h-3 w-3" />
                            <span>Edit</span>
                        </a>
                        <x-admin.delete-button :action="route('admin.expenses.destroy', $expense)" confirm="Delete this expense record?" />
                    </div>
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
