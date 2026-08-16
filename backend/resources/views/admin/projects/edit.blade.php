<x-admin.layout title="Edit Project">
    @include('admin.projects._form')

    <div class="mt-10 max-w-2xl">
        <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-900">Views</h2>
            <a href="{{ route('admin.projects.views.create', $project) }}" class="cursor-pointer rounded-md bg-slate-200 px-3 py-1.5 text-sm hover:bg-slate-300">
                + Add View
            </a>
        </div>

        @if ($project->views->isEmpty())
            <div class="admin-card flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-10 text-center shadow-sm">
                <x-admin.icon name="inbox" class="h-7 w-7 text-slate-300" />
                <p class="text-sm text-slate-500">No views yet — add front, rear, side, or interior shots with a description of the work done.</p>
            </div>
        @else
            <div class="space-y-3">
                @foreach ($project->views as $view)
                    <div class="admin-card flex items-start gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <div class="flex shrink-0 gap-1">
                            @forelse (array_slice($view->images ?? [], 0, 3) as $url)
                                <img src="{{ $url }}" alt="" class="h-14 w-14 rounded object-cover">
                            @empty
                                <div class="flex h-14 w-14 items-center justify-center rounded bg-slate-100 text-xs text-slate-400">No images</div>
                            @endforelse
                        </div>
                        <div class="min-w-0 flex-1">
                            <p class="text-sm font-semibold capitalize text-slate-900">{{ $view->view_type }}</p>
                            <p class="mt-0.5 line-clamp-2 text-sm text-slate-500">{{ $view->work_description ?? 'No description.' }}</p>
                        </div>
                        <div class="flex shrink-0 items-center gap-3 text-sm">
                            <a href="{{ route('admin.projects.views.edit', [$project, $view]) }}" class="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                            <x-admin.delete-button :action="route('admin.projects.views.destroy', [$project, $view])" confirm="Remove this view?" />
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
</x-admin.layout>
