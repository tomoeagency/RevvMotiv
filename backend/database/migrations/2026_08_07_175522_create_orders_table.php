<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();

            // Guest checkout — no customer accounts, per CLAUDE.md.
            $table->string('customer_name');
            $table->string('customer_email');
            $table->string('customer_phone');
            $table->text('shipping_address');

            $table->decimal('total_amount', 10, 2);
            $table->decimal('advance_amount', 10, 2);
            $table->decimal('remaining_amount', 10, 2);

            // Snapshot of admin_settings.razorpay_advance_percent at the
            // moment this order was created — never recompute from the
            // live setting, see razorpay-advance-payment skill.
            $table->unsignedTinyInteger('advance_percent_applied');

            $table->enum('payment_status', [
                'pending', 'advance_paid', 'fully_paid', 'failed', 'refunded',
            ])->default('pending');

            $table->enum('order_status', [
                'pending', 'confirmed', 'shipped', 'delivered', 'cancelled',
            ])->default('pending');

            $table->string('razorpay_order_id')->nullable()->index();
            $table->string('razorpay_payment_id')->nullable()->unique();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
