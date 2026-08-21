<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

// Locks in the two properties the earlier codebase audit called out as
// correct and worth protecting: signature verification actually rejects
// bad signatures, and a repeated webhook for an already-settled order is
// a true no-op (never double-decrements stock).
class RazorpayWebhookTest extends TestCase
{
    use RefreshDatabase;

    private const SECRET = 'test-webhook-secret';

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.razorpay.webhook_secret' => self::SECRET]);
    }

    private function sign(string $payload): string
    {
        return hash_hmac('sha256', $payload, self::SECRET);
    }

    private function makeOrder(int $stock = 10, ?int $couponId = null): array
    {
        $category = Category::create(['name' => 'Splitters', 'slug' => 'splitters']);
        $product = Product::create([
            'title' => 'Test Front Splitter',
            'slug' => 'test-front-splitter-'.uniqid(),
            'price' => 2000,
            'stock' => $stock,
            'category_id' => $category->id,
            'status' => 'active',
        ]);
        $order = Order::create([
            'customer_name' => 'Test Customer',
            'customer_phone' => '9876543210',
            'total_amount' => 2000,
            'advance_amount' => 2000,
            'remaining_amount' => 0,
            'advance_percent_applied' => 100,
            'payment_status' => 'pending',
            'order_status' => 'pending',
            'source' => 'website',
            'razorpay_order_id' => 'order_test123',
            'coupon_id' => $couponId,
        ]);
        $order->items()->create([
            'product_id' => $product->id,
            'product_title' => $product->title,
            'quantity' => 2,
            'unit_price' => $product->price,
            'subtotal' => $product->price * 2,
        ]);

        return [$order, $product];
    }

    public function test_rejects_a_webhook_with_an_invalid_signature(): void
    {
        [$order] = $this->makeOrder();

        $payload = json_encode([
            'event' => 'payment.captured',
            'payload' => ['payment' => ['entity' => ['id' => 'pay_test123', 'order_id' => 'order_test123']]],
        ]);

        $response = $this->call('POST', '/api/v1/razorpay/webhook', [], [], [], [
            'HTTP_X-Razorpay-Signature' => 'not-a-real-signature',
            'CONTENT_TYPE' => 'application/json',
        ], $payload);

        $response->assertStatus(400);
        $this->assertSame('pending', $order->fresh()->payment_status);
    }

    public function test_payment_captured_confirms_order_and_decrements_stock(): void
    {
        [$order, $product] = $this->makeOrder(stock: 10);

        $payload = json_encode([
            'event' => 'payment.captured',
            'payload' => ['payment' => ['entity' => ['id' => 'pay_test123', 'order_id' => 'order_test123']]],
        ]);

        $response = $this->call('POST', '/api/v1/razorpay/webhook', [], [], [], [
            'HTTP_X-Razorpay-Signature' => $this->sign($payload),
            'CONTENT_TYPE' => 'application/json',
        ], $payload);

        $response->assertOk();
        $order->refresh();
        $this->assertSame('fully_paid', $order->payment_status);
        $this->assertSame('confirmed', $order->order_status);
        $this->assertSame(8, $product->fresh()->stock);
    }

    public function test_repeated_webhook_for_an_already_confirmed_order_is_a_no_op(): void
    {
        [$order, $product] = $this->makeOrder(stock: 10);

        $payload = json_encode([
            'event' => 'payment.captured',
            'payload' => ['payment' => ['entity' => ['id' => 'pay_test123', 'order_id' => 'order_test123']]],
        ]);
        $headers = [
            'HTTP_X-Razorpay-Signature' => $this->sign($payload),
            'CONTENT_TYPE' => 'application/json',
        ];

        $this->call('POST', '/api/v1/razorpay/webhook', [], [], [], $headers, $payload);
        $second = $this->call('POST', '/api/v1/razorpay/webhook', [], [], [], $headers, $payload);

        $second->assertOk();
        $second->assertJson(['status' => 'already_processed']);
        $this->assertSame(8, $product->fresh()->stock);
    }

    public function test_payment_failed_marks_order_failed_and_releases_coupon_slot(): void
    {
        $coupon = Coupon::create([
            'code' => 'TESTCODE',
            'type' => 'percent',
            'value' => 10,
            'times_used' => 1,
            'active' => true,
        ]);
        [$order] = $this->makeOrder(stock: 10, couponId: $coupon->id);

        $payload = json_encode([
            'event' => 'payment.failed',
            'payload' => ['payment' => ['entity' => ['id' => 'pay_test123', 'order_id' => 'order_test123']]],
        ]);

        $response = $this->call('POST', '/api/v1/razorpay/webhook', [], [], [], [
            'HTTP_X-Razorpay-Signature' => $this->sign($payload),
            'CONTENT_TYPE' => 'application/json',
        ], $payload);

        $response->assertOk();
        $this->assertSame('failed', $order->fresh()->payment_status);
        $this->assertSame(0, $coupon->fresh()->times_used);
    }
}
