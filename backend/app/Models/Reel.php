<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Reel extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'car',
        'category',
        'tag',
        'video_path',
        'thumbnail_path',
        'product_id',
        'caption',
        'instagram_url',
        'views_count',
        'sort_order',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sort_order' => 'integer',
        'views_count' => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function getVideoUrlAttribute(): string
    {
        if (str_starts_with($this->video_path, 'http://') || str_starts_with($this->video_path, 'https://') || str_starts_with($this->video_path, '/')) {
            return $this->video_path;
        }

        return Storage::disk('public')->url($this->video_path);
    }

    public function getThumbnailUrlAttribute(): ?string
    {
        if (!$this->thumbnail_path) {
            return null;
        }

        if (str_starts_with($this->thumbnail_path, 'http://') || str_starts_with($this->thumbnail_path, 'https://') || str_starts_with($this->thumbnail_path, '/')) {
            return $this->thumbnail_path;
        }

        return Storage::disk('public')->url($this->thumbnail_path);
    }
}
