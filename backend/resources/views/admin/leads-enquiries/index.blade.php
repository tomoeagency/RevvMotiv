<x-admin.layout title="Leads & Enquiries">
    <section id="leads" class="mb-10">
        <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-900">Leads</h2>
            <a href="{{ route('admin.leads-enquiries.export-leads') }}" class="rounded-md bg-slate-200 px-3 py-1.5 text-sm hover:bg-slate-300">
                Export CSV
            </a>
        </div>
        <x-admin.data-table :headers="['Name', 'Phone', 'Received']" :paginator="$leads">
            @foreach ($leads as $lead)
                <tr>
                    <td class="px-4 py-2.5 font-medium text-slate-900">{{ $lead->name }}</td>
                    <td class="px-4 py-2.5 text-slate-600">{{ $lead->phone }}</td>
                    <td class="px-4 py-2.5 text-slate-500">{{ $lead->created_at->format('d M Y, H:i') }}</td>
                </tr>
            @endforeach
        </x-admin.data-table>
    </section>

    <section id="enquiries">
        <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-900">Enquiries</h2>
            <a href="{{ route('admin.leads-enquiries.export-enquiries') }}" class="rounded-md bg-slate-200 px-3 py-1.5 text-sm hover:bg-slate-300">
                Export CSV
            </a>
        </div>
        <x-admin.data-table :headers="['Name', 'Phone', 'Email', 'Message', 'Received']" :paginator="$enquiries">
            @foreach ($enquiries as $enquiry)
                <tr>
                    <td class="px-4 py-2.5 font-medium text-slate-900">{{ $enquiry->name }}</td>
                    <td class="px-4 py-2.5 text-slate-600">{{ $enquiry->phone }}</td>
                    <td class="px-4 py-2.5 text-slate-600">{{ $enquiry->email }}</td>
                    <td class="px-4 py-2.5 max-w-xs truncate text-slate-600" title="{{ $enquiry->message }}">{{ $enquiry->message }}</td>
                    <td class="px-4 py-2.5 text-slate-500">{{ $enquiry->created_at->format('d M Y, H:i') }}</td>
                </tr>
            @endforeach
        </x-admin.data-table>
    </section>
</x-admin.layout>
