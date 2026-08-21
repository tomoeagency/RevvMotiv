<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Reel;
use Illuminate\Http\JsonResponse;

class ReelController extends Controller
{
    public function index(): JsonResponse
    {
        $reels = Reel::with(['product:id,title,slug,price,compare_at_price,primary_image_url'])
            ->where('is_active', true)
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->get()
            ->map(function (Reel $reel) {
                return [
                    'id' => $reel->id,
                    'title' => $reel->title,
                    'car' => $reel->car ?? 'Bespoke Custom Build',
                    'category' => $reel->category ?? 'Live Workshop Reel',
                    'tag' => $reel->tag ?? '#REVVMOTIV',
                    'video_url' => $reel->video_url,
                    'thumbnail_url' => $reel->thumbnail_url,
                    'caption' => $reel->caption,
                    'instagram_url' => $reel->instagram_url,
                    'product' => $reel->product ? [
                        'id' => $reel->product->id,
                        'title' => $reel->product->title,
                        'slug' => $reel->product->slug,
                        'price' => $reel->product->price,
                        'compare_at_price' => $reel->product->compare_at_price,
                        'primary_image_url' => $reel->product->primary_image_url,
                    ] : null,
                ];
            });

        return response()->json([
            'data' => $reels,
        ]);
    }
}
