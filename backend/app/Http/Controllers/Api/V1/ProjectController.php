<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProjectResource;
use App\Models\Project;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request)
    {
        $perPage = min((int) $request->integer('per_page', 12), 50);

        $projects = Project::where('status', 'active')
            ->orderBy('sort_order')
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json([
            'data' => ProjectResource::collection($projects->items()),
            'meta' => [
                'current_page' => $projects->currentPage(),
                'last_page' => $projects->lastPage(),
                'per_page' => $projects->perPage(),
                'total' => $projects->total(),
            ],
        ]);
    }

    public function show(string $slug)
    {
        $project = Project::where('slug', $slug)->where('status', 'active')->with('views')->first();

        if (! $project) {
            return response()->json(['message' => 'Project not found.'], 404);
        }

        return response()->json([
            'data' => new ProjectResource($project),
        ]);
    }
}
