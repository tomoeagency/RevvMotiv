<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryItemResource;
use App\Models\GalleryItem;

class GalleryController extends Controller
{
    public function index()
    {
        return response()->json([
            'data' => GalleryItemResource::collection(
                GalleryItem::where('active', true)->orderBy('sort_order')->get()
            ),
        ]);
    }
}
