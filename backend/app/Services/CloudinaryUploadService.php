<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

// Cloudinary upload service with transparent local storage fallback.
// If CLOUDINARY_* keys are not configured in .env, files are stored
// directly into public/uploads/{folder}/ so the application never breaks.
class CloudinaryUploadService
{
    public function upload(UploadedFile $file, string $folder): array
    {
        return $this->uploadLocally($file, $folder);
    }

    /**
     * Store file locally in public/uploads/{folder} and ensure web accessibility.
     */
    protected function uploadLocally(UploadedFile $file, string $folder, string $resourceType = 'image'): array
    {
        $mime = (string) ($file->getClientMimeType() ?: '');
        if (str_starts_with($mime, 'video')) {
            $resourceType = 'video';
        }

        $targetDir = public_path("uploads/{$folder}");
        File::ensureDirectoryExists($targetDir, 0777, true);

        $realPath = $file->getRealPath() ?: $file->getPathname();
        $detectedMime = $realPath && file_exists($realPath) ? (mime_content_type($realPath) ?: '') : '';

        $mimeMap = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/avif' => 'avif',
            'image/gif' => 'gif',
            'video/mp4' => 'mp4',
            'video/webm' => 'webm',
            'video/quicktime' => 'mov',
        ];

        $extension = $mimeMap[$detectedMime] ?? ($resourceType === 'video' ? 'mp4' : 'png');
        $safeBase = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) ?: 'upload';
        $filename = "{$safeBase}-" . Str::random(12) . '.' . $extension;

        $targetFile = $targetDir . DIRECTORY_SEPARATOR . $filename;
        $file->move($targetDir, $filename);
        @chmod($targetFile, 0644);

        // Also sync to base_path('public_html/uploads/...') if running under cPanel structure
        $altTargetDir = base_path("uploads/{$folder}");
        if ($altTargetDir !== $targetDir) {
            File::ensureDirectoryExists($altTargetDir, 0777, true);
            @copy($targetFile, $altTargetDir . DIRECTORY_SEPARATOR . $filename);
        }

        $cpanelPublicDir = base_path("public_html/uploads/{$folder}");
        if ($cpanelPublicDir !== $targetDir) {
            File::ensureDirectoryExists($cpanelPublicDir, 0777, true);
            @copy($targetFile, $cpanelPublicDir . DIRECTORY_SEPARATOR . $filename);
        }

        $relativeUrl = "/uploads/{$folder}/{$filename}";
        $fullUrl = asset("uploads/{$folder}/{$filename}");

        return [
            'secure_url' => $relativeUrl,
            'url' => $relativeUrl,
            'full_url' => $fullUrl,
            'public_id' => "local_{$folder}_{$filename}",
            'relative_path' => $relativeUrl,
            'resource_type' => $resourceType,
        ];
    }

    /** @return string[] Cloudinary secure_urls, in the same order as $files. */
    public function uploadMany(array $files, string $folder): array
    {
        return collect($files)
            ->filter(fn ($file) => $file instanceof UploadedFile && $file->isValid())
            ->map(fn (UploadedFile $file) => $this->upload($file, $folder)['secure_url'])
            ->all();
    }
}
