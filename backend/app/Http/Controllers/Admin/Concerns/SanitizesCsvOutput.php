<?php

namespace App\Http\Controllers\Admin\Concerns;

// CSV/formula injection guard (CWE-1236): every export here includes
// public-submitted free text (review comments, lead/enquiry names and
// messages) that an admin opens directly in Excel. A cell value starting
// with =, +, -, or @ is interpreted as a formula by Excel/Sheets, which
// can be used for phishing links or (on older Excel/DDE configs) code
// execution. Prefixing with a straight quote neutralizes it without
// changing how the value reads.
trait SanitizesCsvOutput
{
    private function csvRow(array $row): array
    {
        return array_map(function ($value) {
            if (is_string($value) && preg_match('/^[=+\-@]/', $value)) {
                return "'".$value;
            }

            return $value;
        }, $row);
    }
}
