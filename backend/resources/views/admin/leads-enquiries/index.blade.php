<x-admin.layout title="Leads & Enquiries">
    <!-- Section 1: Customer Callback Leads -->
    <section id="leads" class="mb-10">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Quick Contact & Phone Leads</h2>
                <p class="text-xs text-slate-500">Phone numbers captured via sticky footer and modal contact buttons.</p>
            </div>

            <a href="{{ route('admin.leads-enquiries.export-leads') }}" 
               class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
                <svg class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export Leads CSV</span>
            </a>
        </div>

        <x-admin.data-table :headers="['Lead Name', 'Phone Number', 'WhatsApp Contact', 'Captured At']" :paginator="$leads">
            @foreach ($leads as $lead)
                <tr class="hover:bg-slate-50/70 transition-colors">
                    <td class="px-4 py-3 text-xs font-bold text-slate-900">{{ $lead->name }}</td>
                    <td class="px-4 py-3 text-xs font-mono font-semibold text-slate-700">{{ $lead->phone }}</td>
                    <td class="px-4 py-3 text-xs">
                        @php
                            $cleanPhone = preg_replace('/[^0-9]/', '', $lead->phone);
                            if (strlen($cleanPhone) === 10) $cleanPhone = '91' . $cleanPhone;
                        @endphp
                        <a href="https://wa.me/{{ $cleanPhone }}" target="_blank" rel="noopener noreferrer"
                           class="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100 border border-emerald-200">
                            <span>Chat on WhatsApp</span>
                            <span>↗</span>
                        </a>
                    </td>
                    <td class="px-4 py-3 text-xs text-slate-500 font-medium whitespace-nowrap">{{ $lead->created_at->timezone('Asia/Kolkata')->format('d M Y, H:i') }}</td>
                </tr>
            @endforeach
        </x-admin.data-table>
    </section>

    <!-- Section 2: Custom Project & Order Enquiries -->
    <section id="enquiries">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div>
                <h2 class="text-sm font-bold uppercase tracking-wider text-slate-800">Custom Build & Fitment Enquiries</h2>
                <p class="text-xs text-slate-500">Long-form contact messages submitted via storefront contact form.</p>
            </div>

            <a href="{{ route('admin.leads-enquiries.export-enquiries') }}" 
               class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-all">
                <svg class="h-3.5 w-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span>Export Enquiries CSV</span>
            </a>
        </div>

        <x-admin.data-table :headers="['Customer', 'Phone', 'Email', 'Enquiry Message', 'Submitted At']" :paginator="$enquiries">
            @foreach ($enquiries as $enquiry)
                <tr class="hover:bg-slate-50/70 transition-colors">
                    <td class="px-4 py-3 text-xs font-bold text-slate-900">{{ $enquiry->name }}</td>
                    <td class="px-4 py-3 text-xs font-mono text-slate-700">{{ $enquiry->phone }}</td>
                    <td class="px-4 py-3 text-xs font-mono text-slate-600">{{ $enquiry->email ?? '—' }}</td>
                    <td class="px-4 py-3 max-w-sm truncate text-xs text-slate-700" title="{{ $enquiry->message }}">{{ $enquiry->message }}</td>
                    <td class="px-4 py-3 text-xs text-slate-500 font-medium whitespace-nowrap">{{ $enquiry->created_at->timezone('Asia/Kolkata')->format('d M Y, H:i') }}</td>
                </tr>
            @endforeach
        </x-admin.data-table>
    </section>
</x-admin.layout>
