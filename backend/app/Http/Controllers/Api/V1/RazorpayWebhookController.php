<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Razorpay\Api\Errors\SignatureVerificationError;
use Razorpay\Api\Utility;

class RazorpayWebhookController extends Controller
{
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

        // Idempotency — a webhook can arrive more than once for the same
        // event, per razorpay-advance-payment skill. Don't reprocess a
        // payment that's already moved this order past 'pending'.
        if ($order->razorpay_payment_id === $razorpayPaymentId
            && in_array($order->payment_status, ['advance_paid', 'fully_paid'], true)) {
            return response()->json(['status' => 'already_processed']);
        }

        if ($event === 'payment.captured') {
            $paymentStatus = $order->advance_percent_applied >= 100 ? 'fully_paid' : 'advance_paid';
            $order->update([
                'razorpay_payment_id' => $razorpayPaymentId,
                'payment_status' => $paymentStatus,
                'order_status' => 'confirmed',
            ]);
            app(\App\Services\OrderService::class)->sendInvoiceEmail($order);
        } elseif ($event === 'payment.failed') {
            $order->update([
                'razorpay_payment_id' => $razorpayPaymentId,
                'payment_status' => 'failed',
            ]);
        } else {
            Log::info('Unhandled Razorpay webhook event', ['event' => $event]);
        }

        return response()->json(['status' => 'ok']);
    }
}
