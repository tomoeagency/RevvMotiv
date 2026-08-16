<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectView extends Model
{
    protected $fillable = [
        'project_id', 'view_type', 'images', 'work_description', 'sort_order',
    ];

    protected $casts = [
        'images' => 'array',
        'sort_order' => 'integer',
    ];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
