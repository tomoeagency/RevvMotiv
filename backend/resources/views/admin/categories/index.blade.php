<x-admin.layout title="Categories">
    <div class="mb-4 flex justify-end">
        <a href="{{ route('admin.categories.create') }}" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            + New Category
        </a>
    </div>

    <x-admin.data-table :headers="['Name', 'Slug', 'Products', '']" :paginator="$categories">
        @foreach ($categories as $category)
            <tr>
                <td class="px-4 py-2.5 font-medium text-slate-900">{{ $category->name }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $category->slug }}</td>
                <td class="px-4 py-2.5 text-slate-600">{{ $category->products_count }}</td>
                <td class="px-4 py-2.5 text-right">
                    <a href="{{ route('admin.categories.edit', $category) }}" class="mr-3 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                    <x-admin.delete-button :action="route('admin.categories.destroy', $category)" confirm="Delete this category?" />
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
