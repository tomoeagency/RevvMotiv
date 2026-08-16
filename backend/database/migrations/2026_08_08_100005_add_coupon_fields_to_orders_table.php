<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            // nullOnDelete, not restrict: deleting a coupon must never block
            // or corrupt past orders. discount_amount is the durable record
            // of what was applied — coupon_id is just a reference back to it.
            $table->foreignId('coupon_id')->nullable()->after('remaining_amount')->constrained()->nullOnDelete();
            $table->decimal('discount_amount', 10, 2)->default(0)->after('coupon_id');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('coupon_id');
            $table->dropColumn('discount_amount');
        });
    }
};
