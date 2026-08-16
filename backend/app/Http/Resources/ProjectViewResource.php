<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProjectViewResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'view_type' => $this->view_type,
            'images' => $this->images ?? [],
            'work_description' => $this->work_description,
        ];
    }
}
