<x-admin.layout title="My Account">
    <div class="max-w-xl space-y-6">
        <form method="POST" action="{{ route('admin.account.update') }}" enctype="multipart/form-data" class="space-y-6">
            @csrf
            @method('PUT')

            <!-- Profile Overview Card -->
            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                    Administrator Profile
                </h2>

                <!-- Avatar Upload Section -->
                <div class="flex items-center gap-4 pt-1">
                    @if ($admin->avatar_url)
                        <img src="{{ $admin->avatar_url }}" alt="{{ $admin->name }}" class="h-16 w-16 rounded-full object-cover border-2 border-slate-200 shadow-xs">
                    @else
                        <div class="flex h-16 w-16 items-center justify-center rounded-full bg-[#1e3a5f] text-xl font-extrabold text-white shadow-xs">
                            {{ strtoupper(substr($admin->name, 0, 1)) }}
                        </div>
                    @endif
                    <div class="flex-1">
                        <label for="avatar" class="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">Update Profile Photo</label>
                        <input type="file" name="avatar" id="avatar" accept="image/png,image/jpeg,image/webp"
                               class="block w-full text-xs text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3.5 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200 cursor-pointer">
                        @error('avatar')
                            <p class="mt-1 text-xs text-rose-600">{{ $message }}</p>
                        @enderror
                    </div>
                </div>

                <x-admin.form-field name="name" label="Full Name" required>
                    <input type="text" name="name" id="name" value="{{ old('name', $admin->name) }}" required
                           class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                </x-admin.form-field>

                <x-admin.form-field name="email" label="Email Address" required>
                    <input type="email" name="email" id="email" value="{{ old('email', $admin->email) }}" required
                           class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                </x-admin.form-field>
            </div>

            <!-- Security & Password Card -->
            <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3">
                    Change Password
                </h2>

                <x-admin.form-field name="password" label="New Password" hint="Leave blank to keep your current password.">
                    <x-admin.password-input name="password" autocomplete="new-password" />
                </x-admin.form-field>

                <x-admin.form-field name="password_confirmation" label="Confirm New Password">
                    <x-admin.password-input name="password_confirmation" autocomplete="new-password" />
                </x-admin.form-field>
            </div>

            <!-- Actions -->
            <div class="pt-1">
                <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
                    Save Account Changes
                </button>
            </div>
        </form>
    </div>
</x-admin.layout>
