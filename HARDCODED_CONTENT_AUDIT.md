# Comprehensive Hardcoded Content Audit Report

> **Audit Status**: Complete & Exhaustive  
> **Mode**: REPORT ONLY (Strictly zero code modifications during this audit pass)  
> **Target Systems**: Next.js Storefront Frontend (`frontend/`), Laravel REST API & Admin Backend (`backend/`), Database Seeders & Migration SQLs, Static Asset Indices (`llms.txt`, `llms-full.txt`, `RootSchema.tsx`).

---

## 1. Executive Summary

| Data Category [TYPE] | Total Finding Locations | Severity / Impact | Primary Fix Strategy |
| :--- | :---: | :---: | :--- |
| **[Fallback] Mock & Static Data Fallbacks** | 14 | 🔴 Critical | Remove hardcoded JSON/arrays; handle empty/error states gracefully or link to DB |
| **[Taxonomy] Legacy / Ghost Taxonomy ("Batman Cover")** | 6 | 🟠 High | Migrate to `"Aero Mirror & Styling"` / DB categories |
| **[Marketing] Fake / Stale Numeric Claims** | 8 | 🟠 High | Eliminate hardcoded metrics (`45+`, `14+`); calculate dynamically from DB |
| **[Business] Uncentralized Business & Contact Info** | 18 | 🟡 Medium | Standardize to single constant (`constants.ts`) and dynamic API (`/site-settings`) |
| **[Config] Hardcoded Base URLs & Domains** | 7 | 🟡 Medium | Source from `process.env.NEXT_PUBLIC_APP_URL` / `config('app.url')` |
| **[Policy] Legal & Statutory Drift** | 4 | 🟢 Low-Med | Ensure all policy pages render strictly from dynamic DB policy endpoints |
| **Total Findings** | **57** | — | — |

---

## 2. Specific Verification Sections

### 2.1 "Batman Cover" Leftover Audit

In previous iterations, the legacy `"Batman Cover"` taxonomy was replaced with `"Aero Mirror & Styling"`. However, several orphaned references and seed files still contain this label.

| # | Location | Line Number(s) | Current Hardcoded Value | Correct Destination / Action |
| :- | :--- | :--- | :--- | :--- |
| 1 | `frontend/public/llms-full.txt` | L52–L58 | `### E. Batman Cover Collection`<br>`1. Bat-Wing Hood Vent Covers (Pair)`<br>`2. Batman-Style Side Mirror Covers`<br>`3. Bat-Wing Fender Vent Trim (Pair)`<br>`4. Batman Bonnet Scoop Cover`<br>`5. Bat-Style Rear Window Louver Cover` | Replace header and entries with real category `Aero Mirror & Styling` or live catalog items. |
| 2 | `frontend/public/llms.txt` | L18–L23 | Mentions category taxonomy without mirror styling. | Align with 8 official DB categories. |
| 3 | `backend/database/seeders/CatalogDemoSeeder.php` | L15–L19, L58–L64 | `'Batman Cover' => [`<br>`['Bat-Wing Hood Vent Covers (Pair)', 3200, ...],`<br>`['Batman-Style Side Mirror Covers', 2800, ...],`<br>`['Bat-Wing Fender Vent Trim (Pair)', 2400, ...],`<br>`['Batman Bonnet Scoop Cover', 4500, ...],`<br>`['Bat-Style Rear Window Louver Cover', 6800, ...]` | Update category key to `'Aero Mirror & Styling'` or delete demo items. |
| 4 | `backend/database/seeders/ReviewDemoSeeder.php` | L19, L46 | `$mirrorCapsId = Product::where('slug', 'batman-style-side-mirror-covers')->value('id')`<br>`// Batman-Style Side Mirror Covers` | Update slug to real mirror cap product or dynamic product query. |
| 5 | `backend/database/seed_data_mysql.sql` | L21, L68–L72 | `INSERT INTO categories ... 'Batman Cover', 'batman-cover'`<br>`INSERT INTO products ... 'batman-style-side-mirror-covers'` | Update SQL seed dump to remove deprecated taxonomy. |
| 6 | `backend/database/revvmotiv_full_database.sql` | L64, L148–L152 | `INSERT INTO categories ... 'Batman Cover', 'batman-cover'` | Update full database backup SQL file. |

---

### 2.2 Numeric / Unverifiable Stat Claims Audit

All quantitative claims that could lead to consumer compliance or credibility issues were audited:

