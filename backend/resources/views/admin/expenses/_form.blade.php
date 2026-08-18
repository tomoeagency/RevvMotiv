@php $expense = $expense ?? null; @endphp
<form method="POST" action="{{ $expense ? route('admin.expenses.update', $expense) : route('admin.expenses.store') }}" class="space-y-6 max-w-xl">
    @csrf
    @if ($expense) @method('PUT') @endif

    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Expense Record Details
        </h2>

        <x-admin.form-field name="category_id" label="Expense Category" required>
            <select name="category_id" id="category_id" required
                    onchange="document.getElementById('new_category_field').classList.toggle('hidden', this.value !== '__new__')"
                    class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                @foreach ($categories as $category)
                    <option value="{{ $category->id }}" @selected(old('category_id', $expense->category_id ?? '') == $category->id)>{{ $category->name }}</option>
                @endforeach
                <option value="__new__" @selected(old('category_id') === '__new__')>+ Create new expense category</option>
            </select>
        </x-admin.form-field>

        <div id="new_category_field" class="{{ old('category_id') === '__new__' ? '' : 'hidden' }}">
            <x-admin.form-field name="new_category_name" label="New Category Name">
                <input type="text" name="new_category_name" id="new_category_name" value="{{ old('new_category_name') }}" maxlength="255" placeholder="e.g. Packaging Materials"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <x-admin.form-field name="expense_date" label="Date of Expense" required>
                <input type="date" name="expense_date" id="expense_date" value="{{ old('expense_date', $expense?->expense_date?->format('Y-m-d') ?? now()->format('Y-m-d')) }}" required
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>

            <x-admin.form-field name="amount" label="Expense Amount (₹)" required>
                <input type="number" step="0.01" min="0" name="amount" id="amount" value="{{ old('amount', $expense->amount ?? '') }}" required placeholder="1500.00"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>
        </div>

        <x-admin.form-field name="description" label="Notes / Invoice Reference" hint="Optional memo for accounting records.">
            <input type="text" name="description" id="description" value="{{ old('description', $expense->description ?? '') }}" placeholder="e.g. Shipping cartons and bubble wrap bundle"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>
    </div>

    <!-- Actions Deck -->
    <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>{{ $expense ? 'Save Changes' : 'Add Expense' }}</span>
        </button>
        <a href="{{ route('admin.expenses.index') }}" class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
            Cancel
        </a>
    </div>
</form>
