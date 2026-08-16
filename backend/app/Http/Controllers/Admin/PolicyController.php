<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\PolicyStoreRequest;
use App\Http\Requests\Admin\PolicyUpdateRequest;
use App\Models\Policy;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class PolicyController extends Controller
{
    public function index(): View
    {
        $policies = Policy::orderBy('title')->get();

        return view('admin.policies.index', compact('policies'));
    }

    public function create(): View
    {
        return view('admin.policies.create');
    }

    public function store(PolicyStoreRequest $request): RedirectResponse
    {
        Policy::create($request->validated());

        return redirect()->route('admin.policies.index')->with('status', 'Policy created.');
    }

    public function edit(Policy $policy): View
    {
        return view('admin.policies.edit', compact('policy'));
    }

    public function update(PolicyUpdateRequest $request, Policy $policy): RedirectResponse
    {
        $policy->update($request->validated());

        return redirect()->route('admin.policies.index')->with('status', "\"{$policy->title}\" updated.");
    }

    public function destroy(Policy $policy): RedirectResponse
    {
        $title = $policy->title;
        $policy->delete();

        return redirect()->route('admin.policies.index')->with('status', "\"{$title}\" deleted.");
    }
}