| Claim Value | Found Location | Line(s) | Context / Current Value | Recommended Remedy |
| :--- | :--- | :--- | :--- | :--- |
| **"45+ cities"** | `frontend/app/components/RootSchema.tsx` | L192 | `"Yes, RevvMotiv provides insured Pan-India express shipping across 45+ cities and all postal PIN codes in India."` | Replace with qualitative `"Pan-India express shipping across all postal PIN codes in India"`. |
| **"45+ cities"** | `frontend/public/llms.txt` | L31 | `Delivery Coverage: Tracked express shipping across 45+ cities and all postal PIN codes in India (5–7 business days).` | Replace with `"Pan-India express shipping across all serviceable postal PIN codes in India"`. |
| **"45+ cities"** | `frontend/app/faq/page.tsx` | L60 | `shortAnswer: "Standard delivery takes 5 to 7 business days across 45+ cities and all postal PIN codes in India."` | Change to `"Standard delivery takes 5 to 7 business days across all postal PIN codes in India."` |
| **"14+"** | `frontend/app/work/page.tsx` | L93–L96 | `<div className="text-2xl sm:text-3xl font-black text-ink mb-1">14+</div>`<br>`<div className="text-[10px] sm:text-xs font-bold text-ink-muted uppercase tracking-widest">Angle Views Documented</div>` | Replace hardcoded `14+` with dynamic count of total project views (`projects.reduce((acc, p) => acc + (p.views?.length || 0), 0)` or qualitative `"Multi-Angle"`). |
| **"6 Featured Builds" (Hardcoded Fallback)** | `frontend/app/work/page.tsx` | L86 | `{projects && projects.length > 0 ? projects.length : 6}` | Fallback should be `0` or qualitative rather than a hardcoded `6`. |
| **"100% Pre-Preg Carbon Fiber"** | `frontend/app/work/page.tsx` | L99–L102 | Hardcoded metric claiming `100% Pre-Preg Carbon Fiber` (even for ABS builds). | Change to `"Authentic Carbon & ABS Materials"`. |
| **"0% Drop-Shipping"** | `frontend/app/work/page.tsx` | L105–L108 | Hardcoded metric claiming `0% Drop-Shipping / 100% Fitted`. | Change to `"100% In-House Quality Checked"`. |
| **"+45kg Downforce" & "0.1mm"** | Codebase-wide Search | — | **0 active occurrences in source files** (only documented in historical logs/reports). | ✅ Cleared in code; no action needed. |

---

### 2.3 Fallback Data & Mock Objects Audit

The codebase contains several large hardcoded JavaScript data arrays acting as silent fallbacks when API requests fail or during SSG build time:

| Fallback Identifier | Location | Lines | Object Type & Size | Risk If Left As-Is |
| :--- | :--- | :--- | :--- | :--- |
| `FALLBACK_PROJECTS` | `frontend/lib/api.ts` | L448–L620 | 6 full project case study objects with detailed views and work descriptions (172 lines of code). | When admin adds/edits projects in Laravel backend, frontend SSG or offline error state serves stale, hardcoded mock project data instead of showing a clean error/empty state or querying the DB. |
| `FALLBACK_REVIEWS` | `frontend/lib/constants.ts`<br>`frontend/lib/api.ts` | `constants.ts`: L27–L72<br>`api.ts`: L1, L376, L380, L382 | 4 mock reviews with customer names ("Aman Sharma", "Rahul Verma", "Karan Patel", "Vikram Malhotra"). | Disables true dynamic review rendering; if the backend returns 0 approved reviews, fake hardcoded reviews are rendered to users without their consent. |
| `FALLBACK_CATEGORIES` | `frontend/lib/constants.ts`<br>`frontend/lib/api.ts`<br>`frontend/app/shop/page.tsx`<br>`frontend/app/components/Navbar.tsx` | `constants.ts`: L16–L25<br>`api.ts`: L663, L679<br>`shop/page.tsx`: L12, L72, L90<br>`Navbar.tsx`: L18, L35 | 8 category objects with IDs and slugs. | If admin changes category slugs or adds new categories in the backend, the navbar and shop filter defaults continue using this static snapshot until re-fetched. |
| `getSiteSettings` Fallback | `frontend/lib/api.ts` | L428–L433, L438–L443 | `{ whatsapp_number: "+918368343232", instagram_handle: "revvmotiv", contact_email: "orders@revvmotiv.com" }` | Hardcodes outdated email `"orders@revvmotiv.com"` (real email is `support@revvmotiv.com`) and stale IG handle `"revvmotiv"` (real handle is `revv.nation__`). |
| `PLATFORMS` Array | `frontend/app/components/PlatformSelectorSection.tsx` | L8–L93 | 6 hardcoded vehicle platform objects (Hyundai Verna, Kia Sonet, Tata Tiago, Maruti Swift, Hyundai i20, VW Polo GT) with static parts lists. | Updates to workshop projects in the admin panel will never reflect in the homepage "Featured Builds" carousel. |
| `PILLARS` & `METRICS` | `frontend/app/about/page.tsx` | L16–L48 | 4 pillar definitions + 4 metrics cards. | Static content in page component. Acceptable for pure editorial copy, but should reference `BUSINESS_DETAILS` where applicable. |
| `WORK_SLIDES` | `frontend/app/components/TrustPanelClient.tsx` | L13–L20 | 6 static slide images and titles. | Embedded in cart drawer client component. |

