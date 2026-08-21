<x-admin.layout title="Upload Gallery Media (Single & Bulk)">
    <div class="mb-5 flex items-center justify-between">
        <a href="{{ route('admin.gallery.index') }}" class="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Gallery</span>
        </a>
    </div>

    @if ($errors->any())
        <div class="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800 shadow-sm">
            <div class="font-bold mb-1">Please fix the following issues:</div>
            <ul class="list-disc list-inside space-y-1 text-xs">
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif

    <form method="POST" action="{{ route('admin.gallery.store') }}" enctype="multipart/form-data" id="galleryUploadForm" class="space-y-6 max-w-2xl">
        @csrf

        <!-- 1. Drag & Drop Multi-file Area -->
        <div>
            <label class="block text-sm font-bold text-slate-800 mb-2">
                Select or Drop Media Files <span class="text-red-500">*</span>
                <span class="ml-1 text-xs font-normal text-slate-500">(Bulk upload supported — select multiple photos or videos)</span>
            </label>

            <div id="dropZone"
                 class="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-8 text-center transition-all hover:border-slate-400 hover:bg-slate-100/70 cursor-pointer">
                <input type="file" name="media[]" id="mediaInput" multiple accept="image/*,video/*" required
                       class="absolute inset-0 h-full w-full opacity-0 cursor-pointer z-10" />

                <div class="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-md text-slate-700 mb-3">
                    <svg class="h-7 w-7 text-[#1e3a5f]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>

                <div class="text-sm font-bold text-slate-800 mb-1">
                    Drag and drop photos/videos here, or <span class="text-[#1e3a5f] underline">browse files</span>
                </div>
                <p class="text-xs text-slate-500 max-w-sm">
                    Supports JPG, PNG, WEBP, MP4, MOV, WEBM. You can select multiple files at once.
                </p>
            </div>
        </div>

        <!-- 2. Selected Files Live Preview Grid -->
        <div id="previewSection" class="hidden">
            <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Selected Files (<span id="fileCountBadge">0</span>)
                </span>
                <button type="button" id="clearFilesBtn" class="text-xs font-semibold text-red-600 hover:text-red-800">
                    Clear selection
                </button>
            </div>

            <div id="previewGrid" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <!-- Javascript populated preview cards -->
            </div>
        </div>

        <!-- 3. Metadata Fields (Category, Optional Default Caption & Starting Sort) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div>
                <label for="category" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Category <span class="text-slate-400 font-normal">(Optional)</span>
                </label>
                <select name="category" id="category"
                        class="block w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                    <option value="">Uncategorized</option>
                    @foreach (\App\Models\GalleryItem::CATEGORIES as $value => $label)
                        <option value="{{ $value }}" @selected(old('category') === $value)>{{ $label }}</option>
                    @endforeach
                </select>
                <p class="mt-1 text-[11px] text-slate-400">Powers the filter buttons on the public gallery page.</p>
            </div>

            <div>
                <label for="caption" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Default Caption <span class="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input type="text" name="caption" id="caption" value="{{ old('caption') }}" placeholder="e.g. Workshop Carbon Installation"
                       class="block w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                <p class="mt-1 text-[11px] text-slate-400">Will be applied to uploaded media without captions.</p>
            </div>

            <div>
                <label for="sort_order" class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Starting Sort Order <span class="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input type="number" min="0" name="sort_order" id="sort_order" value="{{ old('sort_order', 0) }}"
                       class="block w-full rounded-lg border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                <p class="mt-1 text-[11px] text-slate-400">Lower numbers appear first in the gallery.</p>
            </div>
        </div>

        <!-- 4. Submit & Actions -->
        <div class="flex items-center gap-3 pt-2">
            <button type="submit" id="submitBtn"
                    class="inline-flex items-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#16304d] transition-all hover:scale-105">
                <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span id="submitBtnText">Upload All Files</span>
            </button>

            <a href="{{ route('admin.gallery.index') }}" class="rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100">
                Cancel
            </a>
        </div>
    </form>

    <script>
        const mediaInput = document.getElementById('mediaInput');
        const previewSection = document.getElementById('previewSection');
        const previewGrid = document.getElementById('previewGrid');
        const fileCountBadge = document.getElementById('fileCountBadge');
        const clearFilesBtn = document.getElementById('clearFilesBtn');
        const submitBtn = document.getElementById('submitBtn');
        const submitBtnText = document.getElementById('submitBtnText');
        const uploadForm = document.getElementById('galleryUploadForm');

        // This server's PHP max_file_uploads is 20 (a PHP_INI_SYSTEM
        // setting — can't be raised via .user.ini or app code, only the
        // hosting control panel's PHP settings). Above that, PHP silently
        // drops the extra files before Laravel ever sees them, so anything
        // selected past #20 is capped here instead — same effective limit,
        // but the admin is actually told about it rather than losing files
        // with no explanation.
        const MAX_FILES_PER_BATCH = 20;
        mediaInput.addEventListener('change', handleFileSelect);

        function handleFileSelect(e) {
            let files = e.target.files;
            if (!files || files.length === 0) {
                previewSection.classList.add('hidden');
                previewGrid.innerHTML = '';
                submitBtnText.textContent = 'Upload All Files';
                return;
            }

            if (files.length > MAX_FILES_PER_BATCH) {
                const dataTransfer = new DataTransfer();
                Array.from(files).slice(0, MAX_FILES_PER_BATCH).forEach((f) => dataTransfer.items.add(f));
                mediaInput.files = dataTransfer.files;
                files = mediaInput.files;
                alert(`This server accepts a maximum of ${MAX_FILES_PER_BATCH} files per upload. The first ${MAX_FILES_PER_BATCH} are selected — upload the rest as a separate batch.`);
            }

            fileCountBadge.textContent = files.length;
            submitBtnText.textContent = `Upload ${files.length} File${files.length > 1 ? 's' : ''}`;
            previewGrid.innerHTML = '';
            previewSection.classList.remove('hidden');

            Array.from(files).forEach((file, idx) => {
                const isVideo = file.type.startsWith('video');
                const card = document.createElement('div');
                card.className = 'relative flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white p-2 text-xs shadow-sm';

                const mediaPreview = document.createElement('div');
                mediaPreview.className = 'relative aspect-square w-full rounded bg-slate-100 overflow-hidden mb-1.5 flex items-center justify-center';

                if (isVideo) {
                    const vid = document.createElement('video');
                    vid.src = URL.createObjectURL(file);
                    vid.className = 'h-full w-full object-cover';
                    vid.muted = true;
                    mediaPreview.appendChild(vid);

                    const badge = document.createElement('span');
                    badge.className = 'absolute bottom-1 right-1 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-white';
                    badge.textContent = 'VIDEO';
                    mediaPreview.appendChild(badge);
                } else {
                    const img = document.createElement('img');
                    img.src = URL.createObjectURL(file);
                    img.className = 'h-full w-full object-cover';
                    mediaPreview.appendChild(img);
                }

                const fileName = document.createElement('span');
                fileName.className = 'font-bold text-slate-800 truncate block';
                fileName.textContent = file.name;

                const fileSize = document.createElement('span');
                fileSize.className = 'text-[10px] text-slate-400 block';
                fileSize.textContent = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

                card.appendChild(mediaPreview);
                card.appendChild(fileName);
                card.appendChild(fileSize);
                previewGrid.appendChild(card);
            });
        }

        clearFilesBtn.addEventListener('click', () => {
            mediaInput.value = '';
            previewSection.classList.add('hidden');
            previewGrid.innerHTML = '';
            submitBtnText.textContent = 'Upload All Files';
        });

        uploadForm.addEventListener('submit', () => {
            submitBtn.disabled = true;
            submitBtn.classList.add('opacity-75', 'cursor-not-allowed');
            submitBtnText.textContent = 'Uploading files to server...';
        });
    </script>
</x-admin.layout>
