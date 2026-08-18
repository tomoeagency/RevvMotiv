<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreOrderRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Razorpay\Api\Errors\Error as RazorpayError;
use Throwable;

class OrderController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    public function show(\Illuminate\Http\Request $request, Order $order)
    {
        $token = $request->query('token');
        if (!$request->user() && (!$token || !hash_equals((string) $order->access_token, (string) $token))) {
            return response()->json([
                'message' => 'Unauthorized order access.',
            ], 403);
        }

        return new OrderResource($order);
    }

    public function store(StoreOrderRequest $request)
    {
        try {
            $order = $this->orderService->create($request->validated());
        } catch (ValidationException $e) {
            throw $e;
        } catch (RazorpayError $e) {
            Log::error('Razorpay order creation failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Could not initiate payment. Please try again.',
            ], 502);
        } catch (Throwable $e) {
            Log::error('Order creation failed', ['error' => $e->getMessage()]);

            return response()->json([
                'message' => 'Could not create order. Please try again.',
            ], 500);
        }

        return (new OrderResource($order))->response()->setStatusCode(201);
    }

    public function invoice(\Illuminate\Http\Request $request, Order $order)
    {
        $token = $request->query('token');
        if (!$request->user() && (!$token || !hash_equals((string) $order->access_token, (string) $token))) {
            abort(403, 'Unauthorized order invoice access.');
        }

        $order->loadMissing('items.product');
        return view('emails.order_invoice', compact('order'));
    }
}
