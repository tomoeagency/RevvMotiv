<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GalleryItem extends Model
{
    protected $fillable = ['media_url', 'media_type', 'caption', 'sort_order', 'active'];

    protected $casts = [
        'sort_order' => 'integer',
        'active' => 'boolean',
    ];
}
