<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\SanitizesCsvOutput;
use App\Http\Controllers\Controller;
use App\Models\Enquiry;
use App\Models\Lead;
use Illuminate\View\View;
use Symfony\Component\HttpFoundation\StreamedResponse;

class LeadEnquiryController extends Controller
{
    use SanitizesCsvOutput;

    public function index(): View
    {
        return view('admin.leads-enquiries.index', [
            'leads' => Lead::latest()->paginate(20, ['*'], 'leads_page'),
            'enquiries' => Enquiry::latest()->paginate(20, ['*'], 'enquiries_page'),
        ]);
    }

    public function exportLeads(): StreamedResponse
    {
        $leads = Lead::latest()->get();

        return $this->streamCsv('leads-'.now()->format('Y-m-d-His').'.csv', ['Name', 'Phone', 'Received At'], $leads, fn (Lead $lead) => [
            $lead->name, $lead->phone, $lead->created_at->format('Y-m-d H:i'),
        ]);
    }

    public function exportEnquiries(): StreamedResponse
    {
        $enquiries = Enquiry::latest()->get();

        return $this->streamCsv('enquiries-'.now()->format('Y-m-d-His').'.csv', ['Name', 'Phone', 'Email', 'Message', 'Received At'], $enquiries, fn (Enquiry $enquiry) => [
            $enquiry->name, $enquiry->phone, $enquiry->email, $enquiry->message, $enquiry->created_at->format('Y-m-d H:i'),
        ]);
    }

    // Dependency-free CSV export, same approach as Admin\ReviewController@export.
    private function streamCsv(string $filename, array $headers, iterable $rows, callable $mapRow): StreamedResponse
    {
        $callback = function () use ($headers, $rows, $mapRow) {
            $handle = fopen('php://output', 'w');
            fputcsv($handle, $headers);

            foreach ($rows as $row) {
                fputcsv($handle, $this->csvRow($mapRow($row)));
            }

            fclose($handle);
        };

        return response()->streamDownload($callback, $filename, ['Content-Type' => 'text/csv']);
    }
}
