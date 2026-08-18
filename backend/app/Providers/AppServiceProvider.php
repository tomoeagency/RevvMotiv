<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Enforce application timezone globally to Indian Standard Time (Asia/Kolkata)
        date_default_timezone_set('Asia/Kolkata');

        // Safety guard: prevent accidental deployment of test credentials to production
        if ($this->app->environment('production')) {
            $keyId = (string) config('services.razorpay.key_id');
            if (str_starts_with($keyId, 'rzp_test_')) {
                throw new \RuntimeException('CRITICAL: Razorpay test key (rzp_test_...) configured in production environment. Deployment aborted.');
            }
        }
    }
}
