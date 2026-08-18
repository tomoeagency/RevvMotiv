<x-admin.layout title="Our Work">
    <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 class="text-base font-semibold text-slate-800">Featured Garage Projects</h2>
            <p class="text-xs text-slate-500">Showcased vehicle transformation builds on the storefront's /work page.</p>
        </div>

        <div class="flex items-center gap-3">
            <!-- Grid / List Toggle -->
            <div class="inline-flex items-center rounded-lg border border-slate-300 bg-white p-1 shadow-sm">
                <button type="button" id="btnListViewProjects" onclick="setProjectViewMode('list')"
                        class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-900"
                        title="List View">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span class="hidden sm:inline">List</span>
                </button>
                <button type="button" id="btnGridViewProjects" onclick="setProjectViewMode('grid')"
                        class="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:text-slate-900"
                        title="Grid View">
                    <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    <span class="hidden sm:inline">Grid</span>
                </button>
            </div>

            <a href="{{ route('admin.projects.create') }}" class="cursor-pointer rounded-lg bg-[#1e3a5f] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d]">
                + New Project
            </a>
        </div>
    </div>

    <!-- 1. TABLE LIST VIEW -->
    <div id="projectListView">
        <x-admin.data-table :headers="['Cover', 'Title', 'Vehicle', 'Views', 'Status', '']" :paginator="$projects">
            @foreach ($projects as $project)
                <tr>
                    <td class="px-4 py-2.5">
                        @if ($project->cover_image)
                            <img src="{{ $project->cover_image }}" alt="" class="h-10 w-16 rounded object-cover">
                        @else
                            <div class="h-10 w-16 rounded bg-slate-100"></div>
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
    </div>

    <!-- 2. CARDS GRID VIEW -->
    <div id="projectGridView" class="hidden">
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
            @foreach ($projects as $project)
                <div class="group relative flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                    <!-- Project Cover Image -->
                    <div class="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                        @if ($project->cover_image)
                            <img src="{{ $project->cover_image }}" alt="{{ $project->title }}"
                                 class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
                        @else
                            <div class="flex h-full w-full items-center justify-center text-slate-400">
                                <span class="text-xs">No Cover</span>
                            </div>
                        @endif

                        <!-- Floating Badges -->
                        <div class="absolute inset-x-2.5 top-2.5 flex items-center justify-between">
                            <span class="rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-semibold text-white backdrop-blur-sm">
                                {{ $project->car_make }} {{ $project->car_model }}
                            </span>
                            <span class="rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-bold text-slate-200 backdrop-blur-sm">
                                {{ $project->views_count }} views
                            </span>
                        </div>
                    </div>

                    <!-- Card Body -->
                    <div class="flex flex-1 flex-col p-4">
                        <h3 class="mb-1 text-base font-bold text-slate-900 line-clamp-1" title="{{ $project->title }}">
                            {{ $project->title }}
                        </h3>
                        <p class="mb-3 text-xs text-slate-500 line-clamp-2">
                            {{ $project->description ?? 'Custom performance build' }}
                        </p>

                        <!-- Bottom Card Actions -->
                        <div class="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                            <x-admin.status-badge :status="$project->status" />

                            <div class="flex items-center gap-2">
                                <a href="{{ route('admin.projects.edit', $project) }}" 
                                   class="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 font-semibold text-slate-700 hover:bg-slate-200">
                                    <x-admin.icon name="edit" class="h-3 w-3" />
                                    <span>Edit</span>
                                </a>
                                <x-admin.delete-button :action="route('admin.projects.destroy', $project)" confirm="Delete this project? This cannot be undone." />
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <div class="mt-6">
            {{ $projects->links() }}
        </div>
    </div>

    <script>
        function setProjectViewMode(mode) {
            const listEl = document.getElementById('projectListView');
            const gridEl = document.getElementById('projectGridView');
            const btnList = document.getElementById('btnListViewProjects');
            const btnGrid = document.getElementById('btnGridViewProjects');

            if (mode === 'grid') {
                listEl.classList.add('hidden');
                gridEl.classList.remove('hidden');
                btnGrid.classList.add('bg-[#1e3a5f]', 'text-white');
                btnGrid.classList.remove('text-slate-700');
                btnList.classList.remove('bg-[#1e3a5f]', 'text-white');
                btnList.classList.add('text-slate-700');
                localStorage.setItem('admin_view_mode_projects', 'grid');
            } else {
                gridEl.classList.add('hidden');
                listEl.classList.remove('hidden');
                btnList.classList.add('bg-[#1e3a5f]', 'text-white');
                btnList.classList.remove('text-slate-700');
                btnGrid.classList.remove('bg-[#1e3a5f]', 'text-white');
                btnGrid.classList.add('text-slate-700');
                localStorage.setItem('admin_view_mode_projects', 'list');
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            const savedMode = localStorage.getItem('admin_view_mode_projects') || 'grid';
            setProjectViewMode(savedMode);
        });
    </script>
</x-admin.layout>
