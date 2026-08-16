<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Snapshot of products.cost_price at order-creation time — same
        // reasoning as orders.advance_percent_applied: a later change to
        // the live cost_price must never alter a past order's recorded
        // profit. Nullable because cost_price itself may be unset on the
        // product at order time.
        Schema::table('order_items', function (Blueprint $table) {
            $table->decimal('cost_price_applied', 10, 2)->nullable()->after('unit_price');
        });
    }

    public function down(): void
    {
        Schema::table('order_items', function (Blueprint $table) {
            $table->dropColumn('cost_price_applied');
        });
    }
};
