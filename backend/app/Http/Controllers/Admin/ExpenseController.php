<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ExpenseStoreRequest;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\View\View;

class ExpenseController extends Controller
{
    public function index(Request $request): View
    {
        $month = $request->string('month')->toString() ?: now()->format('Y-m');

        $expenses = Expense::query()
            ->with('category')
            ->whereYear('expense_date', substr($month, 0, 4))
            ->whereMonth('expense_date', substr($month, 5, 2))
            ->orderByDesc('expense_date')
            ->paginate(20)
            ->withQueryString();

        $monthlyTotal = Expense::query()
            ->whereYear('expense_date', substr($month, 0, 4))
            ->whereMonth('expense_date', substr($month, 5, 2))
            ->sum('amount');

        return view('admin.expenses.index', compact('expenses', 'month', 'monthlyTotal'));
    }

    public function create(): View
    {
        $categories = ExpenseCategory::orderBy('name')->get();

        return view('admin.expenses.create', compact('categories'));
    }

    public function store(ExpenseStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['category_id'] = $this->resolveCategoryId($validated);
        $validated['created_by'] = Auth::id();
        unset($validated['new_category_name']);

        Expense::create($validated);

        return redirect()->route('admin.expenses.index')->with('status', 'Expense recorded.');
    }

    public function edit(Expense $expense): View
    {
        $categories = ExpenseCategory::orderBy('name')->get();

        return view('admin.expenses.edit', compact('expense', 'categories'));
    }

    public function update(ExpenseStoreRequest $request, Expense $expense): RedirectResponse
    {
        $validated = $request->validated();
        $validated['category_id'] = $this->resolveCategoryId($validated);
        unset($validated['new_category_name']);

        $expense->update($validated);

        return redirect()->route('admin.expenses.index')->with('status', 'Expense updated.');
    }

    public function destroy(Expense $expense): RedirectResponse
    {
        $expense->delete();

        return redirect()->route('admin.expenses.index')->with('status', 'Expense deleted.');
    }

    // Resolves the "+ Add new category" sentinel into a real category,
    // reusing an existing one by slug if the admin types a name that
    // already exists (case-insensitively) rather than creating a duplicate.
    private function resolveCategoryId(array $validated): int
    {
        if ($validated['category_id'] !== '__new__') {
            return (int) $validated['category_id'];
        }

        $name = trim($validated['new_category_name']);

        $category = ExpenseCategory::firstOrCreate(
            ['slug' => Str::slug($name)],
            ['name' => $name]
        );

        return $category->id;
    }
}
