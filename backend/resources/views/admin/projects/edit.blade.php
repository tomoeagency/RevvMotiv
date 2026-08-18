<x-admin.layout title="Edit Project">
    @include('admin.projects._form')

    <div class="mt-12 max-w-2xl">
        <div class="mb-4 flex items-center justify-between">
            <div>
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Perspective Views & Angles</h2>
                <p class="text-xs text-slate-500">Angle tabs and photo comparisons displayed on the storefront build page.</p>
            </div>
            <a href="{{ route('admin.projects.views.create', $project) }}" class="inline-flex items-center gap-1.5 rounded-lg bg-[#1e3a5f] px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-[#16304d] transition-all cursor-pointer">
                <span>+ Add Angle View</span>
            </a>
        </div>

        @if ($project->views->isEmpty())
            <div class="flex flex-col items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-12 text-center shadow-xs">
                <div class="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                    <x-admin.icon name="inbox" class="h-6 w-6" />
                </div>
                <p class="text-xs font-medium text-slate-500 max-w-sm">No angle views added yet. Add front, rear, side, or interior perspectives with photos and work descriptions.</p>
            </div>
        @else
            <div class="space-y-3">
                @foreach ($project->views as $view)
                    <div class="flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs hover:border-slate-300 transition-all">
                        <div class="flex shrink-0 gap-1.5">
                            @forelse (array_slice($view->images ?? [], 0, 3) as $url)
                                <img src="{{ $url }}" alt="" class="h-12 w-12 rounded-lg object-cover border border-slate-200 shadow-2xs">
                            @empty
                                <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 text-[10px] font-semibold text-slate-400">No photos</div>
                            @endforelse
                        </div>
                        <div class="min-w-0 flex-1">
                            <span class="text-xs font-bold uppercase tracking-wider capitalize text-slate-900 block">{{ $view->view_type }} View</span>
                            <p class="mt-1 line-clamp-2 text-xs text-slate-600 leading-relaxed">{{ $view->work_description ?? 'No specific angle work notes provided.' }}</p>
                        </div>
                        <div class="flex shrink-0 items-center gap-2 text-xs">
                            <a href="{{ route('admin.projects.views.edit', [$project, $view]) }}" 
                               class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs">
                                <x-admin.icon name="edit" class="h-3 w-3" />
                                <span>Edit</span>
                            </a>
                            <x-admin.delete-button :action="route('admin.projects.views.destroy', [$project, $view])" confirm="Remove this perspective view?" />
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</x-admin.layout>
