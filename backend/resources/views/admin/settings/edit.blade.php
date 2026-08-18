<x-admin.layout title="Settings">
    <div class="max-w-2xl space-y-6">
        <!-- 1. Payments Configuration Card -->
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div class="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#1e3a5f]">
                    <x-admin.icon name="settings" class="h-4 w-4" />
                </span>
                <div>
                    <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Payment Gateway Rules</h2>
                    <p class="text-xs text-slate-500">Razorpay advance payment split configuration.</p>
                </div>
            </div>

            <form method="POST" action="{{ route('admin.settings.update') }}" class="space-y-4">
                @csrf
                @method('PUT')

                <x-admin.form-field name="percent" label="Razorpay Advance Amount (%)" required hint="Percentage of the order total collected upfront via Razorpay; remaining is COD. Applies to all future orders.">
                    <input type="number" min="1" max="100" name="percent" id="percent" value="{{ old('percent', $razorpayAdvancePercent) }}" required
                           class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                </x-admin.form-field>

                <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
                    Save Payment Settings
                </button>
            </form>
        </div>

        <!-- 2. Announcement Strip Config Card -->
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div class="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#1e3a5f]">
                    <x-admin.icon name="announcements" class="h-4 w-4" />
                </span>
                <div>
                    <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Announcement Strip Display</h2>
                    <p class="text-xs text-slate-500">Storefront top marquee velocity and animation mode.</p>
                </div>
            </div>

            <form method="POST" action="{{ route('admin.settings.update-announcement') }}" class="space-y-4">
                @csrf
                @method('PUT')

                <label class="flex items-center gap-2.5 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input type="checkbox" name="announcement_enabled" value="1" class="h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500" @checked(old('announcement_enabled', $announcementEnabled))>
                    <span>Enable top announcement banner on storefront</span>
                </label>

                <x-admin.form-field name="announcement_display_mode" label="Ticker Animation Mode" required>
                    <select name="announcement_display_mode" id="announcement_display_mode" required
                            onchange="document.getElementById('scroll_speed_field').classList.toggle('hidden', this.value !== 'scroll'); document.getElementById('rotate_duration_field').classList.toggle('hidden', this.value !== 'rotate');"
                            class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                        <option value="scroll" @selected(old('announcement_display_mode', $announcementDisplayMode) === 'scroll')>Continuous marquee scroll</option>
                        <option value="rotate" @selected(old('announcement_display_mode', $announcementDisplayMode) === 'rotate')>One at a time (rotating timer)</option>
                    </select>
                </x-admin.form-field>

                <div id="scroll_speed_field" class="{{ old('announcement_display_mode', $announcementDisplayMode) !== 'scroll' ? 'hidden' : '' }}">
                    <x-admin.form-field name="announcement_scroll_speed" label="Marquee Loop Speed (Seconds)" hint="Seconds for one full scroll cycle.">
                        <input type="number" min="1" max="300" name="announcement_scroll_speed" id="announcement_scroll_speed" value="{{ old('announcement_scroll_speed', $announcementScrollSpeed) }}"
                               class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                    </x-admin.form-field>
                </div>

                <div id="rotate_duration_field" class="{{ old('announcement_display_mode', $announcementDisplayMode) !== 'rotate' ? 'hidden' : '' }}">
                    <x-admin.form-field name="announcement_rotate_duration" label="Slide Duration (Seconds)" hint="Seconds each announcement is displayed before switching.">
                        <input type="number" min="1" max="60" name="announcement_rotate_duration" id="announcement_rotate_duration" value="{{ old('announcement_rotate_duration', $announcementRotateDuration) }}"
                               class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                    </x-admin.form-field>
                </div>

                <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
                    Save Banner Settings
                </button>
            </form>
        </div>

        <!-- 3. Contact & Brand Links Card -->
        <div class="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-4">
            <div class="flex items-center gap-2.5 border-b border-slate-100 pb-3">
                <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#1e3a5f]">
                    <x-admin.icon name="leads" class="h-4 w-4" />
                </span>
                <div>
                    <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Support & Social Links</h2>
                    <p class="text-xs text-slate-500">Public contact details displayed in the storefront footer.</p>
                </div>
            </div>

            <form method="POST" action="{{ route('admin.settings.update-site-settings') }}" class="space-y-4">
                @csrf
                @method('PUT')

                <x-admin.form-field name="site_whatsapp_number" label="Official WhatsApp Number">
                    <input type="text" name="site_whatsapp_number" id="site_whatsapp_number" value="{{ old('site_whatsapp_number', $siteWhatsappNumber) }}" placeholder="+91 XXXXXXXXXX"
                           class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 font-mono shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                </x-admin.form-field>

                <x-admin.form-field name="site_instagram_handle" label="Instagram Handle">
                    <input type="text" name="site_instagram_handle" id="site_instagram_handle" value="{{ old('site_instagram_handle', $siteInstagramHandle) }}" placeholder="@revvmotiv"
                           class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                </x-admin.form-field>

                <x-admin.form-field name="site_contact_email" label="Support Contact Email">
                    <input type="email" name="site_contact_email" id="site_contact_email" value="{{ old('site_contact_email', $siteContactEmail) }}" placeholder="support@revvmotiv.com"
                           class="block w-full rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm text-slate-900 shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20">
                </x-admin.form-field>

                <button type="submit" class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1e3a5f] px-5 py-2 text-xs font-bold text-white shadow-2xs hover:bg-[#16304d] active:bg-[#0f2238] transition-all cursor-pointer">
                    Save Contact Links
                </button>
            </form>
        </div>
    </div>
</x-admin.layout>
