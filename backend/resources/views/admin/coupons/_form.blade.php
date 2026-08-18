@php $coupon = $coupon ?? null; @endphp
<form method="POST" action="{{ $coupon ? route('admin.coupons.update', $coupon) : route('admin.coupons.store') }}" class="space-y-6 max-w-2xl">
    @csrf
    @if ($coupon) @method('PUT') @endif

    <!-- Card 1: Coupon Code & Value -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Discount Code & Value
        </h2>

        <x-admin.form-field name="code" label="Coupon Code" hint="Stored in uppercase automatically (e.g. REVV10, SPEED500)." required>
            <input type="text" name="code" id="code" value="{{ old('code', $coupon->code ?? '') }}" required placeholder="REVV10"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono font-bold tracking-wider shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <x-admin.form-field name="type" label="Discount Type" required>
                <select name="type" id="type" required
                        class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                    <option value="percent" @selected(old('type', $coupon->type ?? 'percent') === 'percent')>Percentage (%) Off</option>
                    <option value="fixed" @selected(old('type', $coupon->type ?? '') === 'fixed')>Flat Amount (₹) Off</option>
                </select>
            </x-admin.form-field>

            <x-admin.form-field name="value" label="Discount Value" hint="Percent (0-100) or Flat Rupee amount." required>
                <input type="number" step="0.01" min="0" name="value" id="value" value="{{ old('value', $coupon->value ?? '') }}" required placeholder="10.00"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>
        </div>

        <x-admin.form-field name="min_order_amount" label="Minimum Cart Order Amount (₹)" hint="Optional minimum qualifying order value.">
            <input type="number" step="0.01" min="0" name="min_order_amount" id="min_order_amount" value="{{ old('min_order_amount', $coupon->min_order_amount ?? '') }}" placeholder="1999.00"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>
    </div>

    <!-- Card 2: Validity Schedule & Limits -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Schedule & Usage Limits
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <x-admin.form-field name="starts_at" label="Active From Date" hint="Optional start timestamp.">
                <input type="datetime-local" name="starts_at" id="starts_at" value="{{ old('starts_at', $coupon?->starts_at?->format('Y-m-d\TH:i')) }}"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>

            <x-admin.form-field name="expires_at" label="Expires At Date" hint="Optional expiration timestamp.">
                <input type="datetime-local" name="expires_at" id="expires_at" value="{{ old('expires_at', $coupon?->expires_at?->format('Y-m-d\TH:i')) }}"
                       class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
            </x-admin.form-field>
        </div>

        <x-admin.form-field name="usage_limit" label="Maximum Usage Limit" hint="Maximum total times this code can be redeemed across all orders.">
            <input type="number" min="1" name="usage_limit" id="usage_limit" value="{{ old('usage_limit', $coupon->usage_limit ?? '') }}" placeholder="100"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>
    </div>

    <!-- Card 3: Applies To & Eligibility -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Discount Scope & Rules
        </h2>

        <x-admin.form-field name="scope_type" label="Applies To" required>
            <select name="scope_type" id="scope_type" required
                    onchange="document.getElementById('scope_products_field').classList.toggle('hidden', this.value !== 'products'); document.getElementById('scope_category_field').classList.toggle('hidden', this.value !== 'category');"
                    class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                <option value="all" @selected(old('scope_type', $coupon->scope_type ?? 'all') === 'all')>All Catalog Products</option>
                <option value="products" @selected(old('scope_type', $coupon->scope_type ?? '') === 'products')>Specific Products Only</option>
                <option value="category" @selected(old('scope_type', $coupon->scope_type ?? '') === 'category')>Specific Category Only</option>
            </select>
        </x-admin.form-field>

        <div id="scope_products_field" class="{{ old('scope_type', $coupon->scope_type ?? 'all') !== 'products' ? 'hidden' : '' }}">
            <x-admin.form-field name="scope_product_ids" label="Eligible Products" hint="Hold Ctrl/Cmd to select multiple products.">
                @php $selectedProductIds = old('scope_product_ids', $coupon->scope_product_ids ?? []); @endphp
                <select name="scope_product_ids[]" id="scope_product_ids" multiple size="6"
                        class="block w-full rounded-lg border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                    @foreach ($products as $product)
                        <option value="{{ $product->id }}" @selected(in_array($product->id, $selectedProductIds))>{{ $product->title }}</option>
                    @endforeach
                </select>
            </x-admin.form-field>
        </div>

        <div id="scope_category_field" class="{{ old('scope_type', $coupon->scope_type ?? 'all') !== 'category' ? 'hidden' : '' }}">
            <x-admin.form-field name="scope_category_id" label="Eligible Category" hint="Discount applies only to items inside this category.">
                <select name="scope_category_id" id="scope_category_id"
                        class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                    <option value="">Select a category</option>
                    @foreach ($categories as $category)
                        <option value="{{ $category->id }}" @selected(old('scope_category_id', $coupon->scope_category_id ?? null) == $category->id)>{{ $category->name }}</option>
                    @endforeach
                </select>
            </x-admin.form-field>
        </div>
    </div>

    <!-- Card 4: Visibility & Influencer Attribution -->
    <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
        <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
            Visibility & Campaign Tracking
        </h2>

        <x-admin.form-field name="influencer_name" label="Influencer / Campaign Tag" hint="Internal attribution tag for tracking conversions.">
            <input type="text" name="influencer_name" id="influencer_name" value="{{ old('influencer_name', $coupon->influencer_name ?? '') }}" placeholder="e.g. YouTube MotorBeam Collaboration"
                   class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
        </x-admin.form-field>

        <div class="space-y-3 pt-2">
            <label class="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input type="checkbox" name="is_public" value="1" class="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500" @checked(old('is_public', $coupon->is_public ?? true))>
                <span>Show in the storefront's "Available Coupons" dropdown banner</span>
            </label>

            <label class="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                <input type="checkbox" name="active" value="1" class="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500" @checked(old('active', $coupon->active ?? true))>
                <span>Coupon is active and redeemable</span>
            </label>
        </div>
    </div>

    <!-- Actions Deck -->
    <div class="flex items-center gap-3 pt-2">
        <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>{{ $coupon ? 'Save Changes' : 'Create Coupon' }}</span>
        </button>
        <a href="{{ route('admin.coupons.index') }}" class="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
            Cancel
        </a>
    </div>
</form>
