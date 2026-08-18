# RevvMotiv Production Hardening & Readiness Changelog

This document tracks all 11 core hardening and production readiness audits and implementations completed across the RevvMotiv platform (Laravel backend + Next.js frontend).

---

## Business & Legal Entity Alignment (Confirmed Master Data)
- **Legal / Business Name:** `RevvMotiv` (standardized site-wide; no "Ltd.", "LLP", "Pvt Ltd", or "Garages").
- **GST Disclosure:** Omitted completely from all invoices, footers, and policy pages (entity not GST-registered).
- **Registered Workshop Address:** `Site-5, Kasna, Greater Noida, Uttar Pradesh, India` (standardized on invoice, footer, policies, and contact page).
- **Support Email:** `support@revvmotiv.com` (all legacy addresses replaced).
- **WhatsApp Support:** `+91 83683 43232` (with pre-filled dynamic chat query).
- **Instagram Channels:** Dual build accounts `@revv.nation__` (`https://www.instagram.com/revv.nation__/`) and `@sonet.4100__` (`https://www.instagram.com/sonet.4100__/`) framed as "Follow the builds".
- **Team Narrative:** Collective workshop voice ("The RevvMotiv Team" / "The Workshop Build Team" / "Technical Fitment Desk"), zero personal names or photos.

---

## 1. Security Hardening
- [x] **Order IDOR Protection (`access_token`):**
  - Created database migration `2026_08_18_194000_add_access_token_to_orders_table.php` adding a 40-character random token (`Str::random(40)`) to `orders`.
  - Protected public endpoints `/api/v1/orders/{order}` and `/api/v1/orders/{order}/invoice` to require matching `access_token` query parameter or authenticated admin access.
  - Exposed `access_token` in `OrderResource.php` and consumed securely across Next.js checkout, order confirmation, and invoice viewing.
- [x] **HTTP Security Headers:**
  - Registered `App\Http\Middleware\SecurityHeaders` in Laravel adding `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy`.
  - Configured Next.js security headers and CSP in `frontend/next.config.ts` allowing Razorpay checkout scripts, iframes, and fonts.
- [x] **CORS Origin Whitelisting:**
  - Configured `backend/config/cors.php` to restrict allowed origins via `CORS_ALLOWED_ORIGINS` environment variable with production domain fallbacks.
- [x] **Sanctum Expiration & Rate Limiting:**
  - Configured `backend/config/sanctum.php` with `expiration => 1440` (24-hour token lifetime).
  - Applied `throttle:5,1` rate limiting to admin login routes in `backend/routes/web.php`.
- [x] **Gated System Endpoints:**
  - Restricted `/system/sync-database` in `backend/routes/web.php` to `local` and `staging` environments (`app()->environment('local', 'staging')`).
- [x] **Upload Security & Script Execution Prevention:**
  - Hardened `CloudinaryUploadService.php` with server-side `mime_content_type()` verification against strict MIME map (`image/jpeg`, `image/png`, `image/webp`, `video/mp4`).
  - Added `backend/public/uploads/.htaccess` with `php_flag engine off` and `RemoveHandler` to disallow PHP script execution in upload storage.

---

## 2. Razorpay & Order Concurrency Hardening
- [x] **Production Live Key Guard:**
  - Added boot guard in `AppServiceProvider.php` throwing `RuntimeException` if `RAZORPAY_KEY_ID` starts with `rzp_test_` when `APP_ENV=production`.
- [x] **Webhook Idempotency:**
  - Hardened `RazorpayWebhookController.php` to handle duplicate webhook deliveries gracefully by verifying existing order state and returning `200 OK` on repeated confirmation events.
- [x] **Concurrency & Race Condition Prevention:**
  - Wrapped stock validation and decrement in `DB::transaction()` with `Product::whereIn(...)->lockForUpdate()` in `OrderService.php` to prevent overselling on flash traffic.
- [x] **Coupon Rollback on Payment Failure:**
  - Added coupon decrement rollback on `payment.failed` webhook event.
- [x] **Dynamic Advance Percentage:**
  - Exposed `razorpay_advance_percent` in `SiteSettingsController.php` and dynamically calculated 20% (or admin-configured %) advance and balance COD due in checkout.
- [x] **Cart Preservation on Failure:**
  - Ensured `clearCart()` is executed strictly upon successful payment callback in `frontend/app/checkout/page.tsx`, preserving cart contents on modal dismissal or payment failure so users can retry.
