<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\EnquiryStoreRequest;
use App\Models\Enquiry;

class EnquiryController extends Controller
{
    public function store(EnquiryStoreRequest $request)
    {
        Enquiry::create($request->validated());

        return response()->json([
            'data' => ['message' => "Thanks for reaching out! We'll get back to you shortly."],
        ], 201);
    }
}
