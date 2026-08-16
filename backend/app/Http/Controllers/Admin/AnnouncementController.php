<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AnnouncementStoreRequest;
use App\Models\Announcement;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class AnnouncementController extends Controller
{
    public function index(): View
    {
        $announcements = Announcement::orderBy('sort_order')->orderByDesc('created_at')->paginate(20);

        return view('admin.announcements.index', compact('announcements'));
    }

    public function create(): View
    {
        return view('admin.announcements.create');
    }

    public function store(AnnouncementStoreRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $validated['active'] = $request->boolean('active');

        Announcement::create($validated);

        return redirect()->route('admin.announcements.index')->with('status', 'Announcement created.');
    }

    public function edit(Announcement $announcement): View
    {
        return view('admin.announcements.edit', compact('announcement'));
    }

    public function update(AnnouncementStoreRequest $request, Announcement $announcement): RedirectResponse
    {
        $validated = $request->validated();
        $validated['active'] = $request->boolean('active');

        $announcement->update($validated);

        return redirect()->route('admin.announcements.index')->with('status', 'Announcement updated.');
    }

    public function destroy(Announcement $announcement): RedirectResponse
    {
        $announcement->delete();

        return redirect()->route('admin.announcements.index')->with('status', 'Announcement deleted.');
    }
}
