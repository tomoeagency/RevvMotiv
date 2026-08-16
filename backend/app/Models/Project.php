<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = [
        'title', 'slug', 'car_make', 'car_model', 'cover_image', 'description', 'status', 'sort_order',
    ];

    protected $casts = [
        'sort_order' => 'integer',
    ];

    public function views(): HasMany
    {
        return $this->hasMany(ProjectView::class)->orderBy('sort_order');
    }
}
