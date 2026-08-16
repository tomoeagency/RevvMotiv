<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CouponStoreRequest;
use App\Http\Requests\Admin\CouponUpdateRequest;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\View\View;

class CouponController extends Controller
{
    public function index(): View
    {
        $coupons = Coupon::with('scopeCategory')->latest()->paginate(20);

        return view('admin.coupons.index', compact('coupons'));
    }

    public function create(): View
    {
        return view('admin.coupons.create', $this->formData());
    }

    public function store(CouponStoreRequest $request): RedirectResponse
    {
        $validated = $this->prepareData($request);

        Coupon::create($validated);

        return redirect()->route('admin.coupons.index')->with('status', "Coupon \"{$validated['code']}\" created.");
    }

    public function edit(Coupon $coupon): View
    {
        return view('admin.coupons.edit', array_merge(['coupon' => $coupon], $this->formData()));
    }

    public function update(CouponUpdateRequest $request, Coupon $coupon): RedirectResponse
    {
        $validated = $this->prepareData($request);

        $coupon->update($validated);

        return redirect()->route('admin.coupons.index')->with('status', "Coupon \"{$coupon->code}\" updated.");
    }

    public function destroy(Coupon $coupon): RedirectResponse
    {
        $code = $coupon->code;
        $coupon->delete();

        return redirect()->route('admin.coupons.index')->with('status', "Coupon \"{$code}\" deleted.");
    }

    private function formData(): array
    {
        return [
            'categories' => Category::orderBy('name')->get(),
            'products' => Product::orderBy('title')->get(),
        ];
    }

    private function prepareData(CouponStoreRequest|CouponUpdateRequest $request): array
    {
        $validated = $request->validated();
        $validated['code'] = Str::upper($validated['code']);
        $validated['active'] = $request->boolean('active');
        $validated['is_public'] = $request->boolean('is_public');

        // Only the fields relevant to the chosen scope are meaningful —
        // clear the others so a coupon can't end up with stale
        // scope_product_ids left over from switching away from "products".
        if ($validated['scope_type'] !== 'products') {
            $validated['scope_product_ids'] = null;
        } elseif (! empty($validated['scope_product_ids'])) {
            // HTML form values arrive as strings; matchesProduct() does a
            // strict in_array against $product->id (int), so these must be
            // cast here or a product-scoped coupon silently matches nothing.
            $validated['scope_product_ids'] = array_map('intval', $validated['scope_product_ids']);
        }
        if ($validated['scope_type'] !== 'category') {
            $validated['scope_category_id'] = null;
        }

        return $validated;
    }
}
