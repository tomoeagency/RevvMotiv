<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Services\ICarryShippingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ICarryWebhookController extends Controller
{
    /**
     * Handle incoming webhook updates from iCarry.in
     */
    public function handle(Request $request, ICarryShippingService $shippingService)
    {
        // Optional webhook signature / secret validation if configured
        $secret = config('services.icarry.webhook_secret');
        if ($secret) {
            $incomingSignature = $request->header('X-iCarry-Signature') ?? $request->header('Signature');
            if ($incomingSignature && !hash_equals($secret, (string) $incomingSignature)) {
                Log::warning('iCarry Webhook rejected: Invalid signature');
                return response()->json(['error' => 'Invalid signature'], 401);
            }
        }

        $payload = $request->all();
        $result = $shippingService->processWebhook($payload);

        return response()->json([
            'status' => 'received',
            'data' => $result,
        ]);
    }
}
