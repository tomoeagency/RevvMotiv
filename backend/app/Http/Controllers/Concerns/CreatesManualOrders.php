<?php

namespace App\Http\Controllers\Concerns;

use App\Http\Requests\Admin\StoreManualOrderRequest;
use App\Models\Order;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Throwable;

// Shared by the Blade admin panel's OrderController and the Sanctum
// API-admin OrderController — both record manual/offline sales through the
// same OrderService call and need identical error logging, but each
// formats its own response (redirect vs JSON), so this returns null on
// failure rather than building a response itself.
trait CreatesManualOrders
{
    protected function tryCreateManualOrder(StoreManualOrderRequest $request): ?Order
    {
        try {
            return $this->orderService->create(
                $request->toOrderInput(),
                $request->toOrderOverrides(),
                withRazorpay: false
            );
        } catch (ValidationException $e) {
            throw $e;
        } catch (Throwable $e) {
            Log::error('Manual order creation failed', ['error' => $e->getMessage()]);

            return null;
        }
    }
}
