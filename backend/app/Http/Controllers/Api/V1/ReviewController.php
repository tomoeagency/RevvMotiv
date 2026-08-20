<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewStoreRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Order;
use App\Models\Product;
use App\Models\Review;
use App\Services\CloudinaryUploadService;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function store(ReviewStoreRequest $request, CloudinaryUploadService $uploader)
    {
        $validated = $request->validated();

        $review = Review::create([
            'product_id' => $validated['product_id'] ?? null,
            'order_id' => $validated['order_id'] ?? null,
            'customer_name' => $validated['customer_name'],
            'customer_email' => $validated['customer_email'],
            'rating' => $validated['rating'],
            'comment' => $validated['comment'],
            'media_urls' => $uploader->uploadMany($request->file('media', []), 'revvmotiv/reviews'),
            'verified_purchase' => $this->isVerifiedPurchase($validated),
            'status' => 'approved',
        ]);

        return response()->json([
            'data' => [
                'id' => $review->id,
                'status' => $review->status,
                'message' => 'Thanks for your review!',
            ],
        ], 201);
    }

    public function forProduct(Request $request, Product $product)
    {
        $perPage = min((int) $request->integer('per_page', 10), 50);

        $approved = Review::where('product_id', $product->id)->where('status', 'approved');

        $reviews = (clone $approved)->latest()->paginate($perPage);

        return response()->json([
            'data' => ReviewResource::collection($reviews->items()),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page' => $reviews->lastPage(),
                'per_page' => $reviews->perPage(),
                'total' => $reviews->total(),
                'average_rating' => round((float) (clone $approved)->avg('rating'), 1),
                'rating_breakdown' => (clone $approved)
                    ->selectRaw('rating, count(*) as count')
                    ->groupBy('rating')
                    ->pluck('count', 'rating'),
            ],
        ]);
    }

    public function featured()
    {
        $reviews = Review::with('product')
            ->where('status', 'approved')
            ->orderByDesc('rating')
            ->latest()
            ->limit(10)
            ->get();

        return response()->json([
            'data' => ReviewResource::collection($reviews),
        ]);
    }

    // Verified-buyer logic: an explicit order_id must belong to a delivered
    // order for this customer (and product, if given); otherwise fall back
    // to matching by email + product against any delivered order.
    private function isVerifiedPurchase(array $validated): bool
    {
        $query = Order::where('order_status', 'delivered')
            ->where('customer_email', $validated['customer_email'])
            ->when(
                ! empty($validated['product_id']),
                fn ($q) => $q->whereHas('items', fn ($q2) => $q2->where('product_id', $validated['product_id']))
            );

        if (! empty($validated['order_id'])) {
            $query->whereKey($validated['order_id']);
        }

        return $query->exists();
    }
}
