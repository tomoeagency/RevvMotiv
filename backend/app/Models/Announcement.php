<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    protected $fillable = ['text', 'link_url', 'sort_order', 'active'];

    protected $casts = [
        'sort_order' => 'integer',
        'active' => 'boolean',
    ];
}