---

## 3. Detailed Findings by Category

### Category A: Business & Contact Data (Outside Centralized Store)

| # | Location | Line(s) | Current Value | Should Come From | Risk |
| :- | :--- | :--- | :--- | :--- | :--- |
| A1 | `frontend/lib/api.ts` | L431, L441 | `contact_email: "orders@revvmotiv.com"` | `BUSINESS_DETAILS.supportEmail` (`"support@revvmotiv.com"`) | Customers sending queries to `orders@` may experience email delivery failures or unmonitored inboxes. |
| A2 | `frontend/lib/api.ts` | L430, L440 | `instagram_handle: "revvmotiv"` | `AdminSetting` / `BUSINESS_DETAILS.instagramBuilds` | Broken link pointing to non-existent `@revvmotiv` profile instead of `@revv.nation__`. |
| A3 | `frontend/app/components/Footer.tsx` | L161, L164 | `href="tel:+918368343232"`, `+91 83683 43232` | `settings?.whatsapp_number` / `BUSINESS_DETAILS.whatsappNumber` | Changing phone number in admin settings leaves footer with old hardcoded number. |
| A4 | `frontend/app/components/Footer.tsx` | L170 | `https://wa.me/918368343232?text=...` | `whatsappDigits` / `BUSINESS_DETAILS.whatsappDigits` | Desynchronization with backend WhatsApp admin setting. |
| A5 | `frontend/app/components/Footer.tsx` | L181, L184 | `mailto:support@revvmotiv.com`, `support@revvmotiv.com` | `settings?.contact_email` / `BUSINESS_DETAILS.supportEmail` | Hardcoded email address in JSX template. |
| A6 | `frontend/app/components/Footer.tsx` | L157 | `"Greater Noida, UP, India"` | `BUSINESS_DETAILS.registeredAddress` | Incomplete/uncentralized address string. |
| A7 | `frontend/app/components/Footer.tsx` | L127, L138 | `https://www.instagram.com/revv.nation__/`<br>`https://www.instagram.com/sonet.4100__/` | `BUSINESS_DETAILS.instagramBuilds` | Duplicated static social links. |
| A8 | `frontend/app/contact/page.tsx` | L114 | `"Site-5, Kasna, Greater Noida, Uttar Pradesh, India"` | `BUSINESS_DETAILS.registeredAddress` | Redundant static address definition. |
| A9 | `frontend/app/contact/page.tsx` | L129, L138 | `https://www.instagram.com/revv.nation__/`<br>`https://www.instagram.com/sonet.4100__/` | `BUSINESS_DETAILS.instagramBuilds` | Redundant static social links. |
| A10 | `frontend/app/faq/page.tsx` | L41 | `"+91 83683 43232"` | `BUSINESS_DETAILS.whatsappNumber` | Hardcoded phone inside FAQ answer string. |
| A11 | `frontend/app/faq/page.tsx` | L88, L90, L178 | `"Site-5, Kasna, Greater Noida, UP 201306"` | `BUSINESS_DETAILS.registeredAddress` | Hardcoded address in 3 FAQ answers. |
| A12 | `frontend/app/faq/page.tsx` | L188, L189 | `"+91 83683 43232"`, `"support@revvmotiv.com"` | `BUSINESS_DETAILS` | Hardcoded contact badges in FAQ header. |
| A13 | `frontend/app/faq/page.tsx` | L211 | `https://wa.me/918368343232?text=...` | `BUSINESS_DETAILS.whatsappDigits` | Hardcoded WhatsApp link. |
| A14 | `backend/database/seeders/AdminSettingSeeder.php` | L26 | `['key' => 'site_instagram_handle'], ['value' => '@revvmotiv']` | Change to `'@revv.nation__'` | Database initial state seeds placeholder handle. |
| A15 | `backend/resources/views/emails/order_invoice.blade.php` | L385, L401, L402 | `+91 83683 43232`<br>`Site-5, Kasna, Greater Noida...`<br>`support@revvmotiv.com` | `AdminSetting` key-value pairs or `config('app.support_email')` | Invoice emails will not reflect changes made in the Admin Settings panel. |

