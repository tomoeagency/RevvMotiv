<x-admin.layout title="Policies">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
            <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Legal & Policy Pages</h2>
            <p class="text-xs text-slate-500">Storefront customer agreements, privacy policies, terms, and returns information.</p>
        </div>

        <a href="{{ route('admin.policies.create') }}" class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1e3a5f] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
            <span>+ New Policy</span>
        </a>
    </div>

    <x-admin.data-table :headers="['Document Title', 'API Route Slug', 'Last Revision Date', '']" :paginator="null">
        @foreach ($policies as $policy)
            <tr class="hover:bg-slate-50/70 transition-colors">
                <td class="px-4 py-3 text-xs font-bold text-slate-900">{{ $policy->title }}</td>
                <td class="px-4 py-3 text-xs font-mono text-slate-600">/policies/{{ $policy->slug }}</td>
                <td class="px-4 py-3 text-xs text-slate-500 font-medium">{{ $policy->updated_at->format('d M Y, H:i') }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                    <div class="inline-flex items-center gap-2">
                        <a href="{{ route('admin.policies.edit', $policy) }}" 
                           class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-2xs">
                            <x-admin.icon name="edit" class="h-3 w-3" />
                            <span>Edit</span>
                        </a>
                        <x-admin.delete-button :action="route('admin.policies.destroy', $policy)" confirm="Delete this policy page? It will return 404 on the storefront until replaced." />
                    </div>
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
