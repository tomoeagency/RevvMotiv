@php $policy = $policy ?? null; @endphp
<form method="POST" action="{{ $policy ? route('admin.policies.update', $policy) : route('admin.policies.store') }}" class="max-w-3xl space-y-1">
    @csrf
    @if ($policy) @method('PUT') @endif

    <div class="grid grid-cols-2 gap-4">
        <x-admin.form-field name="title" label="Title" required>
            <input type="text" name="title" id="title" value="{{ old('title', $policy->title ?? '') }}" required
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
        </x-admin.form-field>

        <x-admin.form-field name="slug" label="Slug" hint="Used in the public URL/API — changing it may break existing frontend links." required>
            <input type="text" name="slug" id="slug" value="{{ old('slug', $policy->slug ?? '') }}" required
                   class="block w-full rounded-md border-slate-300 font-mono shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
        </x-admin.form-field>
    </div>

    <x-admin.form-field name="content" label="Content" hint="Markdown — headings (##), bold (**text**), and bullet lists (- item) are supported by the storefront's renderer." required>
        <textarea name="content" id="content" rows="20"
                  class="block w-full rounded-md border-slate-300 font-mono text-sm shadow-sm focus:border-slate-500 focus:ring-slate-500">{{ old('content', $policy->content ?? '') }}</textarea>
    </x-admin.form-field>

    <div class="flex gap-3 pt-2">
        <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            {{ $policy ? 'Save changes' : 'Create policy' }}
        </button>
        <a href="{{ route('admin.policies.index') }}" class="rounded-md px-4 py-2 text-sm text-slate-600 hover:bg-slate-100">Cancel</a>
    </div>
</form>
