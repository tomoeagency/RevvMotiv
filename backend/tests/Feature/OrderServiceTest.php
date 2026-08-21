<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Services\OrderService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Validation\ValidationException;
use Tests\TestCase;

// Covers the highest-stakes logic in the app: stock deduction and payment
// confirmation. Deliberately scoped to the withRazorpay:false (manual
// order) path for create() — the withRazorpay:true branch calls the real
// Razorpay SDK directly with no seam to mock, so it's exercised by manual
// QA against Razorpay's test mode instead, not here.
class OrderServiceTest extends TestCase
{
    use RefreshDatabase;

    private function makeProduct(array $overrides = []): Product
    {
        $category = Category::create(['name' => 'Splitters', 'slug' => 'splitters']);

        return Product::create(array_merge([
            'title' => 'Test Front Splitter',
            'slug' => 'test-front-splitter-'.uniqid(),
            'price' => 2000,
            'cost_price' => 1200,
            'stock' => 10,
            'category_id' => $category->id,
            'status' => 'active',
        ], $overrides));
    }

    private function baseInput(Product $product, int $quantity = 1, ?int $variantId = null): array
    {
        return [
            'customer_name' => 'Test Customer',
            'customer_phone' => '9876543210',
            'items' => [
                [
                    'product_id' => $product->id,
                    'variant_id' => $variantId,
                    'quantity' => $quantity,
                ],
            ],
        ];
    }

    public function test_manual_order_deducts_stock_immediately(): void
    {
        $product = $this->makeProduct(['stock' => 10]);

        (new OrderService)->create($this->baseInput($product, 3), [], withRazorpay: false);

        $this->assertSame(7, $product->fresh()->stock);
    }

    public function test_manual_order_rejects_insufficient_stock_without_partial_deduction(): void
    {
        $product = $this->makeProduct(['stock' => 2]);

        try {
            (new OrderService)->create($this->baseInput($product, 5), [], withRazorpay: false);
            $this->fail('Expected a ValidationException for insufficient stock.');
        } catch (ValidationException $e) {
            // expected
        }

        $this->assertSame(2, $product->fresh()->stock);
        $this->assertSame(0, Order::count());
    }

    public function test_manual_order_snapshots_cost_price_onto_the_order_item(): void
    {
        $product = $this->makeProduct(['price' => 2000, 'cost_price' => 1200]);

        $order = (new OrderService)->create($this->baseInput($product, 1), [], withRazorpay: false);

        $this->assertSame('1200.00', $order->items->first()->cost_price_applied);
    }

    public function test_manual_order_deducts_both_product_and_variant_stock(): void
    {
        // Documents current behavior: when a variant is sold, BOTH the
        // variant's own stock AND the parent product's stock are
        // decremented. Whether product.stock is meant to be an
        // independent figure or an aggregate across variants isn't
        // encoded anywhere in the schema — flagging this as worth a
        // product-level decision rather than assuming which is a bug.
        $product = $this->makeProduct(['stock' => 10]);
        $variant = ProductVariant::create([
            'product_id' => $product->id,
            'name' => 'Gloss Black',
            'price' => 2200,
            'stock' => 5,
        ]);

        (new OrderService)->create($this->baseInput($product, 2, $variant->id), [], withRazorpay: false);

        $this->assertSame(3, $variant->fresh()->stock);
        $this->assertSame(8, $product->fresh()->stock);
    }

    public function test_confirm_payment_decrements_stock_and_marks_order_confirmed(): void
    {
        $product = $this->makeProduct(['stock' => 10]);
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
        ]);
        $order->items()->create([
            'product_id' => $product->id,
            'product_title' => $product->title,
            'quantity' => 3,
            'unit_price' => $product->price,
            'subtotal' => $product->price * 3,
        ]);

        (new OrderService)->confirmPayment($order, 'pay_test123');

        $order->refresh();
        $this->assertSame(7, $product->fresh()->stock);
        $this->assertSame('fully_paid', $order->payment_status);
        $this->assertSame('confirmed', $order->order_status);
        $this->assertSame('pay_test123', $order->razorpay_payment_id);
    }

    public function test_confirm_payment_is_idempotent_and_never_double_decrements_stock(): void
    {
        $product = $this->makeProduct(['stock' => 10]);
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
        ]);
        $order->items()->create([
            'product_id' => $product->id,
            'product_title' => $product->title,
            'quantity' => 3,
            'unit_price' => $product->price,
            'subtotal' => $product->price * 3,
        ]);

        $service = new OrderService;
        $service->confirmPayment($order, 'pay_test123');
        $service->confirmPayment($order->fresh(), 'pay_test123');

        $this->assertSame(7, $product->fresh()->stock);
    }
}
