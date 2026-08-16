<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use RuntimeException;

// Thin wrapper around Cloudinary's signed upload HTTP API — no SDK
// dependency needed, Laravel's HTTP client (Guzzle) already ships with
// the framework. Signing prevents arbitrary uploads to the account by
// anyone who can read the (public) cloud name.
class CloudinaryUploadService
{
    public function upload(UploadedFile $file, string $folder): array
    {
        $cloudName = config('services.cloudinary.cloud_name');
        $apiKey = config('services.cloudinary.api_key');
        $apiSecret = config('services.cloudinary.api_secret');

        if (! $cloudName || ! $apiKey || ! $apiSecret) {
            throw new RuntimeException('Cloudinary is not configured — set CLOUDINARY_* in .env.');
        }

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

        if ($response->failed()) {
            throw new RuntimeException('Cloudinary upload failed: '.$response->body());
        }

        return $response->json();
    }

    /** @return string[] Cloudinary secure_urls, in the same order as $files. */
    public function uploadMany(array $files, string $folder): array
    {
        return collect($files)
            // A multi-file <input> can hand back an entry with no file
            // actually attached (browser-dependent quirk on empty array-name
            // inputs) — isValid() is false for those, filter them out before
            // wasting an upload call on them.
            ->filter(fn ($file) => $file instanceof UploadedFile && $file->isValid())
            ->map(fn (UploadedFile $file) => $this->upload($file, $folder)['secure_url'])
            ->all();
    }
}
