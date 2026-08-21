<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Reel;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\View\View;

class ReelController extends Controller
{
    public function index(): View
    {
        $reels = Reel::with('product')
            ->orderBy('sort_order', 'asc')
            ->orderBy('id', 'desc')
            ->paginate(15);

        return view('admin.reels.index', compact('reels'));
    }

    public function create(): View
    {
        $products = Product::orderBy('title')->get(['id', 'title']);
        return view('admin.reels.create', compact('products'));
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'car' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'tag' => 'nullable|string|max:50',
            'video_file' => 'nullable|file|mimes:mp4,mov,webm|max:51200', // up to 50MB
            'video_url' => 'nullable|string|max:1000',
            'thumbnail_file' => 'nullable|image|max:10240',
            'thumbnail_url' => 'nullable|string|max:1000',
            'product_id' => 'nullable|exists:products,id',
            'caption' => 'nullable|string',
            'instagram_url' => 'nullable|url|max:1000',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('video_file')) {
            $videoPath = $request->file('video_file')->store('reels/videos', 'public');
            $validated['video_path'] = $videoPath;
        } elseif (!empty($request->input('video_url'))) {
            $validated['video_path'] = $request->input('video_url');
        } else {
            return back()->withErrors(['video_file' => 'Please upload a video file or provide a video URL.'])->withInput();
        }

        if ($request->hasFile('thumbnail_file')) {
            $thumbPath = $request->file('thumbnail_file')->store('reels/thumbnails', 'public');
            $validated['thumbnail_path'] = $thumbPath;
        } elseif (!empty($request->input('thumbnail_url'))) {
            $validated['thumbnail_path'] = $request->input('thumbnail_url');
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($request->input('sort_order', 0));

        Reel::create($validated);

        return redirect()->route('admin.reels.index')->with('success', 'Garage reel created successfully.');
    }

    public function edit(Reel $reel): View
    {
        $products = Product::orderBy('title')->get(['id', 'title']);
        return view('admin.reels.edit', compact('reel', 'products'));
    }

    public function update(Request $request, Reel $reel): RedirectResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'car' => 'nullable|string|max:255',
            'category' => 'nullable|string|max:100',
            'tag' => 'nullable|string|max:50',
            'video_file' => 'nullable|file|mimes:mp4,mov,webm|max:51200',
            'video_url' => 'nullable|string|max:1000',
            'thumbnail_file' => 'nullable|image|max:10240',
            'thumbnail_url' => 'nullable|string|max:1000',
            'product_id' => 'nullable|exists:products,id',
            'caption' => 'nullable|string',
            'instagram_url' => 'nullable|url|max:1000',
            'sort_order' => 'nullable|integer',
            'is_active' => 'nullable|boolean',
        ]);

        if ($request->hasFile('video_file')) {
            if ($reel->video_path && !str_starts_with($reel->video_path, 'http') && !str_starts_with($reel->video_path, '/')) {
                Storage::disk('public')->delete($reel->video_path);
            }
            $validated['video_path'] = $request->file('video_file')->store('reels/videos', 'public');
        } elseif (!empty($request->input('video_url'))) {
            $validated['video_path'] = $request->input('video_url');
        }

        if ($request->hasFile('thumbnail_file')) {
            if ($reel->thumbnail_path && !str_starts_with($reel->thumbnail_path, 'http') && !str_starts_with($reel->thumbnail_path, '/')) {
                Storage::disk('public')->delete($reel->thumbnail_path);
            }
            $validated['thumbnail_path'] = $request->file('thumbnail_file')->store('reels/thumbnails', 'public');
        } elseif ($request->filled('thumbnail_url')) {
            $validated['thumbnail_path'] = $request->input('thumbnail_url');
        }

        $validated['is_active'] = $request->boolean('is_active', true);
        $validated['sort_order'] = (int) ($request->input('sort_order', 0));

        $reel->update($validated);

        return redirect()->route('admin.reels.index')->with('success', 'Garage reel updated successfully.');
    }

    public function destroy(Reel $reel): RedirectResponse
    {
        if ($reel->video_path && !str_starts_with($reel->video_path, 'http') && !str_starts_with($reel->video_path, '/')) {
            Storage::disk('public')->delete($reel->video_path);
        }
        if ($reel->thumbnail_path && !str_starts_with($reel->thumbnail_path, 'http') && !str_starts_with($reel->thumbnail_path, '/')) {
            Storage::disk('public')->delete($reel->thumbnail_path);
        }

        $reel->delete();

        return redirect()->route('admin.reels.index')->with('success', 'Garage reel deleted successfully.');
    }
}
