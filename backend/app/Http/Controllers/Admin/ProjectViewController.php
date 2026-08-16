<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ProjectViewStoreRequest;
use App\Models\Project;
use App\Models\ProjectView;
use App\Services\CloudinaryUploadService;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use RuntimeException;

class ProjectViewController extends Controller
{
    public function create(Project $project): View
    {
        return view('admin.projects.views.create', compact('project'));
    }

    public function store(ProjectViewStoreRequest $request, Project $project, CloudinaryUploadService $uploader): RedirectResponse
    {
        $validated = $request->validated();

        try {
            $images = $uploader->uploadMany($request->file('images', []), 'revvmotiv/projects');
        } catch (RuntimeException $e) {
            return back()->withInput()->withErrors(['images' => 'Image upload failed: '.$e->getMessage()]);
        }

        $project->views()->create([
            'view_type' => $validated['view_type'],
            'work_description' => $validated['work_description'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'images' => $images,
        ]);

        return redirect()->route('admin.projects.edit', $project)->with('status', 'View added.');
    }

    public function edit(Project $project, ProjectView $view): View
    {
        return view('admin.projects.views.edit', compact('project', 'view'));
    }

    public function update(ProjectViewStoreRequest $request, Project $project, ProjectView $view, CloudinaryUploadService $uploader): RedirectResponse
    {
        $validated = $request->validated();

        $images = collect($view->images ?? [])
            ->reject(fn ($url) => in_array($url, $validated['remove_images'] ?? [], true))
            ->values()
            ->all();

        try {
            $newImages = $uploader->uploadMany($request->file('images', []), 'revvmotiv/projects');
        } catch (RuntimeException $e) {
            return back()->withInput()->withErrors(['images' => 'Image upload failed: '.$e->getMessage()]);
        }

        $view->update([
            'view_type' => $validated['view_type'],
            'work_description' => $validated['work_description'] ?? null,
            'sort_order' => $validated['sort_order'] ?? 0,
            'images' => [...$images, ...$newImages],
        ]);

        return redirect()->route('admin.projects.edit', $project)->with('status', 'View updated.');
    }

    public function destroy(Project $project, ProjectView $view): RedirectResponse
    {
        $view->delete();

        return redirect()->route('admin.projects.edit', $project)->with('status', 'View removed.');
    }
}
