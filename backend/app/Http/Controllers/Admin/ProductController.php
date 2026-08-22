<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProductStoreRequest;
use App\Http\Requests\Admin\ProductUpdateRequest;
use App\Models\Category;
use App\Models\Product;
use App\Services\CloudinaryUploadService;
use Illuminate\Database\QueryException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\View\View;
use RuntimeException;

class ProductController extends Controller
{
    // Note: methods below take the raw {product} id, NOT `Product $product`
    // implicit binding — Product::resolveRouteBinding() restricts lookups
    // to status=active for the storefront, which would 404 the admin trying
    // to open a draft product. Resolving manually here keeps that storefront
    // behavior untouched.
    public function index(Request $request): View
    {
        $products = Product::query()
            ->with('category')
            ->when($request->filled('search'), fn ($q) => $q->where('title', 'like', '%'.$request->string('search').'%'))
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('category'), fn ($q) => $q->where('category_id', $request->integer('category')))
            ->orderByDesc('created_at')
            ->paginate(16)
            ->withQueryString();

        $categories = Category::orderBy('name')->get();

        return view('admin.products.index', compact('products', 'categories'));
    }

    public function create(): View
    {
        $categories = Category::orderBy('name')->get();

        return view('admin.products.create', compact('categories'));
    }

    public function store(ProductStoreRequest $request, CloudinaryUploadService $uploader): RedirectResponse
    {
        $validated = $request->validated();

        try {
            $newImages = $uploader->uploadMany($request->file('images', []), 'revvmotiv/products');
        } catch (RuntimeException $e) {
            // A misconfigured/failed Cloudinary upload must not silently
            // drop the rest of the form — surface it as a normal validation
            // error and let the admin resubmit without re-typing everything.
            return back()->withInput()->withErrors(['images' => 'Image upload failed: '.$e->getMessage()]);
        }

        // Optional product video: an uploaded file takes priority over a
        // pasted URL if both are somehow given.
        $videoUrl = $validated['video_url'] ?? null;
        if ($request->hasFile('video_file')) {
            $uploadedVideo = $uploader->upload($request->file('video_file'), 'revvmotiv/products/videos');
            $videoUrl = $uploadedVideo['secure_url'] ?? $uploadedVideo['relative_path'] ?? null;
        }

        $product = Product::create([
            'title' => $validated['title'],
            'slug' => ($validated['slug'] ?? null) ?: Str::slug($validated['title']),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'cost_price' => $validated['cost_price'] ?? null,
            'compare_at_price' => $validated['compare_at_price'] ?? null,
            'stock' => $validated['stock'],
            'category_id' => $validated['category_id'],
            'fitment' => $validated['fitment'] ?? null,
            'is_featured' => $request->boolean('is_featured'),
            'featured_order' => $validated['featured_order'] ?? 0,
            'status' => $validated['status'],
            'images' => $newImages,
            'video_url' => $videoUrl,
        ]);

        if (! empty($validated['variants'])) {
            $variantImages = $request->file('variant_images', []);
            foreach ($validated['variants'] as $idx => $vData) {
                $varImgPath = $vData['image'] ?? null;
                if (isset($variantImages[$idx]) && $variantImages[$idx]->isValid()) {
                    $uploadedVar = $uploader->upload($variantImages[$idx], 'revvmotiv/products/variants');
                    $varImgPath = $uploadedVar['relative_path'] ?? $uploadedVar['secure_url'] ?? null;
                }

                $product->variants()->create([
                    'name' => $vData['name'],
                    'sku' => $vData['sku'] ?? null,
                    'price' => $vData['price'],
                    'compare_at_price' => $vData['compare_at_price'] ?? null,
                    'stock' => $vData['stock'] ?? 0,
                    'image' => $varImgPath,
                    'attributes' => ! empty($vData['attributes']) ? (is_array($vData['attributes']) ? $vData['attributes'] : json_decode($vData['attributes'], true)) : null,
                    'is_default' => ! empty($vData['is_default']),
                    'sort_order' => $idx,
                ]);
            }
        }

        return redirect()->route('admin.products.index')->with('status', "Product \"{$product->title}\" created.");
    }

    public function edit(int $product): View
    {
        $product = Product::with('variants')->findOrFail($product);
        $categories = Category::orderBy('name')->get();

        return view('admin.products.edit', compact('product', 'categories'));
    }

    public function update(ProductUpdateRequest $request, int $product, CloudinaryUploadService $uploader): RedirectResponse
    {
        $product = Product::findOrFail($product);
        $validated = $request->validated();

        $images = collect($product->images ?? [])
            ->reject(fn ($url) => in_array($url, $validated['remove_images'] ?? [], true))
            ->values()
            ->all();

        // Admin's drag-and-drop reorder, submitted as a JSON array of URLs
        // in their new order. Re-sort the surviving images to match it;
        // anything not in the decoded order (shouldn't happen, but a stale
        // submit is possible) keeps its existing relative position at the end.
        $order = json_decode($request->input('image_order', ''), true);
        if (is_array($order) && ! empty($order)) {
            $images = collect($order)
                ->filter(fn ($url) => in_array($url, $images, true))
                ->push(...array_diff($images, $order))
                ->values()
                ->all();
        }

        try {
            $newImages = $uploader->uploadMany($request->file('images', []), 'revvmotiv/products');
        } catch (RuntimeException $e) {
            // Same reasoning as store(): don't let an upload failure discard
            // unrelated field edits (price, stock, status, ...) the admin
            // already made on this same submit.
            return back()->withInput()->withErrors(['images' => 'Image upload failed: '.$e->getMessage()]);
        }

        $images = [...$images, ...$newImages];

        $videoUrl = $product->video_url;
        if ($request->boolean('remove_video')) {
            $videoUrl = null;
        }
        if ($request->hasFile('video_file')) {
            $uploadedVideo = $uploader->upload($request->file('video_file'), 'revvmotiv/products/videos');
            $videoUrl = $uploadedVideo['secure_url'] ?? $uploadedVideo['relative_path'] ?? null;
        } elseif (! empty($validated['video_url'])) {
            $videoUrl = $validated['video_url'];
        }

        $product->update([
            'title' => $validated['title'],
            'slug' => ($validated['slug'] ?? null) ?: Str::slug($validated['title']),
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'cost_price' => $validated['cost_price'] ?? null,
            'compare_at_price' => $validated['compare_at_price'] ?? null,
            'stock' => $validated['stock'],
            'category_id' => $validated['category_id'],
            'fitment' => $validated['fitment'] ?? null,
            'is_featured' => $request->boolean('is_featured'),
            'featured_order' => $validated['featured_order'] ?? 0,
            'status' => $validated['status'],
            'images' => $images,
            'video_url' => $videoUrl,
        ]);

        if (! empty($validated['delete_variant_ids'])) {
            $product->variants()->whereIn('id', $validated['delete_variant_ids'])->delete();
        }

        if (isset($validated['variants'])) {
            $variantImages = $request->file('variant_images', []);
            foreach ($validated['variants'] as $idx => $vData) {
                $varImgPath = $vData['image'] ?? null;
                if (isset($variantImages[$idx]) && $variantImages[$idx]->isValid()) {
                    $uploadedVar = $uploader->upload($variantImages[$idx], 'revvmotiv/products/variants');
                    $varImgPath = $uploadedVar['relative_path'] ?? $uploadedVar['secure_url'] ?? null;
                }

                $variantPayload = [
                    'name' => $vData['name'],
                    'sku' => $vData['sku'] ?? null,
                    'price' => $vData['price'],
                    'compare_at_price' => $vData['compare_at_price'] ?? null,
                    'stock' => $vData['stock'] ?? 0,
                    'attributes' => ! empty($vData['attributes']) ? (is_array($vData['attributes']) ? $vData['attributes'] : json_decode($vData['attributes'], true)) : null,
                    'is_default' => ! empty($vData['is_default']),
                    'sort_order' => $idx,
                ];

                if ($varImgPath !== null) {
                    $variantPayload['image'] = $varImgPath;
                }

                if (! empty($vData['id'])) {
                    $product->variants()->where('id', $vData['id'])->update($variantPayload);
                } else {
                    $product->variants()->create($variantPayload);
                }
            }
        }

        // Return to the exact listing page/filters the admin came from
        // (threaded through via the Edit link -> hidden _return_qs field)
        // instead of always resetting to page 1.
        $returnQs = $request->input('_return_qs');
        $redirectUrl = route('admin.products.index') . ($returnQs ? '?'.$returnQs : '');

        return redirect()->to($redirectUrl)->with('status', "Product \"{$product->title}\" updated.");
    }

    public function destroy(int $product): RedirectResponse
    {
        $product = Product::findOrFail($product);
        $title = $product->title;

        try {
            $product->delete();
        } catch (QueryException) {
            // order_items.product_id has no cascade/null-on-delete — a
            // product that's been ordered can't be hard-deleted without
            // corrupting order history. Draft it out of the storefront instead.
            return back()
                ->with('status', "\"{$title}\" has past orders and can't be deleted — set its status to draft instead to hide it from the storefront.");
        }

        // back() rather than the index route — delete is submitted from the
        // listing page itself, so this naturally returns to whatever page/
        // filters were showing instead of resetting to page 1.
        return back()->with('status', "Product \"{$title}\" deleted.");
    }
}
