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

    // TODO: add the deployed Vercel origin once the frontend is live —
    // see hostinger-deploy / frontend deployment notes.
    'allowed_origins' => [
        'http://localhost:3000', // Next.js dev
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];
