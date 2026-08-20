@php $product = $product ?? null; @endphp
<form method="POST" action="{{ $product ? route('admin.products.update', $product->id) : route('admin.products.store') }}" enctype="multipart/form-data" class="space-y-6 max-w-3xl">
    @csrf
    @if ($product) @method('PUT') @endif

    <!-- Card 1: Product Basics -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Product Information
        </h2>

        <x-admin.form-field name="title" label="Product Title" required>
            <input type="text" name="title" id="title" value="{{ old('title', $product->title ?? '') }}" required placeholder="e.g. Maruti Swift Carbon Fiber Front Lip"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>

        <x-admin.form-field name="slug" label="URL Slug" hint="Leave blank to automatically generate from title.">
            <input type="text" name="slug" id="slug" value="{{ old('slug', $product->slug ?? '') }}" placeholder="maruti-swift-carbon-fiber-front-lip"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono text-xs shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>

        <x-admin.form-field name="description" label="Description">
            <textarea name="description" id="description" rows="4" placeholder="Detailed product specifications, materials, fitment guidance, and package contents..."
                      class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">{{ old('description', $product->description ?? '') }}</textarea>
        </x-admin.form-field>
    </div>

    <!-- Card 2: Pricing & Inventory -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Pricing & Stock
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <x-admin.form-field name="price" label="Selling Price (₹)" required>
                <input type="number" step="0.01" min="0" name="price" id="price" value="{{ old('price', $product->price ?? '') }}" required placeholder="4999.00"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>

            <x-admin.form-field name="compare_at_price" label="Compare-At / MRP (₹)" hint="Shown with strikethrough as original price.">
                <input type="number" step="0.01" min="0" name="compare_at_price" id="compare_at_price" value="{{ old('compare_at_price', $product->compare_at_price ?? '') }}" placeholder="6499.00"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <x-admin.form-field name="cost_price" label="Cost Price (₹)" hint="Internal cost for net profit calculation.">
                <input type="number" step="0.01" min="0" name="cost_price" id="cost_price" value="{{ old('cost_price', $product->cost_price ?? '') }}" placeholder="2800.00"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>

            <x-admin.form-field name="stock" label="Stock Quantity (Units)" required>
                <input type="number" min="0" name="stock" id="stock" value="{{ old('stock', $product->stock ?? 0) }}" required placeholder="10"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>
        </div>
    </div>

    <!-- Card 3: Categorization & Status -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Organization & Visibility
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <x-admin.form-field name="category_id" label="Category" required>
                <select name="category_id" id="category_id" required
                        class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                    <option value="">Select a category</option>
                    @foreach ($categories as $category)
                        <option value="{{ $category->id }}" @selected(old('category_id', $product->category_id ?? null) == $category->id)>
                            {{ $category->name }}
                        </option>
                    @endforeach
                </select>
            </x-admin.form-field>

            <x-admin.form-field name="fitment" label="Vehicle Fitment" hint="e.g. Hatchback, Sedan, SUV, Universal">
                <input type="text" name="fitment" id="fitment" list="fitment-suggestions" value="{{ old('fitment', $product->fitment ?? '') }}" maxlength="50" placeholder="e.g. Maruti Suzuki Swift 2018-2024"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                <datalist id="fitment-suggestions">
                    <option value="Hatchback">
                    <option value="Sedan">
                    <option value="SUV">
                    <option value="Universal">
                </datalist>
            </x-admin.form-field>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <x-admin.form-field name="status" label="Publish Status" required>
                <select name="status" id="status" required
                        class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                    <option value="draft" @selected(old('status', $product->status ?? 'draft') === 'draft')>Draft (Hidden)</option>
                    <option value="active" @selected(old('status', $product->status ?? 'draft') === 'active')>Active (Published)</option>
                </select>
            </x-admin.form-field>

            <x-admin.form-field name="featured_order" label="Featured Display Order" hint="Lower numbers appear first.">
                <input type="number" min="0" name="featured_order" id="featured_order" value="{{ old('featured_order', $product->featured_order ?? 0) }}"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>
        </div>

        <div class="pt-2">
            <label class="inline-flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input type="checkbox" name="is_featured" value="1" class="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500" @checked(old('is_featured', $product->is_featured ?? false))>
                <span>Pin to homepage featured carousel</span>
            </label>
        </div>
    </div>

    <!-- Card 4: Photos & Gallery -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Product Images
        </h2>

        @if ($product && ! empty($product->images))
            <div>
                <p class="text-xs font-bold text-slate-700 mb-2">Current Photos</p>
                <div class="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    @foreach ($product->images as $url)
                        <div class="relative group rounded-lg border border-slate-200 bg-slate-50 p-1 overflow-hidden shadow-2xs">
                            <img src="{{ $url }}" alt="" class="aspect-square w-full rounded object-cover">
                            <label class="mt-1.5 flex items-center justify-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-800 cursor-pointer">
                                <input type="checkbox" name="remove_images[]" value="{{ $url }}" class="rounded border-slate-300 text-rose-600 focus:ring-rose-500">
                                <span>Delete</span>
                            </label>
                        </div>
                    @endforeach
                </div>
            </div>
        @endif

        <x-admin.form-field name="images" label="{{ $product ? 'Upload Additional Photos' : 'Upload Photos' }}" hint="JPG, PNG, WEBP — up to 5MB each (Max 6 photos).">
            <input type="file" name="images[]" id="images" multiple accept="image/png,image/jpeg,image/webp"
                   class="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3.5 file:py-2 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 cursor-pointer">
        </x-admin.form-field>
    </div>

    <!-- Card 5: Product Variants -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">
                    Product Variants (Optional)
                </h2>
                <p class="text-xs text-slate-500 mt-0.5">
                    Add material options, colors, or sizes (e.g. Gloss Black, 2x2 Twill Carbon, Forged Carbon).
                </p>
            </div>
            <button type="button" onclick="addVariantRow()" class="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors cursor-pointer">
                <svg class="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Add Variant</span>
            </button>
        </div>

        <div id="variants-container" class="space-y-4">
            @php
                $existingVariants = old('variants', $product ? $product->variants->toArray() : []);
            @endphp

            @if (!empty($existingVariants))
                @foreach ($existingVariants as $idx => $v)
                    <div class="variant-row rounded-lg border border-slate-200 bg-slate-50/70 p-4 relative space-y-3" data-index="{{ $idx }}">
                        @if (!empty($v['id']))
                            <input type="hidden" name="variants[{{ $idx }}][id]" value="{{ $v['id'] }}">
                        @endif

                        <div class="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                            <span class="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider">
                                Variant #<span class="variant-num">{{ $loop->iteration }}</span>
                            </span>
                            <button type="button" onclick="removeVariantRow(this, {{ $v['id'] ?? 'null' }})" class="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer">
                                Remove
                            </button>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Variant Name <span class="text-rose-500">*</span></label>
                                <input type="text" name="variants[{{ $idx }}][name]" value="{{ $v['name'] ?? '' }}" required placeholder="e.g. 2x2 Twill Carbon Fiber"
                                       class="block w-full rounded-md border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-2xs focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">SKU</label>
                                <input type="text" name="variants[{{ $idx }}][sku]" value="{{ $v['sku'] ?? '' }}" placeholder="RM-SPL-CF"
                                       class="block w-full rounded-md border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono shadow-2xs focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Stock Units</label>
                                <input type="number" min="0" name="variants[{{ $idx }}][stock]" value="{{ $v['stock'] ?? 0 }}" placeholder="5"
                                       class="block w-full rounded-md border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono shadow-2xs focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]">
                            </div>
                        </div>

                        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Price (₹) <span class="text-rose-500">*</span></label>
                                <input type="number" step="0.01" min="0" name="variants[{{ $idx }}][price]" value="{{ $v['price'] ?? '' }}" required placeholder="7999.00"
                                       class="block w-full rounded-md border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono shadow-2xs focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Compare Price (₹)</label>
                                <input type="number" step="0.01" min="0" name="variants[{{ $idx }}][compare_at_price]" value="{{ $v['compare_at_price'] ?? '' }}" placeholder="9999.00"
                                       class="block w-full rounded-md border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono shadow-2xs focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]">
                            </div>
                            <div>
                                <label class="block text-xs font-semibold text-slate-700 mb-1">Specific Photo</label>
                                <input type="file" name="variant_images[{{ $idx }}]" accept="image/png,image/jpeg,image/webp"
                                       class="block w-full text-[11px] text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-slate-200 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-slate-700 hover:file:bg-slate-300 cursor-pointer">
                                @if (!empty($v['image']))
                                    <div class="mt-1 flex items-center gap-2">
                                        <img src="{{ $v['image'] }}" alt="" class="h-6 w-6 rounded object-cover border border-slate-300">
                                        <span class="text-[10px] text-slate-500 truncate max-w-[120px]">{{ basename($v['image']) }}</span>
                                    </div>
                                    <input type="hidden" name="variants[{{ $idx }}][image]" value="{{ $v['image'] }}">
                                @endif
                            </div>
                        </div>

                        <div class="flex items-center gap-2 pt-1">
                            <label class="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                                <input type="checkbox" name="variants[{{ $idx }}][is_default]" value="1" @checked(!empty($v['is_default'])) class="rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]">
                                <span>Default selected variant</span>
                            </label>
                        </div>
                    </div>
                @endforeach
            @endif
        </div>

        <div id="no-variants-msg" class="{{ !empty($existingVariants) ? 'hidden' : '' }} p-4 rounded-lg bg-slate-50 border border-dashed border-slate-200 text-center">
            <p class="text-xs text-slate-500">No variants added yet. Product will sell with single default price & stock above.</p>
        </div>
    </div>

    <div id="delete-variants-container"></div>

    <!-- Actions Deck -->
    <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>{{ $product ? 'Save Changes' : 'Create Product' }}</span>
        </button>
        <a href="{{ route('admin.products.index') }}" class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
            Cancel
        </a>
    </div>
