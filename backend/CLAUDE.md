# Project: RevvMotiv Backend — Laravel API + Admin Panel

## What this project is
The backend for a car styling/performance accessories e-commerce brand.
**This repo is API-only for the storefront** — the customer-facing site
is a separate React app (see `../frontend`) that consumes this as a JSON
API. This repo also hosts the **admin panel**, which stays server-rendered
Blade (internal tool, not customer-facing, no need to SPA-ify it).

Deployment target: **Hostinger shared hosting ("Unlimited" plan)** via
SSH + Composer + Git deploy. No Docker, no VPS-only tooling.

## Hard constraints — never violate these
- **Stack is Laravel (PHP) + MySQL.** Storefront responses are JSON only
  — do not build Blade views for products/cart/checkout, that's the
  React app's job now.
- **Admin panel is Blade + Tailwind**, protected by a single admin login
  (Laravel's built-in auth or Breeze, kept minimal) — this part is NOT
  an API, it's rendered server-side same as before.
- **API auth for admin actions uses Laravel Sanctum** (token-based) since
  a separate SPA needs to call authenticated admin endpoints too if you
  ever move admin to React later. Public storefront endpoints (product
  list, product detail) need no auth.
- **CORS must be configured** in `config/cors.php` to allow the deployed
  Vercel frontend origin (and `http://localhost:5172` for local dev —
  matches the Vite port in the frontend's package.json). Never use `*`
  for `allowed_origins` once real payment endpoints exist.
- **Hosting is shared hosting, not VPS/cloud.** No long-running daemons;
  cron-based scheduling only (`php artisan schedule:run` via cPanel cron).
- **Media (product images, review photos/videos) goes to Cloudinary**,
  not local `storage/`.
- **Payments are Razorpay, partial "X% advance, rest COD" flow — X is
  admin-configurable, not hardcoded.** See
  `.claude/skills/razorpay-advance-payment/SKILL.md`. Every order has
  `advance_amount`, `remaining_amount`, and a `payment_status` lifecycle.
  Always verify Razorpay payments via **webhook signature verification**,
  never trust only the frontend success callback.
- **Every public JSON response follows the shared shape** — see
  `.claude/skills/api-response-format/SKILL.md`. The React frontend is
  built against this contract; breaking it silently breaks the site.
- **Timeline is aggressive.** Default to the simplest correct
  implementation. Flag scope creep instead of silently doing more.

## Tech conventions
- Laravel latest stable — check `composer.json` before assuming version.
- Eloquent ORM only, never raw string-concatenated SQL.
- Form Requests for validation on anything beyond a trivial 1-2 field form.
- API Resources (`php artisan make:resource`) for every JSON response —
  never `return $model` directly, always shape it through a Resource so
  the response contract in `api-response-format` skill is enforced by
  code structure, not convention alone.
- All money values: pick ONE convention (integer paise or decimal(10,2))
  at project start and never mix — check existing migrations first.

## Database entities (core — confirm against latest migrations)
`products`, `categories`, `orders`, `order_items`, `reviews`,
`admin_settings` (key-value store — this is where the Razorpay advance %
lives, plus any other admin-tunable values), `admins`.

Products: title, price, compare_at_price, stock, category_id,
is_featured (bool), featured_order (int), images (Cloudinary URLs),
status (active/draft).

Orders: customer info, items, total_amount, advance_amount,
remaining_amount, payment_status, order_status, razorpay_payment_id,
razorpay_order_id.

## Definition of done, for any task in this repo
1. If it's a public endpoint: response passes through an API Resource and
   matches `api-response-format`.
2. No secrets (Razorpay keys, DB credentials, Cloudinary keys) hardcoded
   — everything through `.env` / `config/`.
3. If it touches money/orders: happy path AND at least one failure path
   (Razorpay fails, webhook arrives twice) handled.
4. Migration + seeder included for any new table/columns.
5. If a new public endpoint was added or changed, note it so the frontend
   agent's `api-integration` skill can be updated to match — a silent API
   contract change breaks the React app without warning.

## What NOT to do unless explicitly asked
- Don't build Blade views for storefront pages — that's `../frontend` now.
- Don't build a full automated test suite — manual QA is the agreed
  approach for this project's scale/timeline.
- Don't add customer accounts/registration unless asked — checkout is
  guest-checkout + Razorpay, no login for customers.
- Don't reach for Redis, queues, Docker, or microservices.

## Working style
- Check `.claude/skills/` first for ambiguous requests — there's likely
  a skill encoding the exact pattern.
- After any schema OR public-API-shape change, remind me to run
  `php artisan migrate` and flag it to the frontend side.
