<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // 'website' covers every pre-existing row and the storefront
            // checkout going forward — manual entries always set one of the
            // other four explicitly.
            $table->enum('source', ['website', 'instagram', 'call', 'whatsapp', 'other'])
                ->default('website')
                ->after('order_status');

            // Only meaningful for manual orders — the storefront's payment
            // method is opaque to us (Razorpay handles it), so this stays
            // null there.
            $table->enum('payment_mode', ['cod', 'upi', 'cash', 'bank_transfer'])
                ->nullable()
                ->after('source');

            $table->text('notes')->nullable()->after('payment_mode');
        });

        // Offline sales (a call, a DM) often don't come with an email, and
        // "pickup / local" orders don't have a shipping address — both are
        // required for the storefront's guest checkout but not for a manual
        // entry, so they need to actually be nullable rather than filled
        // with a placeholder string.
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_email')->nullable()->change();
            $table->text('shipping_address')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('customer_email')->nullable(false)->change();
            $table->text('shipping_address')->nullable(false)->change();
            $table->dropColumn(['source', 'payment_mode', 'notes']);
        });
    }
};
