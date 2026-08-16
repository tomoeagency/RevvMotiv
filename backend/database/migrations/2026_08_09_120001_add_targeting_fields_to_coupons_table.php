<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            // Admin controls which active coupons the storefront checkout
            // advertises in an "available coupons" list — a code can still
            // be redeemed by anyone who has it even when hidden (e.g.
            // influencer codes handed out off-platform, not meant to be
            // publicly browsable).
            $table->boolean('is_public')->default(true)->after('active');

            // Label only, for the admin's own tracking — never exposed on
            // any public endpoint.
            $table->string('influencer_name')->nullable()->after('is_public');

            // Discount scope: 'all' (whole order, existing behavior),
            // 'products' (only line items in scope_product_ids get
            // discounted), 'category' (only line items in scope_category_id
            // get discounted). min_order_amount still checks the FULL cart
            // regardless of scope — "spend X to unlock Y% off category Z"
            // is the intended pattern.
            $table->enum('scope_type', ['all', 'products', 'category'])->default('all')->after('influencer_name');
            $table->json('scope_product_ids')->nullable()->after('scope_type');
            $table->foreignId('scope_category_id')->nullable()->after('scope_product_ids')->constrained('categories')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('coupons', function (Blueprint $table) {
            $table->dropConstrainedForeignId('scope_category_id');
            $table->dropColumn(['is_public', 'influencer_name', 'scope_type', 'scope_product_ids']);
        });
    }
};
