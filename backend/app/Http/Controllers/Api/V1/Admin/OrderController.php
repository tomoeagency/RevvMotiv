<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreManualOrderRequest;
use App\Http\Resources\OrderResource;
use App\Services\OrderService;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    // Records a sale made outside the platform (Instagram DM, phone call,
    // WhatsApp) — same stock validation/deduction, cost_price snapshotting,
    // and coupon logic as the storefront checkout (via the shared
    // OrderService), but skips Razorpay entirely: payment already happened
    // (or is being followed up on) outside this system, so payment_status/
    // payment_mode are just recorded as given, not derived from a webhook.
    public function storeManual(StoreManualOrderRequest $request)
    {
        try {
            $order = $this->orderService->create(
                $request->toOrderInput(),
                $request->toOrderOverrides(),
                withRazorpay: false
            );
        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            Log::error('Manual order creation failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Could not create order. Please try again.',
            ], 500);
        }

        return response()->json([
            'data' => new OrderResource($order),
        ], 201);
    }
}
