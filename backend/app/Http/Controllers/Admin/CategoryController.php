<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryStoreRequest;
use App\Http\Requests\Admin\CategoryUpdateRequest;
use App\Models\Category;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\View\View;

class CategoryController extends Controller
{
    public function index(): View
    {
        $categories = Category::withCount('products')->orderBy('name')->paginate(20);

        return view('admin.categories.index', compact('categories'));
    }

    public function create(): View
    {
        return view('admin.categories.create');
    }

    public function store(CategoryStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Category::create([
            'name' => $validated['name'],
            'slug' => ($validated['slug'] ?? null) ?: Str::slug($validated['name']),
        ]);

        return redirect()->route('admin.categories.index')->with('status', 'Category created.');
    }

    public function edit(Category $category): View
    {
        return view('admin.categories.edit', compact('category'));
    }

    public function update(CategoryUpdateRequest $request, Category $category): RedirectResponse
    {
        $validated = $request->validated();

        $category->update([
            'name' => $validated['name'],
            'slug' => ($validated['slug'] ?? null) ?: Str::slug($validated['name']),
        ]);

        return redirect()->route('admin.categories.index')->with('status', 'Category updated.');
    }

    public function destroy(Category $category): RedirectResponse
    {
        // products.category_id cascades on delete — refuse to delete a
        // category that still has products rather than silently wiping
        // them out. Admin must reassign/delete those products first.
        if ($category->products()->exists()) {
            return redirect()->route('admin.categories.index')
                ->with('status', "Can't delete \"{$category->name}\" — it still has products assigned. Move or delete them first.");
        }

        $category->delete();

        return redirect()->route('admin.categories.index')->with('status', "Category \"{$category->name}\" deleted.");
    }
}
