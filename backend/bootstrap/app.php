<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // API guests (Sanctum-protected JSON routes) get a clean 401
        // instead of a redirect. Admin panel (Blade, session `web` guard)
        // guests get sent to the login screen.
        $middleware->redirectGuestsTo(function ($request) {
            return $request->is('api/*') ? null : route('admin.login');
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // This is an API-only repo for the storefront (per CLAUDE.md) — every
        // /api/* response must be JSON per api-response-format skill, even
        // when the client doesn't send Accept: application/json.
        $exceptions->shouldRenderJsonWhen(function ($request, $e) {
            return $request->is('api/*') || $request->expectsJson();
        });
    })->create();
