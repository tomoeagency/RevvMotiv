@php $product = $product ?? null; @endphp
<form method="POST" action="{{ $product ? route('admin.products.update', $product->id) : route('admin.products.store') }}" enctype="multipart/form-data" class="max-w-2xl space-y-1">
    @csrf
    @if ($product) @method('PUT') @endif

    <x-admin.form-field name="title" label="Title" required>
        <input type="text" name="title" id="title" value="{{ old('title', $product->title ?? '') }}" required
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
    </x-admin.form-field>

    <x-admin.form-field name="slug" label="Slug" hint="Leave blank to auto-generate from the title.">
        <input type="text" name="slug" id="slug" value="{{ old('slug', $product->slug ?? '') }}"
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
    </x-admin.form-field>

    <x-admin.form-field name="description" label="Description">
        <textarea name="description" id="description" rows="4"
                  class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">{{ old('description', $product->description ?? '') }}</textarea>
    </x-admin.form-field>

    <div class="grid grid-cols-2 gap-4">
        <x-admin.form-field name="price" label="Price (₹)" required>
            <input type="number" step="0.01" min="0" name="price" id="price" value="{{ old('price', $product->price ?? '') }}" required
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
        </x-admin.form-field>

        <x-admin.form-field name="compare_at_price" label="Compare-at price (₹)" hint="Optional — shown as a strikethrough sale price.">
            <input type="number" step="0.01" min="0" name="compare_at_price" id="compare_at_price" value="{{ old('compare_at_price', $product->compare_at_price ?? '') }}"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
        </x-admin.form-field>
    </div>

    <div class="grid grid-cols-2 gap-4">
        <x-admin.form-field name="cost_price" label="Cost price (₹)" hint="Internal only — never shown on the storefront. Used for profit reporting.">
            <input type="number" step="0.01" min="0" name="cost_price" id="cost_price" value="{{ old('cost_price', $product->cost_price ?? '') }}"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
        </x-admin.form-field>

        <x-admin.form-field name="stock" label="Stock" required>
            <input type="number" min="0" name="stock" id="stock" value="{{ old('stock', $product->stock ?? 0) }}" required
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
        </x-admin.form-field>
    </div>

    <div class="grid grid-cols-2 gap-4">
        <x-admin.form-field name="category_id" label="Category" required>
            <select name="category_id" id="category_id" required
                    class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                <option value="">Select a category</option>
                @foreach ($categories as $category)
                    <option value="{{ $category->id }}" @selected(old('category_id', $product->category_id ?? null) == $category->id)>
                        {{ $category->name }}
                    </option>
                @endforeach
            </select>
        </x-admin.form-field>

        <x-admin.form-field name="fitment" label="Fitment" hint="Optional — e.g. Hatchback, Sedan, Universal.">
            <input type="text" name="fitment" id="fitment" list="fitment-suggestions" value="{{ old('fitment', $product->fitment ?? '') }}" maxlength="50"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
            <datalist id="fitment-suggestions">
                <option value="Hatchback">
                <option value="Sedan">
                <option value="SUV">
                <option value="Universal">
            </datalist>
        </x-admin.form-field>
    </div>

    <div class="grid grid-cols-2 gap-4">
        <x-admin.form-field name="status" label="Status" required>
            <select name="status" id="status" required
                    class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                <option value="draft" @selected(old('status', $product->status ?? 'draft') === 'draft')>Draft</option>
                <option value="active" @selected(old('status', $product->status ?? 'draft') === 'active')>Active</option>
            </select>
        </x-admin.form-field>

        <x-admin.form-field name="featured_order" label="Featured order" hint="Lower numbers show first in the featured section.">
            <input type="number" min="0" name="featured_order" id="featured_order" value="{{ old('featured_order', $product->featured_order ?? 0) }}"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
        </x-admin.form-field>
    </div>

    <label class="mb-4 flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="is_featured" value="1" class="rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" @checked(old('is_featured', $product->is_featured ?? false))>
        Show in homepage featured section
    </label>

    @if ($product && ! empty($product->images))
        <div class="mb-4">
            <p class="mb-2 text-sm font-medium text-slate-700">Existing images</p>
            <div class="flex flex-wrap gap-3">
                @foreach ($product->images as $url)
                    <label class="relative block">
                        <img src="{{ $url }}" alt="" class="h-20 w-20 rounded object-cover">
                        <span class="mt-1 flex items-center gap-1 text-xs text-red-600">
                            <input type="checkbox" name="remove_images[]" value="{{ $url }}">
                            Remove
                        </span>
                    </label>
                @endforeach
            </div>
        </div>
    @endif

    <x-admin.form-field name="images" label="{{ $product ? 'Add images' : 'Images' }}" hint="JPG/PNG/WebP, up to 5MB each, max 6 files.">
        <input type="file" name="images[]" id="images" multiple accept="image/png,image/jpeg,image/webp"
               class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-sm hover:file:bg-slate-300">
    </x-admin.form-field>

    <div class="flex gap-3 pt-2">
        <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            {{ $product ? 'Save changes' : 'Create product' }}
        </button>
        <a href="{{ route('admin.products.index') }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
    </div>
</form>
