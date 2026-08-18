<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Errors\SignatureVerificationError;
use Razorpay\Api\Utility;

class RazorpayWebhookController extends Controller
{
    public function __construct(private readonly OrderService $orderService) {}

    public function handle(Request $request)
    {
        $signature = $request->header('X-Razorpay-Signature');
        $secret = config('services.razorpay.webhook_secret');
        $rawPayload = $request->getContent();

        if (! $signature || ! $secret) {
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        try {
            (new Utility)->verifyWebhookSignature($rawPayload, $signature, $secret);
        } catch (SignatureVerificationError $e) {
            Log::warning('Razorpay webhook signature verification failed', [
                'error' => $e->getMessage(),
            ]);

            return response()->json(['message' => 'Invalid signature'], 400);
        }

        $data = json_decode($rawPayload, true) ?? [];
        $event = $data['event'] ?? null;
        $paymentEntity = $data['payload']['payment']['entity'] ?? null;

        if (! $paymentEntity) {
            return response()->json(['status' => 'ignored']);
        }

        $razorpayPaymentId = $paymentEntity['id'] ?? null;
        $razorpayOrderId = $paymentEntity['order_id'] ?? null;

        $order = Order::where('razorpay_order_id', $razorpayOrderId)->first();

        if (! $order) {
            Log::warning('Razorpay webhook for unknown order', [
                'razorpay_order_id' => $razorpayOrderId,
            ]);

            return response()->json(['status' => 'ignored']);
        }

        // Complete Idempotency: any repeated webhook for an already confirmed order is a no-op
        if (in_array($order->payment_status, ['advance_paid', 'fully_paid'], true)) {
            return response()->json(['status' => 'already_processed']);
        }

        if ($event === 'payment.captured') {
            $this->orderService->confirmPayment($order, $razorpayPaymentId);
        } elseif ($event === 'payment.failed') {
            $order->update([
                'razorpay_payment_id' => $razorpayPaymentId,
                'payment_status' => 'failed',
            ]);

            // Rollback reserved single-use coupon slot on failure
            if ($order->coupon_id) {
                \App\Models\Coupon::where('id', $order->coupon_id)->decrement('times_used');
            }
        } else {
            Log::info('Unhandled Razorpay webhook event', ['event' => $event]);
        }

        return response()->json(['status' => 'ok']);
    }
}
