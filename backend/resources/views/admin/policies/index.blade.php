<x-admin.layout title="Policies">
    <p class="mb-4 text-sm text-slate-500">
        Legal and policy pages consumed by the storefront via <code class="rounded bg-slate-100 px-1 py-0.5 text-xs">GET /api/v1/policies/{slug}</code>. Content is Markdown.
    </p>

    <div class="mb-4 flex justify-end">
        <a href="{{ route('admin.policies.create') }}" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            + New Policy
        </a>
    </div>

    <x-admin.data-table :headers="['Title', 'Slug', 'Last updated', '']" :paginator="null">
        @foreach ($policies as $policy)
            <tr>
                <td class="px-4 py-2.5 font-medium text-slate-900">{{ $policy->title }}</td>
                <td class="px-4 py-2.5 font-mono text-xs text-slate-500">{{ $policy->slug }}</td>
                <td class="px-4 py-2.5 text-slate-500">{{ $policy->updated_at->format('d M Y, H:i') }}</td>
                <td class="px-4 py-2.5 text-right">
                    <a href="{{ route('admin.policies.edit', $policy) }}" class="mr-3 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                    <x-admin.delete-button :action="route('admin.policies.destroy', $policy)" confirm="Delete this policy page? It will 404 on the storefront until replaced." />
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
