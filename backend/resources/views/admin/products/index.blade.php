<x-admin.layout title="Products">
    <div class="mb-4 flex items-center justify-between gap-4">
        <form method="GET" class="flex gap-2">
            <input type="text" name="search" value="{{ request('search') }}" placeholder="Search by title..."
                   class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
            <select name="status" class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                <option value="">All statuses</option>
                <option value="active" @selected(request('status') === 'active')>Active</option>
                <option value="draft" @selected(request('status') === 'draft')>Draft</option>
            </select>
            <select name="category" class="rounded-md border-slate-300 text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">
                <option value="">All categories</option>
                @foreach ($categories as $category)
                    <option value="{{ $category->id }}" @selected((int) request('category') === $category->id)>{{ $category->name }}</option>
                @endforeach
            </select>
            <button type="submit" class="rounded-md bg-slate-200 px-3 py-1.5 text-sm hover:bg-slate-300">Filter</button>
        </form>
        <a href="{{ route('admin.products.create') }}" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            + New Product
        </a>
    </div>

    <x-admin.data-table :headers="['Product', 'Category', 'Price', 'Stock', 'Featured', 'Status', '']" :paginator="$products">
        @foreach ($products as $product)
            <tr>
                <td class="flex items-center gap-3 px-4 py-2.5">
                    @if ($product->images[0] ?? null)
                        <img src="{{ $product->images[0] }}" alt="" class="h-10 w-10 rounded object-cover">
                    @else
                        <div class="h-10 w-10 rounded bg-slate-100"></div>
                    @endif
                    <span class="font-medium text-slate-900">{{ $product->title }}</span>
                </td>
                <td class="px-4 py-2.5 text-slate-600">{{ $product->category?->name ?? '—' }}</td>
                <td class="px-4 py-2.5 text-slate-600">₹{{ number_format((float) $product->price, 2) }}</td>
                <td class="px-4 py-2.5">
                    <span class="{{ $product->stock < 5 ? 'font-semibold text-red-600' : 'text-slate-600' }}">
                        {{ $product->stock }}
                    </span>
                </td>
                <td class="px-4 py-2.5 text-slate-600">{{ $product->is_featured ? 'Yes' : 'No' }}</td>
                <td class="px-4 py-2.5"><x-admin.status-badge :status="$product->status" /></td>
                <td class="px-4 py-2.5 text-right">
                    <a href="{{ route('admin.products.edit', $product->id) }}" class="mr-3 inline-flex items-center gap-1 text-slate-600 hover:text-slate-900"><x-admin.icon name="edit" class="h-3.5 w-3.5" />Edit</a>
                    <x-admin.delete-button :action="route('admin.products.destroy', $product->id)" confirm="Delete this product? This cannot be undone." />
                </td>
            </tr>
        @endforeach
    </x-admin.data-table>
</x-admin.layout>
