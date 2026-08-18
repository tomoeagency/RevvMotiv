<?php

use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\CouponController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ExpenseController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\LeadEnquiryController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PolicyController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\ProjectController;
use App\Http\Controllers\Admin\ProjectViewController;
use App\Http\Controllers\Admin\ReviewController;
use App\Http\Controllers\Admin\SettingsController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect('https://www.revvmotiv.com', 301);
});

// Admin panel — server-rendered Blade, single admin login via session
// auth (guard: web -> provider: admins, see config/auth.php). This is
// NOT part of the JSON API in routes/api.php.
Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest')->group(function () {
        Route::get('login', [AuthController::class, 'showLogin'])->name('login');
        Route::post('login', [AuthController::class, 'login'])->middleware('throttle:5,1')->name('login.attempt');
    });

    Route::middleware('auth')->group(function () {
        Route::post('logout', [AuthController::class, 'logout'])->name('logout');

        Route::get('/', DashboardController::class)->name('dashboard');

        Route::resource('products', ProductController::class)->except('show');
        Route::resource('categories', CategoryController::class)->except('show');

        Route::get('orders', [OrderController::class, 'index'])->name('orders.index');
        Route::get('orders/create', [OrderController::class, 'create'])->name('orders.create');
        Route::post('orders', [OrderController::class, 'store'])->name('orders.store');
        Route::get('orders/{order}', [OrderController::class, 'show'])->name('orders.show');
        Route::patch('orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.updateStatus');
        Route::patch('orders/{order}/mark-paid', [OrderController::class, 'markFullyPaid'])->name('orders.markFullyPaid');
        Route::get('orders/{order}/edit', [OrderController::class, 'edit'])->name('orders.edit');
        Route::put('orders/{order}', [OrderController::class, 'update'])->name('orders.update');

        Route::get('reviews', [ReviewController::class, 'index'])->name('reviews.index');
        Route::get('reviews-export', [ReviewController::class, 'export'])->name('reviews.export');
        Route::patch('reviews/{review}/approve', [ReviewController::class, 'approve'])->name('reviews.approve');
        Route::patch('reviews/{review}/reject', [ReviewController::class, 'reject'])->name('reviews.reject');
        Route::delete('reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

        Route::resource('expenses', ExpenseController::class)->except('show');
        Route::resource('coupons', CouponController::class)->except('show');
        Route::resource('announcements', AnnouncementController::class)->except('show');
        Route::resource('gallery', GalleryController::class)->except('show')->parameters(['gallery' => 'galleryItem']);
        Route::resource('policies', PolicyController::class)->except('show');

        Route::resource('projects', ProjectController::class)->except('show');
        Route::get('projects/{project}/views/create', [ProjectViewController::class, 'create'])->name('projects.views.create');
        Route::post('projects/{project}/views', [ProjectViewController::class, 'store'])->name('projects.views.store');
        Route::get('projects/{project}/views/{view}/edit', [ProjectViewController::class, 'edit'])->name('projects.views.edit');
        Route::put('projects/{project}/views/{view}', [ProjectViewController::class, 'update'])->name('projects.views.update');
        Route::delete('projects/{project}/views/{view}', [ProjectViewController::class, 'destroy'])->name('projects.views.destroy');

        Route::get('account', [AccountController::class, 'edit'])->name('account.edit');
        Route::put('account', [AccountController::class, 'update'])->name('account.update');

        Route::get('leads-enquiries', [LeadEnquiryController::class, 'index'])->name('leads-enquiries.index');
        Route::get('leads-enquiries/leads/export', [LeadEnquiryController::class, 'exportLeads'])->name('leads-enquiries.export-leads');
        Route::get('leads-enquiries/enquiries/export', [LeadEnquiryController::class, 'exportEnquiries'])->name('leads-enquiries.export-enquiries');

        Route::get('system/sync-database', function() {
            if (!app()->environment('local', 'staging')) {
                abort(404);
            }
            \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'Database\Seeders\ProjectDemoSeeder', '--force' => true]);
            \Illuminate\Support\Facades\Artisan::call('db:seed', ['--class' => 'Database\Seeders\ReviewDemoSeeder', '--force' => true]);
            \App\Models\Review::where('status', '!=', 'approved')->update(['status' => 'approved']);
            return response()->json([
                'status' => 'success',
                'projects_count' => \App\Models\Project::count(),
                'reviews_count' => \App\Models\Review::count(),
                'approved_reviews' => \App\Models\Review::where('status', 'approved')->count(),
            ]);
        })->name('system.sync-database');

        Route::get('settings', [SettingsController::class, 'edit'])->name('settings.edit');
        Route::put('settings/razorpay-advance-percent', [SettingsController::class, 'update'])->name('settings.update');
        Route::put('settings/announcement', [SettingsController::class, 'updateAnnouncement'])->name('settings.update-announcement');
        Route::put('settings/site-settings', [SettingsController::class, 'updateSiteSettings'])->name('settings.update-site-settings');
    });
});
