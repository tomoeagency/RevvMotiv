<x-admin.layout title="Settings">
    <div class="max-w-2xl space-y-6">
        <div class="admin-card rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-4 flex items-center gap-2">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                    <x-admin.icon name="settings" class="h-4 w-4" />
                </span>
                <h2 class="text-sm font-semibold text-slate-900">Payments</h2>
            </div>

            <form method="POST" action="{{ route('admin.settings.update') }}">
                @csrf
                @method('PUT')

                <x-admin.form-field name="percent" label="Razorpay advance payment (%)" required hint="Percentage of the order total collected upfront via Razorpay; the rest is COD. Only applies to orders placed after saving — existing orders keep the percentage they were created with.">
                    <input type="number" min="1" max="100" name="percent" id="percent" value="{{ old('percent', $razorpayAdvancePercent) }}" required
                           class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                </x-admin.form-field>

                <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
                    Save
                </button>
            </form>
        </div>

        <div class="admin-card rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-1 flex items-center gap-2">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                    <x-admin.icon name="announcements" class="h-4 w-4" />
                </span>
                <h2 class="text-sm font-semibold text-slate-900">Announcement strip</h2>
            </div>
            <p class="mb-4 pl-10 text-xs text-slate-500">
                Manage the actual list of announcements on the
                <a href="{{ route('admin.announcements.index') }}" class="underline hover:text-slate-700">Announcements page</a>.
                These settings control how that list is displayed.
            </p>

            <form method="POST" action="{{ route('admin.settings.update-announcement') }}">
                @csrf
                @method('PUT')

                <label class="mb-4 flex items-center gap-2 text-sm text-slate-700">
                    <input type="checkbox" name="announcement_enabled" value="1" class="rounded border-slate-300 text-[#1e3a5f] focus:ring-[#1e3a5f]" @checked(old('announcement_enabled', $announcementEnabled))>
                    Show announcement strip on the storefront
                </label>

                <x-admin.form-field name="announcement_display_mode" label="Display mode" required>
                    <select name="announcement_display_mode" id="announcement_display_mode" required
                            onchange="document.getElementById('scroll_speed_field').classList.toggle('hidden', this.value !== 'scroll'); document.getElementById('rotate_duration_field').classList.toggle('hidden', this.value !== 'rotate');"
                            class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                        <option value="scroll" @selected(old('announcement_display_mode', $announcementDisplayMode) === 'scroll')>Continuous scroll (all joined: text | text | text)</option>
                        <option value="rotate" @selected(old('announcement_display_mode', $announcementDisplayMode) === 'rotate')>One at a time (rotates on a timer)</option>
                    </select>
                </x-admin.form-field>

                <div id="scroll_speed_field" class="{{ old('announcement_display_mode', $announcementDisplayMode) !== 'scroll' ? 'hidden' : '' }}">
                    <x-admin.form-field name="announcement_scroll_speed" label="Scroll speed" hint="Seconds for one full scroll loop.">
                        <input type="number" min="1" max="300" name="announcement_scroll_speed" id="announcement_scroll_speed" value="{{ old('announcement_scroll_speed', $announcementScrollSpeed) }}"
                               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                    </x-admin.form-field>
                </div>

                <div id="rotate_duration_field" class="{{ old('announcement_display_mode', $announcementDisplayMode) !== 'rotate' ? 'hidden' : '' }}">
                    <x-admin.form-field name="announcement_rotate_duration" label="Change duration" hint="Seconds each announcement stays on screen before switching to the next.">
                        <input type="number" min="1" max="60" name="announcement_rotate_duration" id="announcement_rotate_duration" value="{{ old('announcement_rotate_duration', $announcementRotateDuration) }}"
                               class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                    </x-admin.form-field>
                </div>

                <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
                    Save
                </button>
            </form>
        </div>

        <div class="admin-card rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div class="mb-1 flex items-center gap-2">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-600">
                    <x-admin.icon name="leads" class="h-4 w-4" />
                </span>
                <h2 class="text-sm font-semibold text-slate-900">Contact &amp; footer links</h2>
            </div>
            <p class="mb-4 pl-10 text-xs text-slate-500">
                Consumed by the storefront via <code class="rounded bg-slate-100 px-1 py-0.5 text-xs">GET /api/v1/site-settings</code> for footer/contact links.
            </p>

            <form method="POST" action="{{ route('admin.settings.update-site-settings') }}">
                @csrf
                @method('PUT')

                <x-admin.form-field name="site_whatsapp_number" label="WhatsApp number">
                    <input type="text" name="site_whatsapp_number" id="site_whatsapp_number" value="{{ old('site_whatsapp_number', $siteWhatsappNumber) }}" placeholder="+91 XXXXXXXXXX"
                           class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                </x-admin.form-field>

                <x-admin.form-field name="site_instagram_handle" label="Instagram handle">
                    <input type="text" name="site_instagram_handle" id="site_instagram_handle" value="{{ old('site_instagram_handle', $siteInstagramHandle) }}" placeholder="@handle"
                           class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                </x-admin.form-field>

                <x-admin.form-field name="site_contact_email" label="Contact email">
                    <input type="email" name="site_contact_email" id="site_contact_email" value="{{ old('site_contact_email', $siteContactEmail) }}"
                           class="block w-full rounded-md border-slate-300 shadow-sm focus:border-[#1e3a5f] focus:ring-[#1e3a5f] sm:text-sm">
                </x-admin.form-field>

                <button type="submit" class="cursor-pointer rounded-md bg-[#1e3a5f] px-4 py-2 text-sm font-medium text-white hover:bg-[#16304d]">
                    Save
                </button>
            </form>
        </div>
    </div>
</x-admin.layout>