- [x] **Reassuring Polling & Direct Retry:**
  - Enhanced `frontend/app/order-confirmation/[id]/page.tsx` with exponential backoff polling (up to 30 attempts) and reassuring copy preventing accidental double-charges.

---

## 3. Invoicing, Policies & Statutory Disclosures
- [x] **Tax Invoice Template (`order_invoice.blade.php`):**
  - Updated company header to `RevvMotiv`, registered address to `Site-5, Kasna, Greater Noida, Uttar Pradesh, India`, and support email/phone.
  - Completely removed all GSTIN lines.
- [x] **Statutory Grievance Redressal:**
  - Added Grievance Redressal and Registered Office disclosures to `PolicySeeder.php` per Consumer Protection (E-Commerce) Rules 2020 and DPDP Act 2023.
- [x] **Delivery Timeline Standardization:**
  - Standardized shipping policy copy to "Standard Tracked Courier (5–7 business days from dispatch)".
- [x] **WhatsApp Click-to-Chat:**
  - Configured `+91 83683 43232` with prefilled context message in `WhatsAppFab.tsx`.
- [x] **Agency Credit:**
  - Refined agency credit in `Footer.tsx` to a clean, minimal, non-distracting credit.

---

## 4. Team Narrative & Social Channels
- [x] **Workshop Story (`frontend/app/about/page.tsx`):**
  - Framed story around "The RevvMotiv Team", "The Workshop Build Team", and "Technical Fitment Desk" with zero personal founder names or photos.
- [x] **Dual Instagram Build Accounts:**
  - Added direct links to `@revv.nation__` and `@sonet.4100__` under workshop updates and contact channels.

---

## 5. Category Taxonomy Normalization
- [x] **Aero Mirror & Styling:**
  - Renamed "Batman Cover" to "Aero Mirror & Styling" across database (`Category` record), `CategorySeeder.php`, `Navbar.tsx`, `ShopPage.tsx`, and `constants.ts`.

---

## 6. Centralization of Constants & Hardcoded Fallbacks
- [x] **Removed Fabricated Reviews:**
  - Removed `FALLBACK_REVIEWS` array from `TrustPanelClient.tsx`; only real verified database reviews or graceful empty states are rendered.
- [x] **Centralized Constants (`frontend/lib/constants.ts`):**
  - Created `BUSINESS_DETAILS` and `FALLBACK_CATEGORIES` for clean import reuse across frontend components.

---

## 7. SEO & Discoverability
- [x] **Sitemap Pagination:**
  - Updated `frontend/app/sitemap.ts` to paginate across all product pages until `last_page` is reached.
- [x] **Canonical Tags:**
  - Added canonical URLs to `frontend/app/shop/page.tsx` and `frontend/app/products/[slug]/page.tsx`.
- [x] **Product Structured Data:**
  - Added JSON-LD `Product` schema in `frontend/app/products/[slug]/page.tsx`.
- [x] **Robots Disallow:**
  - Added `/order-confirmation/` to `frontend/app/robots.ts`.

---

## 8. Performance & UI Polish
- [x] **Lenis Smooth Scroll Engine:**
  - Resolved scroll lockups by eliminating CSS collision (`scroll-behavior: smooth`), applying official Lenis layout CSS, and binding `ResizeObserver` and route updates.
- [x] **Review Card Complete Text Display:**
  - Removed `line-clamp` truncation from `FeaturedReviews.tsx` and resized review card dimensions to fit 100% of customer review text.
- [x] **Composited GPU Animations:**
  - Utilized `transform` and `opacity` for all hover micro-interactions to prevent layout reflows.

---

## 9. Accessibility (a11y)
- [x] **Form Labels & IDs:**
  - Linked checkout form `<label>` and `<input>` using matching `id` and `htmlFor`.
- [x] **Pluralized ARIA Labels:**
  - Updated cart button `aria-label` to dynamically announce item count (`1 item` vs `N items in cart`).
- [x] **Reduced Motion Support:**
  - Added `@media (prefers-reduced-motion: reduce)` rules in `globals.css` to pause marquee animations for users with motion sensitivity.

---

## 10. Vehicle Fitment Filter
- [x] **Shop Page Vehicle Chips:**
  - Added quick filter chips for popular Indian vehicle platforms (Verna, Sonet, Tiago, Polo, Swift, Thar, Creta) linking to backend search/fitment query.
- [x] **Product Page Fitment & Guarantee Badges:**
  - Added prominent "100% Tested Fitment Guarantee", "Standard Tracked Courier (5–7 Days)", and continuous unboxing video requirement notices.
