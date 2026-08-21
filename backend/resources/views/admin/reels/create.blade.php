<x-admin.layout title="Upload New Reel">
    <div class="mb-6 flex items-center justify-between">
        <div>
            <h2 class="text-base font-semibold text-slate-800">Upload Garage Video Reel</h2>
            <p class="text-xs text-slate-500">Upload a 10–30s MP4 video reel from your phone or computer to showcase on the homepage.</p>
        </div>
        <a href="{{ route('admin.reels.index') }}" class="text-xs font-semibold text-slate-600 hover:text-slate-900">
            ← Back to Reels
        </a>
    </div>

    @if ($errors->any())
        <div class="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-800">
            <ul class="list-disc pl-4 space-y-1">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form action="{{ route('admin.reels.store') }}" method="POST" enctype="multipart/form-data" class="space-y-6">
        @csrf

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <!-- Left 2 Cols: Main Info -->
            <div class="lg:col-span-2 space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Reel Title <span class="text-red-500">*</span>
                    </label>
                    <input type="text" name="title" value="{{ old('title') }}" placeholder="e.g. Tri colour fog lamp and auxiliary light installed in kia seltos" required
                           class="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-red-500 focus:outline-none">
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Car Platform
                        </label>
                        <input type="text" name="car" value="{{ old('car') }}" placeholder="e.g. Kia Seltos / Maruti Baleno"
                               class="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-red-500 focus:outline-none">
                    </div>
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Category / Tag
                        </label>
                        <input type="text" name="tag" value="{{ old('tag', '#REVVMOTIV') }}" placeholder="e.g. #REVVMOTIV or #FOGLIGHTS"
                               class="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-red-500 focus:outline-none">
                    </div>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Video File (.mp4, .mov) <span class="text-red-500">*</span>
                    </label>
                    <input type="file" name="video_file" accept="video/mp4,video/quicktime,video/webm"
                           class="w-full rounded-lg border border-dashed border-slate-300 px-3.5 py-3 text-xs text-slate-600 file:mr-4 file:rounded-md file:border-0 file:bg-red-600 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-red-700">
                    <p class="text-[11px] text-slate-400 mt-1">Direct upload from mobile or desktop (max 50MB). Or provide an external URL below.</p>
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Or Video URL (Optional)
                    </label>
                    <input type="text" name="video_url" value="{{ old('video_url') }}" placeholder="https://.../video.mp4"
                           class="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-red-500 focus:outline-none">
                </div>

                <div>
                    <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        Reel Caption / Description
                    </label>
                    <textarea name="caption" rows="3" placeholder="Full caption detailing the parts, fitment and workshop tuning notes..."
                              class="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-red-500 focus:outline-none">{{ old('caption') }}</textarea>
                </div>
            </div>

            <!-- Right Col: Thumbnail, Product Link & Publish Status -->
            <div class="space-y-5">
                <div class="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
                    <h3 class="text-xs font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">Publish Settings</h3>
                    
                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Linked Store Product
                        </label>
                        <select name="product_id" class="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-red-500 focus:outline-none">
                            <option value="">-- No Product Linked --</option>
                            @foreach ($products as $p)
                                <option value="{{ $p->id }}" {{ old('product_id') == $p->id ? 'selected' : '' }}>
                                    {{ $p->title }}
                                </option>
                            @endforeach
                        </select>
                        <p class="text-[11px] text-slate-400 mt-1">Linking a product shows a direct "Shop Part" button on the video.</p>
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Poster / Cover Image (Optional)
                        </label>
                        <input type="file" name="thumbnail_file" accept="image/*"
                               class="w-full rounded-lg border border-slate-300 px-3 py-2 text-xs text-slate-600 file:mr-3 file:rounded file:border-0 file:bg-slate-800 file:px-2.5 file:py-1 file:text-xs file:font-medium file:text-white">
                    </div>

                    <div>
                        <label class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                            Original Instagram Post Link (Optional)
                        </label>
                        <input type="url" name="instagram_url" value="{{ old('instagram_url') }}" placeholder="https://instagram.com/reel/..."
                               class="w-full rounded-lg border border-slate-300 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-red-500 focus:outline-none">
                    </div>

                    <div class="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
                        <div>
                            <label class="block text-[11px] font-bold uppercase text-slate-700 mb-1">Sort Order</label>
                            <input type="number" name="sort_order" value="{{ old('sort_order', 0) }}" class="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs">
                        </div>
                        <div class="flex items-center pt-4">
                            <label class="inline-flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" name="is_active" value="1" {{ old('is_active', true) ? 'checked' : '' }} class="rounded text-red-600 focus:ring-red-500">
                                <span class="text-xs font-bold text-slate-700">Active</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="flex items-center gap-3">
                    <button type="submit" class="flex-1 cursor-pointer rounded-lg bg-red-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-red-700 transition-colors text-center">
                        Publish Video Reel
                    </button>
                </div>
            </div>
        </div>
    </form>
</x-admin.layout>