</form>

<script>
    let variantCount = {{ !empty($existingVariants) ? count($existingVariants) : 0 }};

    function addVariantRow() {
        const container = document.getElementById('variants-container');
        const noMsg = document.getElementById('no-variants-msg');
        if (noMsg) noMsg.classList.add('hidden');

        const idx = variantCount++;
        const displayNum = container.querySelectorAll('.variant-row').length + 1;

        const row = document.createElement('div');
        row.className = 'variant-row rounded-lg border border-slate-200 bg-slate-50/70 p-4 relative space-y-3';
        row.dataset.index = idx;
        row.innerHTML = `
            <div class="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-2">
                <span class="text-xs font-bold text-[#1e3a5f] uppercase tracking-wider">
                    Variant #<span class="variant-num">${displayNum}</span>
                </span>
                <button type="button" onclick="removeVariantRow(this, null)" class="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer">
                    Remove
                </button>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Variant Name <span class="text-rose-500">*</span></label>
                    <input type="text" name="variants[${idx}][name]" required placeholder="e.g. Gloss Black / Forged Carbon"
                           class="block w-full rounded-md border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 shadow-2xs focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">SKU</label>
                    <input type="text" name="variants[${idx}][sku]" placeholder="RM-SPL-GB"
                           class="block w-full rounded-md border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono shadow-2xs focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Stock Units</label>
                    <input type="number" min="0" name="variants[${idx}][stock]" value="10" placeholder="10"
                           class="block w-full rounded-md border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono shadow-2xs focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]">
                </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Price (₹) <span class="text-rose-500">*</span></label>
                    <input type="number" step="0.01" min="0" name="variants[${idx}][price]" required placeholder="4999.00"
                           class="block w-full rounded-md border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono shadow-2xs focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Compare Price (₹)</label>
                    <input type="number" step="0.01" min="0" name="variants[${idx}][compare_at_price]" placeholder="6499.00"
                           class="block w-full rounded-md border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 font-mono shadow-2xs focus:border-[#1e3a5f] focus:ring-1 focus:ring-[#1e3a5f]">
                </div>
                <div>
                    <label class="block text-xs font-semibold text-slate-700 mb-1">Specific Photo</label>
                    <input type="file" name="variant_images[${idx}]" accept="image/png,image/jpeg,image/webp"
                           class="block w-full text-[11px] text-slate-600 file:mr-2 file:rounded file:border-0 file:bg-slate-200 file:px-2.5 file:py-1 file:text-[11px] file:font-semibold file:text-slate-700 hover:file:bg-slate-300 cursor-pointer">
                </div>
            </div>
            <div class="flex items-center gap-2 pt-1">
                <label class="inline-flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                    <input type="checkbox" name="variants[${idx}][is_default]" value="1" ${displayNum === 1 ? 'checked' : ''} class="rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]">
                    <span>Default selected variant</span>
                </label>
            </div>
        `;
        container.appendChild(row);
        renumberVariants();
    }

    function removeVariantRow(btn, variantId) {
        const row = btn.closest('.variant-row');
        if (!row) return;

        if (variantId) {
            const deleteContainer = document.getElementById('delete-variants-container');
            const hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = 'delete_variant_ids[]';
            hiddenInput.value = variantId;
            deleteContainer.appendChild(hiddenInput);
        }

        row.remove();
        renumberVariants();

        const container = document.getElementById('variants-container');
        const remaining = container.querySelectorAll('.variant-row');
        if (remaining.length === 0) {
            const noMsg = document.getElementById('no-variants-msg');
            if (noMsg) noMsg.classList.remove('hidden');
        }
    }

    function renumberVariants() {
        const rows = document.querySelectorAll('#variants-container .variant-row');
        rows.forEach((row, i) => {
            const numSpan = row.querySelector('.variant-num');
            if (numSpan) numSpan.textContent = i + 1;
        });
    }
</script>

