<?php

namespace App\Services;

use App\Mail\ReviewInvitationMail;
use App\Models\Order;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ICarryShippingService
{
    protected ?string $apiKey;
    protected ?string $apiUsername;
    protected ?string $apiSecret;
    protected string $baseUrl;
    protected string $pickupPincode;

    public function __construct()
    {
        $this->apiKey = config('services.icarry.api_key');
        $this->apiUsername = config('services.icarry.api_username');
        $this->apiSecret = config('services.icarry.api_secret');
        $this->baseUrl = rtrim(config('services.icarry.base_url', 'https://api.icarry.in/v1'), '/');
        $this->pickupPincode = (string) config('services.icarry.pickup_pincode', '201009');
    }

    /**
     * Check if iCarry.in credentials are fully provided in .env
     */
    public function isConfigured(): bool
    {
        return !empty($this->apiKey);
    }

    /**
     * Create shipment / booking on iCarry.in
     * Supports both 100% Prepaid and Partial Advance (COD Balance) orders.
     */
    public function createShipment(Order $order, array $customPackage = []): array
    {
        if (!$this->isConfigured()) {
            Log::info("iCarry.in not configured yet. Skipping automated API call for Order #{$order->id}.");
            return [
                'success' => false,
                'message' => 'iCarry.in API key is not configured in .env',
            ];
        }

        try {
            $order->loadMissing('items.product');

            // Determine payment mode for logistics:
            // If remaining_amount > 0, courier must collect remaining balance via Cash/UPI on doorstep
            $isCod = (float) $order->remaining_amount > 0;
            $collectableAmount = $isCod ? (float) $order->remaining_amount : 0.0;

            // Package dimensions defaults for automotive styling parts
            $weightGrams = $customPackage['weight_grams'] ?? 2500;
            $lengthCm = $customPackage['length_cm'] ?? 110;
            $widthCm = $customPackage['width_cm'] ?? 30;
            $heightCm = $customPackage['height_cm'] ?? 15;

            $itemsSummary = $order->items->map(function ($item) {
                return [
                    'name' => $item->product_title ?? ($item->product?->title ?? 'Automotive Part'),
                    'qty' => $item->quantity,
                    'price' => (float) $item->unit_price,
                ];
            })->toArray();

            $payload = [
                'order_id' => (string) $order->id,
                'client_reference' => "RM-{$order->id}",
                'pickup_pincode' => $this->pickupPincode,
                'customer_name' => $order->customer_name,
                'customer_phone' => $order->customer_phone,
                'customer_email' => $order->customer_email,
                'shipping_address' => $order->shipping_address,
                'payment_mode' => $isCod ? 'COD' : 'PREPAID',
                'cod_amount' => $collectableAmount,
                'total_order_value' => (float) $order->total_amount,
                'weight' => $weightGrams,
                'length' => $lengthCm,
                'width' => $widthCm,
                'height' => $heightCm,
                'items' => $itemsSummary,
            ];

            $response = Http::withHeaders($this->getHeaders())
                ->timeout(20)
                ->post("{$this->baseUrl}/shipments/create", $payload);

            $data = $response->json();

            if ($response->successful() && !empty($data['awb_number'])) {
                Log::info("iCarry.in Shipment Created for Order #{$order->id} with AWB: {$data['awb_number']}");
                return [
                    'success' => true,
                    'awb_number' => $data['awb_number'],
                    'courier_name' => $data['courier_name'] ?? 'iCarry Express',
                    'label_url' => $data['label_url'] ?? null,
                    'tracking_url' => $data['tracking_url'] ?? "https://icarry.in/track/{$data['awb_number']}",
                    'raw' => $data,
                ];
            }

            Log::error("iCarry.in API Error for Order #{$order->id}", ['response' => $data]);
            return [
                'success' => false,
                'message' => $data['message'] ?? 'Failed to generate shipment on iCarry.in',
                'raw' => $data,
            ];
        } catch (\Throwable $e) {
            Log::error("iCarry.in Exception: {$e->getMessage()}", ['order_id' => $order->id]);
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Build HTTP headers for iCarry API calls
     */
    protected function getHeaders(): array
    {
        $headers = [
            'Authorization' => "Bearer {$this->apiKey}",
            'X-Api-Key' => $this->apiKey,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];

        if (!empty($this->apiUsername)) {
            $headers['X-Api-User'] = $this->apiUsername;
            $headers['X-Api-Username'] = $this->apiUsername;
        }

        return $headers;
    }

    /**
     * Fetch tracking status from iCarry.in
     */
    public function trackShipment(string $awbNumber): array
    {
        if (!$this->isConfigured()) {
            return [
                'success' => false,
                'message' => 'iCarry.in API key is not configured',
            ];
        }

        try {
            $response = Http::withHeaders($this->getHeaders())
                ->timeout(15)
                ->get("{$this->baseUrl}/track/{$awbNumber}");

            return $response->json() ?? [];
        } catch (\Throwable $e) {
            return [
                'success' => false,
                'message' => $e->getMessage(),
            ];
        }
    }

    /**
     * Process Webhook from iCarry.in when courier status updates
     * (e.g. IN_TRANSIT, OUT_FOR_DELIVERY, DELIVERED, RTO)
     */
    public function processWebhook(array $payload): array
    {
        $awb = $payload['awb_number'] ?? ($payload['awb'] ?? null);
        $orderId = $payload['order_id'] ?? ($payload['client_reference'] ?? null);
        $status = strtolower($payload['status'] ?? ($payload['current_status'] ?? ''));

        Log::info("Received iCarry.in Webhook", ['awb' => $awb, 'order_id' => $orderId, 'status' => $status]);

        // Find matching Order
        $order = null;
        if ($orderId) {
            $cleanedId = str_replace('RM-', '', $orderId);
            $order = Order::find($cleanedId);
        }

        if (!$order && $awb) {
            $order = Order::where('notes', 'LIKE', "%{$awb}%")->first();
        }

        if (!$order) {
            return [
                'status' => 'ignored',
                'message' => 'Order not found for given webhook payload',
            ];
        }

        // When order is Delivered:
        if (in_array($status, ['delivered', 'complete', 'completed', 'delivered_successfully'])) {
            $order->update([
                'order_status' => 'delivered',
            ]);

            // Trigger Post-Delivery Automated Review Invitation Email
            try {
                Mail::to($order->customer_email)->send(new ReviewInvitationMail($order));
                Log::info("Review Invitation Mail sent successfully to {$order->customer_email} for Order #{$order->id}");
            } catch (\Throwable $mailErr) {
                Log::error("Failed to send review invitation email: {$mailErr->getMessage()}");
            }

            return [
                'status' => 'success',
                'order_id' => $order->id,
                'order_status' => 'delivered',
                'review_email_sent' => true,
            ];
        }

        return [
            'status' => 'processed',
            'order_id' => $order->id,
            'current_status' => $status,
        ];
    }
}
