@php $coupon = $coupon ?? null; @endphp
<form method="POST" action="{{ $coupon ? route('admin.coupons.update', $coupon) : route('admin.coupons.store') }}" class="max-w-md space-y-1">
    @csrf
    @if ($coupon) @method('PUT') @endif

    <x-admin.form-field name="code" label="Code" hint="Stored uppercase automatically." required>
        <input type="text" name="code" id="code" value="{{ old('code', $coupon->code ?? '') }}" required
               class="block w-full rounded-md border-slate-300 font-mono shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
    </x-admin.form-field>

    <div class="grid grid-cols-2 gap-4">
        <x-admin.form-field name="type" label="Type" required>
            <select name="type" id="type" required
                    class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                <option value="percent" @selected(old('type', $coupon->type ?? 'percent') === 'percent')>Percent off</option>
                <option value="fixed" @selected(old('type', $coupon->type ?? '') === 'fixed')>Fixed amount off</option>
            </select>
        </x-admin.form-field>

        <x-admin.form-field name="value" label="Value" hint="Percent (0-100) or ₹ amount, depending on type." required>
            <input type="number" step="0.01" min="0" name="value" id="value" value="{{ old('value', $coupon->value ?? '') }}" required
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
        </x-admin.form-field>
    </div>

    <x-admin.form-field name="min_order_amount" label="Minimum order amount (₹)" hint="Optional — checked against the full cart, even if the discount itself only applies to some items.">
        <input type="number" step="0.01" min="0" name="min_order_amount" id="min_order_amount" value="{{ old('min_order_amount', $coupon->min_order_amount ?? '') }}"
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
    </x-admin.form-field>

    <div class="grid grid-cols-2 gap-4">
        <x-admin.form-field name="starts_at" label="Starts at" hint="Optional.">
            <input type="datetime-local" name="starts_at" id="starts_at" value="{{ old('starts_at', $coupon?->starts_at?->format('Y-m-d\TH:i')) }}"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
        </x-admin.form-field>

        <x-admin.form-field name="expires_at" label="Expires at" hint="Optional.">
            <input type="datetime-local" name="expires_at" id="expires_at" value="{{ old('expires_at', $coupon?->expires_at?->format('Y-m-d\TH:i')) }}"
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
        </x-admin.form-field>
    </div>

    <x-admin.form-field name="usage_limit" label="Usage limit" hint="Optional — total number of times this code can be used across all orders.">
        <input type="number" min="1" name="usage_limit" id="usage_limit" value="{{ old('usage_limit', $coupon->usage_limit ?? '') }}"
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
    </x-admin.form-field>

    <hr class="my-4 border-slate-200">
    <h3 class="mb-3 text-sm font-semibold text-slate-700">Applies to</h3>

    <x-admin.form-field name="scope_type" label="Discount scope" required>
        <select name="scope_type" id="scope_type" required
                onchange="document.getElementById('scope_products_field').classList.toggle('hidden', this.value !== 'products'); document.getElementById('scope_category_field').classList.toggle('hidden', this.value !== 'category');"
                class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
            <option value="all" @selected(old('scope_type', $coupon->scope_type ?? 'all') === 'all')>All products</option>
            <option value="products" @selected(old('scope_type', $coupon->scope_type ?? '') === 'products')>Specific products</option>
            <option value="category" @selected(old('scope_type', $coupon->scope_type ?? '') === 'category')>Specific category</option>
        </select>
    </x-admin.form-field>

    <div id="scope_products_field" class="{{ old('scope_type', $coupon->scope_type ?? 'all') !== 'products' ? 'hidden' : '' }}">
        <x-admin.form-field name="scope_product_ids" label="Products" hint="Ctrl/Cmd-click to select multiple. The discount only applies to these products in the cart.">
            @php $selectedProductIds = old('scope_product_ids', $coupon->scope_product_ids ?? []); @endphp
            <select name="scope_product_ids[]" id="scope_product_ids" multiple size="6"
                    class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                @foreach ($products as $product)
                    <option value="{{ $product->id }}" @selected(in_array($product->id, $selectedProductIds))>{{ $product->title }}</option>
                @endforeach
            </select>
        </x-admin.form-field>
    </div>

    <div id="scope_category_field" class="{{ old('scope_type', $coupon->scope_type ?? 'all') !== 'category' ? 'hidden' : '' }}">
        <x-admin.form-field name="scope_category_id" label="Category" hint="The discount only applies to products in this category.">
            <select name="scope_category_id" id="scope_category_id"
                    class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                <option value="">Select a category</option>
                @foreach ($categories as $category)
                    <option value="{{ $category->id }}" @selected(old('scope_category_id', $coupon->scope_category_id ?? null) == $category->id)>{{ $category->name }}</option>
                @endforeach
            </select>
        </x-admin.form-field>
    </div>

    <hr class="my-4 border-slate-200">
    <h3 class="mb-3 text-sm font-semibold text-slate-700">Visibility &amp; tracking</h3>

    <label class="mb-4 flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="is_public" value="1" class="rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" @checked(old('is_public', $coupon->is_public ?? true))>
        Show in the storefront's "available coupons" list
    </label>

    <x-admin.form-field name="influencer_name" label="Influencer / campaign label" hint="Internal tracking only — never shown publicly. Leave blank for a regular coupon.">
        <input type="text" name="influencer_name" id="influencer_name" value="{{ old('influencer_name', $coupon->influencer_name ?? '') }}"
               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
    </x-admin.form-field>

    <label class="mb-4 flex items-center gap-2 text-sm text-slate-700">
        <input type="checkbox" name="active" value="1" class="rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" @checked(old('active', $coupon->active ?? true))>
        Active
    </label>

    <div class="flex gap-3 pt-2">
        <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            {{ $coupon ? 'Save changes' : 'Create coupon' }}
        </button>
        <a href="{{ route('admin.coupons.index') }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
    </div>
</form>