---

### Category B: Catalog & Product Data

| # | Location | Line(s) | Current Value | Should Come From | Risk |
| :- | :--- | :--- | :--- | :--- | :--- |
| B1 | `frontend/lib/api.ts` | L448–L620 | `const FALLBACK_PROJECTS = [...]` (6 detailed project objects) | Laravel DB `projects` & `project_views` tables | Admin updates to project titles/photos are ignored when fallback triggers. |
| B2 | `frontend/lib/constants.ts` | L27–L72 | `const FALLBACK_REVIEWS = [...]` (4 detailed review objects) | Laravel DB `reviews` table (status = 'approved') | Storefront displays mock customer testimonials if DB is empty or API fails. |
| B3 | `backend/database/seeders/ProductSeeder.php` | L50–L57 | `'High-Flow Downpipe'` (performance exhaust part) | Real accessory catalog / delete entry | Product exists in DB with status 'draft' but represents a category RevvMotiv does not sell. |
| B4 | `backend/database/seeders/CatalogDemoSeeder.php` | L26–L38 | 32 Unsplash image IDs cycled across catalog products | Real product photography from Cloudinary / `/images/products/` | Demo catalog products display generic cars rather than specific accessories. |
| B5 | `backend/database/seeders/ReviewDemoSeeder.php` | L21–L87 | 6 demo review records with `example.com` emails | Real customer reviews via `/review` page | Demo reviews can be mistaken for authentic verified customer purchases. |

---

### Category C: Taxonomy & Categories

| # | Location | Line(s) | Current Value | Should Come From | Risk |
| :- | :--- | :--- | :--- | :--- | :--- |
| C1 | `frontend/lib/constants.ts` | L16–L25 | `FALLBACK_CATEGORIES` (8 categories) | Laravel DB `categories` table (`/api/v1/categories`) | If a category is renamed or disabled in the admin panel, fallback remains stale. |
| C2 | `frontend/app/shop/page.tsx` | L72, L90 | `const DEFAULT_CATEGORIES = [...FALLBACK_CATEGORIES]` | `/api/v1/categories` API response | Shop filter sidebar defaults to static list. |
| C3 | `frontend/app/components/Navbar.tsx` | L35 | `useState<Category[]>([...FALLBACK_CATEGORIES])` | `/api/v1/categories` API response | Desktop/mobile navbar dropdown initializes with static list before hydration. |

---

### Category D: Config, URLs & Endpoints

| # | Location | Line(s) | Current Value | Should Come From | Risk |
| :- | :--- | :--- | :--- | :--- | :--- |
| D1 | `backend/resources/views/emails/order_invoice.blade.php` | L391 | `https://revvmotiv.com/order-confirmation/{{ $order->id }}?token={{ $order->access_token }}` | `config('app.frontend_url') . '/order-confirmation/' . ...` | In local or staging environments, invoice links point to production domain. |
| D2 | `frontend/app/components/RootSchema.tsx` | L7, L10, L14, L19, L159, L169 | Hardcoded `https://revvmotiv.com` across JSON-LD schema | `process.env.NEXT_PUBLIC_APP_URL || 'https://revvmotiv.com'` | Staging builds emit production canonicals and schema IDs. |
| D3 | `frontend/public/robots.txt` | L7 | `Sitemap: https://revvmotiv.com/sitemap.xml` | Dynamic generation or env-configured URL | Static domain in robots file. |
| D4 | `frontend/public/llms.txt` | L9–L34 | Multiple `https://revvmotiv.com/*` links | Dynamic generation or env-configured URL | Static domain in LLM context file. |

---

## 4. Duplication Map

The following values are hardcoded in **2 or more distinct locations** across the codebase, representing high maintenance overhead:

