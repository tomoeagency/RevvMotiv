<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\SanitizesCsvOutput;
use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ReviewController extends Controller
{
    use SanitizesCsvOutput;

    public function index(Request $request): View
    {
        $reviews = $this->filtered($request)
            ->with('product')
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return view('admin.reviews.index', compact('reviews'));
    }

    public function approve(Review $review): RedirectResponse
    {
        $review->update(['status' => 'approved']);

        return back()->with('status', 'Review approved.');
    }

    public function reject(Review $review): RedirectResponse
    {
        $review->update(['status' => 'rejected']);

        return back()->with('status', 'Review rejected.');
    }

    public function destroy(Review $review): RedirectResponse
    {
        $review->delete();

        return back()->with('status', 'Review deleted.');
    }

    // Dependency-free CSV export (opens natively in Excel) — this sandbox
    // has no composer available to add maatwebsite/excel as the
    // review-system skill suggests. Swap this out for that package later
    // if native .xlsx formatting (colors, column widths) is wanted; CSV
    // covers the "Excel export" requirement functionally in the meantime.
    public function export(Request $request): StreamedResponse
    {
        $reviews = $this->filtered($request)->with(['product'])->latest()->get();

        $filename = 'reviews-'.now()->format('Y-m-d-His').'.csv';

        $callback = function () use ($reviews) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, ['Customer', 'Product', 'Rating', 'Comment', 'Verified Buyer', 'Has Media', 'Status', 'Created At']);

            foreach ($reviews as $review) {
                fputcsv($handle, $this->csvRow([
                    $review->customer_name,
                    $review->product?->title ?? '—',
                    $review->rating,
                    $review->comment,
                    $review->verified_purchase ? 'Yes' : 'No',
                    ! empty($review->media_urls) ? 'Yes' : 'No',
                    $review->status,
                    $review->created_at->format('Y-m-d H:i'),
                ]));
            }

            fclose($handle);
        };

        return response()->streamDownload($callback, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }

    private function filtered(Request $request)
    {
        return Review::query()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->filled('product_id'), fn ($q) => $q->where('product_id', $request->integer('product_id')))
            ->when($request->input('type') === 'product', fn ($q) => $q->whereNotNull('product_id'))
            ->when($request->input('type') === 'general', fn ($q) => $q->whereNull('product_id'));
    }
}
