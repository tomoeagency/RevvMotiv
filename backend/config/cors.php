<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | This repo is API-only for the storefront (see CLAUDE.md) — the React/
    | Next.js frontend lives in a separate origin, so CORS must explicitly
    | allow it. Never wildcard '*' here once payment endpoints exist.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'https://www.revvmotiv.com,https://revvmotiv.com,http://localhost:3000,http://127.0.0.1:3000')),

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
