<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Policy;

class PolicyController extends Controller
{
    public function show(string $slug)
    {
        $policy = Policy::where('slug', $slug)->first();

        if (! $policy) {
            return response()->json(['message' => 'Policy not found.'], 404);
        }

        return response()->json([
            'data' => [
                'slug' => $policy->slug,
                'title' => $policy->title,
                'content' => $policy->content, // Markdown
                'updated_at' => $policy->updated_at->toIso8601String(),
            ],
        ]);
    }
}
