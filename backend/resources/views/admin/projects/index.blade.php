<x-admin.layout title="Our Work">
    <div class="mb-4 flex justify-end">
        <a href="{{ route('admin.projects.create') }}" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            + New Project
        </a>
    </div>

    <x-admin.data-table :headers="['Cover', 'Title', 'Vehicle', 'Views', 'Status', '']" :paginator="$projects">
        @foreach ($projects as $project)
            <tr>
                <td class="px-4 py-2.5">
                    @if ($project->cover_image)
                        <img src="{{ $project->cover_image }}" alt="" class="h-10 w-14 rounded object-cover">
                    @else
                        <div class="h-10 w-14 rounded bg-slate-100"></div>
                    @endif
                </td>
                <td class="px-4 py-2.5 font-medium text-slate-900">{{ $project->title }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $project->car_make }} {{ $project->car_model }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $project->views_count }}</td>
                <td class="px-4 py-2.5"><x-admin.status-badge :status="$project->status" /></td>
                <td class="px-4 py-2.5 text-right">
                    <a href="{{ route('admin.projects.edit', $project) }}" class="mr-3 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                    <x-admin.delete-button :action="route('admin.projects.destroy', $project)" confirm="Delete this project and all its views? This cannot be undone." />
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
