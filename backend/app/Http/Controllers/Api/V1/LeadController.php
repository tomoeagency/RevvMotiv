<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\LeadStoreRequest;
use App\Models\Lead;

class LeadController extends Controller
{
    public function store(LeadStoreRequest $request)
    {
        Lead::create($request->validated());

        return response()->json([
            'data' => ['message' => "Thanks! We'll call you back shortly."],
        ], 201);
    }
}