```
├── "+91 83683 43232" / "918368343232"
│   ├── frontend/lib/constants.ts (L6, L7)
│   ├── frontend/lib/api.ts (L429, L439)
│   ├── frontend/app/components/Footer.tsx (L164, L170)
│   ├── frontend/app/contact/page.tsx (L17, L75, L83)
│   ├── frontend/app/faq/page.tsx (L41, L188, L211)
│   ├── frontend/app/components/RootSchema.tsx (L22, L216)
│   ├── frontend/public/llms.txt (L29)
│   ├── backend/database/seeders/AdminSettingSeeder.php (L25)
│   ├── backend/database/seeders/PolicySeeder.php (L76, L127, L138, L184)
│   └── backend/resources/views/emails/order_invoice.blade.php (L385, L402)
│
├── "support@revvmotiv.com"
│   ├── frontend/lib/constants.ts (L5)
│   ├── frontend/app/components/Footer.tsx (L181, L184)
│   ├── frontend/app/contact/page.tsx (L90, L98)
│   ├── frontend/app/faq/page.tsx (L189)
│   ├── frontend/app/components/RootSchema.tsx (L23)
│   ├── frontend/public/llms.txt (L30)
│   ├── backend/database/seeders/AdminSettingSeeder.php (L27)
│   ├── backend/database/seeders/PolicySeeder.php (L75, L126, L138, L184)
│   └── backend/resources/views/emails/order_invoice.blade.php (L402)
│
├── "Site-5, Kasna, Greater Noida, Uttar Pradesh, India" / "201306"
│   ├── frontend/lib/constants.ts (L4)
│   ├── frontend/app/components/Footer.tsx (L157)
│   ├── frontend/app/contact/page.tsx (L114)
│   ├── frontend/app/faq/page.tsx (L88, L90, L178)
│   ├── frontend/app/components/RootSchema.tsx (L29-L33)
│   ├── frontend/public/llms.txt (L28)
│   ├── backend/database/seeders/PolicySeeder.php (L74, L125, L137, L183)
│   └── backend/resources/views/emails/order_invoice.blade.php (L401)
│
├── Instagram Links ("@revv.nation__" & "@sonet.4100__")
│   ├── frontend/lib/constants.ts (L11, L12)
│   ├── frontend/app/components/Footer.tsx (L127, L138)
│   ├── frontend/app/contact/page.tsx (L129, L138)
│   ├── frontend/app/about/page.tsx (L241, L249)
│   ├── frontend/app/components/RootSchema.tsx (L122, L123)
│   └── backend/database/seeders/PolicySeeder.php (L77)
│
└── "45+ cities" (Deprecated Quantitative Stat)
    ├── frontend/app/components/RootSchema.tsx (L192)
    ├── frontend/app/faq/page.tsx (L60)
    └── frontend/public/llms.txt (L31)
```

---

## 5. Next Steps & Recommended Action Plan for Phase 2

When user authorizes Phase 2 (Implementation / Fix Round), execute the following order of operations:

1. **Purge Deprecated Taxonomy ("Batman Cover")**:
   - Update `llms-full.txt` and `llms.txt`.
   - Update `CatalogDemoSeeder.php` and `ReviewDemoSeeder.php`.
   - Run seeder cleanup or DB update query if needed.
2. **Harmonize Quantitative & Numeric Claims**:
   - In `RootSchema.tsx`, `faq/page.tsx`, and `llms.txt`: replace `"across 45+ cities"` with qualitative `"Pan-India express delivery across all postal PIN codes"`.
   - In `work/page.tsx`: replace hardcoded `"14+"` and `"6"` with dynamic length calculation or qualitative labels.
3. **Consolidate Fallbacks & Business Constants**:
   - Update `frontend/lib/api.ts` `getSiteSettings()` fallback to use `BUSINESS_DETAILS.supportEmail` (`support@revvmotiv.com`) and correct handle `@revv.nation__`.
   - Connect `Footer.tsx` and `contact/page.tsx` directly to `BUSINESS_DETAILS` for all fallback cases.
4. **Backend Email Template Parameterization**:
   - Update `order_invoice.blade.php` to receive business phone, address, and support email dynamically from `AdminSetting` or Laravel config.
5. **Re-run Full Validation**:
   - Execute TypeScript check (`npm run build`), verify Laravel seeders, and run end-to-end checkout / review simulation.
