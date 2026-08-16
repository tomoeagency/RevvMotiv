<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'slug' => $this->slug,
            'car_make' => $this->car_make,
            'car_model' => $this->car_model,
            'cover_image' => $this->cover_image,
            'description' => $this->description,
            'views' => ProjectViewResource::collection($this->whenLoaded('views')),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
