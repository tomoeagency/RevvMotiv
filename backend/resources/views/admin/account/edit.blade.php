<x-admin.layout title="My Account">
    <form method="POST" action="{{ route('admin.account.update') }}" enctype="multipart/form-data" class="max-w-md space-y-1">
        @csrf
        @method('PUT')

        <div class="mb-4 flex items-center gap-4">
            @if ($admin->avatar_url)
                <img src="{{ $admin->avatar_url }}" alt="" class="h-16 w-16 rounded-full object-cover">
            @else
                <div class="flex h-16 w-16 items-center justify-center rounded-full bg-slate-200 text-lg font-semibold text-slate-500">
                    {{ strtoupper(substr($admin->name, 0, 1)) }}
                </div>
            @endif
            <div class="flex-1">
                <label for="avatar" class="mb-1 block text-sm font-medium text-slate-700">Profile image</label>
                <input type="file" name="avatar" id="avatar" accept="image/png,image/jpeg,image/webp"
                       class="block w-full text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-sm hover:file:bg-slate-300">
                @error('avatar')
                    <p class="mt-1 text-xs text-red-600">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <x-admin.form-field name="name" label="Name" required>
            <input type="text" name="name" id="name" value="{{ old('name', $admin->name) }}" required
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
        </x-admin.form-field>

        <x-admin.form-field name="email" label="Email" required>
            <input type="email" name="email" id="email" value="{{ old('email', $admin->email) }}" required
                   class="block w-full rounded-md border-slate-300 shadow-sm focus:border-slate-500 focus:ring-slate-500 sm:text-sm">
        </x-admin.form-field>

        <x-admin.form-field name="password" label="New password" hint="Leave both password fields blank to keep your current password.">
            <x-admin.password-input name="password" autocomplete="new-password" />
        </x-admin.form-field>

        <x-admin.form-field name="password_confirmation" label="Confirm new password">
            <x-admin.password-input name="password_confirmation" autocomplete="new-password" />
        </x-admin.form-field>

        <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
            Save changes
        </button>
    </form>
</x-admin.layout>
