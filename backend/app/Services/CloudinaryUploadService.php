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
        $cloudName = config('services.cloudinary.cloud_name');
        $apiKey = config('services.cloudinary.api_key');
        $apiSecret = config('services.cloudinary.api_secret');

        // If Cloudinary credentials are configured, attempt Cloudinary upload
        if ($cloudName && $apiKey && $apiSecret) {
            try {
                $timestamp = time();
                $paramsToSign = ['folder' => $folder, 'timestamp' => $timestamp];
                ksort($paramsToSign);
                $signable = collect($paramsToSign)
                    ->map(fn ($value, $key) => "{$key}={$value}")
                    ->implode('&');
                $signature = sha1($signable.$apiSecret);

                $resourceType = str_starts_with((string) $file->getMimeType(), 'video') ? 'video' : 'image';

                $response = Http::attach('file', file_get_contents($file->getRealPath()), $file->getClientOriginalName())
                    ->post("https://api.cloudinary.com/v1_1/{$cloudName}/{$resourceType}/upload", [
                        'api_key' => $apiKey,
                        'timestamp' => $timestamp,
                        'folder' => $folder,
                        'signature' => $signature,
                    ]);

                if ($response->successful()) {
                    return $response->json();
                }
            } catch (\Throwable $e) {
                report($e);
            }
        }

        // Fallback: Store locally in public/uploads/{folder}
        return $this->uploadLocally($file, $folder);
    }

    /**
     * Store file locally and return Cloudinary-compatible array structure.
     */
    protected function uploadLocally(UploadedFile $file, string $folder): array
    {
        $targetDir = public_path("uploads/{$folder}");
        File::ensureDirectoryExists($targetDir);

        $extension = $file->getClientOriginalExtension() ?: 'png';
        $filename = Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '-' . Str::random(8) . '.' . $extension;

        $file->move($targetDir, $filename);

        $relativeUrl = "/uploads/{$folder}/{$filename}";
        $fullUrl = asset("uploads/{$folder}/{$filename}");

        return [
            'secure_url' => $fullUrl,
            'url' => $fullUrl,
            'public_id' => "local_{$folder}_{$filename}",
            'relative_path' => $relativeUrl,
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
