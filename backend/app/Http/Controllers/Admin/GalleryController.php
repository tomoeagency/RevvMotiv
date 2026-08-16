<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\GalleryItemStoreRequest;
use App\Http\Requests\Admin\GalleryItemUpdateRequest;
use App\Models\GalleryItem;
use App\Services\CloudinaryUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class GalleryController extends Controller
{
    public function index(): View
    {
        $items = GalleryItem::orderBy('sort_order')->orderByDesc('created_at')->paginate(24);

        return view('admin.gallery.index', compact('items'));
    }

    public function create(): View
    {
        return view('admin.gallery.create');
    }

    public function store(GalleryItemStoreRequest $request, CloudinaryUploadService $uploader): RedirectResponse
    {
        $upload = $uploader->upload($request->file('media'), 'revvmotiv/gallery');

        GalleryItem::create([
            'media_url' => $upload['secure_url'],
            // Cloudinary's own classification of what it just received —
            // more reliable than re-deriving from the upload mime type a
            // second time here.
            'media_type' => $upload['resource_type'] === 'video' ? 'video' : 'image',
            'caption' => $request->validated('caption'),
            'sort_order' => $request->validated('sort_order') ?? 0,
        ]);

        return redirect()->route('admin.gallery.index')->with('status', 'Gallery item added.');
    }

    public function edit(GalleryItem $galleryItem): View
    {
        return view('admin.gallery.edit', ['item' => $galleryItem]);
    }

    public function update(GalleryItemUpdateRequest $request, GalleryItem $galleryItem): RedirectResponse
    {
        $validated = $request->validated();
        $validated['active'] = $request->boolean('active');

        $galleryItem->update($validated);

        return redirect()->route('admin.gallery.index')->with('status', 'Gallery item updated.');
    }

    public function destroy(GalleryItem $galleryItem): RedirectResponse
    {
        // Cloudinary media is left in place (not deleted via their API) —
        // matches how product/project images are handled elsewhere in
        // this app; a stray Cloudinary asset costs nothing meaningful at
        // this scale and destroying it requires a signed delete call this
        // app doesn't otherwise make.
        $galleryItem->delete();

        return redirect()->route('admin.gallery.index')->with('status', 'Gallery item deleted.');
    }
}
