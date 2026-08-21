<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\ProductController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\OrderController;
use App\Http\Controllers\Api\V1\RazorpayWebhookController;
use App\Http\Controllers\Api\V1\AdminAuthController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\RecentPurchaseController;
use App\Http\Controllers\Api\V1\AnnouncementController;
use App\Http\Controllers\Api\V1\GalleryController;
use App\Http\Controllers\Api\V1\LeadController;
use App\Http\Controllers\Api\V1\EnquiryController;
use App\Http\Controllers\Api\V1\PolicyController;
use App\Http\Controllers\Api\V1\ProjectController;
use App\Http\Controllers\Api\V1\CouponController;
use App\Http\Controllers\Api\V1\SiteSettingsController;
use App\Http\Controllers\Api\V1\Admin\SettingController;
use App\Http\Controllers\Api\V1\Admin\OrderController as AdminOrderController;

Route::prefix('v1')->group(function () {
    // Public storefront — no auth.
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);
    Route::get('/products/{product}/reviews', [ReviewController::class, 'forProduct']);
    Route::get('/categories', [CategoryController::class, 'index']);
    Route::get('/reviews/featured', [ReviewController::class, 'featured']);
    Route::get('/recent-purchases', [RecentPurchaseController::class, 'index']);
    Route::get('/announcement', [AnnouncementController::class, 'index']);
    Route::get('/gallery', [GalleryController::class, 'index']);
    Route::get('/site-settings', [SiteSettingsController::class, 'index']);
    Route::get('/policies/{slug}', [PolicyController::class, 'show']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{slug}', [ProjectController::class, 'show']);
    Route::get('/coupons/available', [CouponController::class, 'available']);

    // Throttled — public + writable, don't let it be spammed.
    Route::post('/reviews', [ReviewController::class, 'store'])->middleware('throttle:10,1');
    Route::post('/leads', [LeadController::class, 'store'])->middleware('throttle:10,1');
    Route::post('/enquiries', [EnquiryController::class, 'store'])->middleware('throttle:10,1');

    // Throttled — read-only, but a public code lookup shouldn't be
    // brute-forceable for valid influencer/hidden coupon codes.
    Route::post('/coupons/preview', [CouponController::class, 'preview'])->middleware('throttle:20,1');

    // Throttled — a money-touching endpoint that shouldn't be spammable.
    Route::post('/orders', [OrderController::class, 'store'])->middleware('throttle:20,1');

    // Read-only order status — lets the frontend poll for real payment_status
    // after the Razorpay Checkout.js handler fires (which is UX-only, not
    // payment truth). OrderResource carries no customer PII, so this is
    // safe to leave public like the other storefront GET endpoints.
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/verify-payment', [OrderController::class, 'verifyPayment']);
    Route::get('/orders/{order}/invoice', [OrderController::class, 'invoice']);

    // Not throttled by IP — Razorpay's own servers call this, and legitimate
    // deliveries shouldn't be dropped. Signature verification is what
    // protects it from abuse, not rate limiting.
    Route::post('/razorpay/webhook', [RazorpayWebhookController::class, 'handle']);

    // iCarry.in Courier Logistics Webhook (Automated delivery status updates + post-delivery review email trigger)
    Route::post('/webhooks/icarry', [\App\Http\Controllers\Api\V1\ICarryWebhookController::class, 'handle']);

    // Admin auth (Sanctum token issuance). Throttled to blunt brute-force
    // password guessing against the single admin account.
    Route::post('/admin/login', [AdminAuthController::class, 'login'])->middleware('throttle:5,1');

    // Admin-only, Sanctum token required.
    Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        Route::put('/settings/razorpay-advance-percent', [SettingController::class, 'updateRazorpayAdvancePercent']);
        Route::post('/orders/manual', [AdminOrderController::class, 'storeManual']);
    });
});
