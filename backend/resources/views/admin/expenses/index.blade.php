<x-admin.layout title="Expenses">
    <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
        <form method="GET" class="flex items-center gap-2">
            <input type="month" name="month" value="{{ $month }}" onchange="this.form.submit()"
                   class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
        </form>
        <a href="{{ route('admin.expenses.create') }}" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            + New Expense
        </a>
    </div>

    <div class="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p class="text-sm text-slate-500">Total for {{ \Carbon\Carbon::parse($month.'-01')->format('F Y') }}</p>
        <p class="mt-1 text-2xl font-semibold">₹{{ number_format((float) $monthlyTotal, 2) }}</p>
    </div>

    <x-admin.data-table :headers="['Date', 'Category', 'Description', 'Amount', 'Recorded by', '']" :paginator="$expenses">
        @foreach ($expenses as $expense)
            <tr>
                <td class="px-4 py-2.5 text-slate-600">{{ $expense->expense_date->format('d M Y') }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $expense->category?->name ?? '—' }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $expense->description ?? '—' }}</td>
                <td class="px-4 py-2.5 text-slate-900">₹{{ number_format((float) $expense->amount, 2) }}</td>
                <td class="px-4 py-2.5 text-slate-500">{{ $expense->creator?->name ?? '—' }}</td>
                <td class="px-4 py-2.5 text-right">
                    <a href="{{ route('admin.expenses.edit', $expense) }}" class="mr-3 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                    <x-admin.delete-button :action="route('admin.expenses.destroy', $expense)" confirm="Delete this expense?" />
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
