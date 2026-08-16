@php $expense = $expense ?? null; @endphp
<form method="POST" action="{{ $expense ? route('admin.expenses.update', $expense) : route('admin.expenses.store') }}" class="max-w-md space-y-1">
    @csrf
    @if ($expense) @method('PUT') @endif

    <x-admin.form-field name="category_id" label="Category" required>
        <select name="category_id" id="category_id" required
                onchange="document.getElementById('new_category_field').classList.toggle('hidden', this.value !== '__new__')"
                class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
            @foreach ($categories as $category)
                <option value="{{ $category->id }}" @selected(old('category_id', $expense->category_id ?? '') == $category->id)>{{ $category->name }}</option>
            @endforeach
            <option value="__new__" @selected(old('category_id') === '__new__')>+ Add new category</option>
        </select>
    </x-admin.form-field>

    <div id="new_category_field" class="{{ old('category_id') === '__new__' ? '' : 'hidden' }}">
        <x-admin.form-field name="new_category_name" label="New category name">
            <input type="text" name="new_category_name" id="new_category_name" value="{{ old('new_category_name') }}" maxlength="255"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
        </x-admin.form-field>
    </div>

    <x-admin.form-field name="expense_date" label="Date" required>
        <input type="date" name="expense_date" id="expense_date" value="{{ old('expense_date', $expense?->expense_date?->format('Y-m-d') ?? now()->format('Y-m-d')) }}" required
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
    </x-admin.form-field>

    <x-admin.form-field name="amount" label="Amount (₹)" required>
        <input type="number" step="0.01" min="0" name="amount" id="amount" value="{{ old('amount', $expense->amount ?? '') }}" required
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
    </x-admin.form-field>

    <x-admin.form-field name="description" label="Description" hint="Optional note.">
        <input type="text" name="description" id="description" value="{{ old('description', $expense->description ?? '') }}"
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
    </x-admin.form-field>

    <div class="flex gap-3 pt-2">
        <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            {{ $expense ? 'Save changes' : 'Add expense' }}
        </button>
        <a href="{{ route('admin.expenses.index') }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
    </div>
</form>
