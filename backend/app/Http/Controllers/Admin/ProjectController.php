<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectStoreRequest;
use App\Http\Requests\Admin\ProjectUpdateRequest;
use App\Models\Project;
use App\Services\CloudinaryUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Str;
use Illuminate\View\View;
use RuntimeException;

class ProjectController extends Controller
{
    public function index(): View
    {
        $projects = Project::withCount('views')->orderBy('sort_order')->orderByDesc('created_at')->paginate(15);

        return view('admin.projects.index', compact('projects'));
    }

    public function create(): View
    {
        return view('admin.projects.create');
    }

    public function store(ProjectStoreRequest $request, CloudinaryUploadService $uploader): RedirectResponse
    {
        $validated = $request->validated();

        $coverImage = null;
        if ($request->hasFile('cover_image')) {
            try {
                $coverImage = $uploader->upload($request->file('cover_image'), 'revvmotiv/projects')['secure_url'];
            } catch (RuntimeException $e) {
                return back()->withInput()->withErrors(['cover_image' => 'Cover image upload failed: '.$e->getMessage()]);
            }
        }

        $project = Project::create([
            'title' => $validated['title'],
            'slug' => ($validated['slug'] ?? null) ?: Str::slug($validated['title']),
            'car_make' => $validated['car_make'],
            'car_model' => $validated['car_model'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'sort_order' => $validated['sort_order'] ?? 0,
            'cover_image' => $coverImage,
        ]);

        return redirect()->route('admin.projects.edit', $project)
            ->with('status', "Project \"{$project->title}\" created. Now add its views below.");
    }

    public function edit(Project $project): View
    {
        $project->load('views');

        return view('admin.projects.edit', compact('project'));
    }

    public function update(ProjectUpdateRequest $request, Project $project, CloudinaryUploadService $uploader): RedirectResponse
    {
        $validated = $request->validated();

        $coverImage = $project->cover_image;
        if ($request->hasFile('cover_image')) {
            try {
                $coverImage = $uploader->upload($request->file('cover_image'), 'revvmotiv/projects')['secure_url'];
            } catch (RuntimeException $e) {
                return back()->withInput()->withErrors(['cover_image' => 'Cover image upload failed: '.$e->getMessage()]);
            }
        }

        $project->update([
            'title' => $validated['title'],
            'slug' => ($validated['slug'] ?? null) ?: Str::slug($validated['title']),
            'car_make' => $validated['car_make'],
            'car_model' => $validated['car_model'],
            'description' => $validated['description'] ?? null,
            'status' => $validated['status'],
            'sort_order' => $validated['sort_order'] ?? 0,
            'cover_image' => $coverImage,
        ]);

        return redirect()->route('admin.projects.edit', $project)->with('status', "Project \"{$project->title}\" updated.");
    }

    public function destroy(Project $project): RedirectResponse
    {
        $title = $project->title;
        $project->delete(); // cascades to project_views

        return redirect()->route('admin.projects.index')->with('status', "Project \"{$title}\" and its views deleted.");
    }
}
