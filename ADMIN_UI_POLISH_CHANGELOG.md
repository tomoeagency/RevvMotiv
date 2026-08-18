# RevvMotiv Admin UI & Visual Polish Changelog

This document outlines the visual polish pass across the entire RevvMotiv internal operations & admin console (`backend/resources/views/admin/` & `backend/resources/views/components/admin/`).

---

## 🎨 Unified SaaS Design Tokens

| Token Category | Value / Class | Description |
| :--- | :--- | :--- |
| **Primary Theme** | `#1e3a5f` (Hover: `#16304d`, Active: `#0f2238`) | Deep Navy tone for primary actions, buttons, and badges. |
| **Sidebar Theme** | `#0f1c2e` (Submenu: `#0b1523`) | High-contrast dark SaaS sidebar with glowing active gradient pills (`from-red-600 to-red-700`). |
| **Page Canvas** | `bg-slate-50` | Soft off-white backdrop reducing eye strain during high-density operations. |
| **Standard Card** | `bg-white rounded-xl border border-slate-200 shadow-xs p-6` | Clean borders and elevation with subtle hover state. |
| **Input Fields** | `rounded-lg border-slate-300 bg-white px-3.5 py-2 text-sm shadow-xs focus:border-[#1e3a5f] focus:ring-2 focus:ring-[#1e3a5f]/20` | High-contrast SaaS form inputs with consistent focus rings. |
| **Typography** | `Inter` / `Plus Jakarta Sans` / `SF Pro` system stack | Modern variable font stack with tabular monospace numerals for prices and stock counts. |

---

## 🏷️ Standardized Component Refactors

### 1. `x-admin.status-badge`
- Added **status dot indicators** and uniform soft background palettes:
  - **Emerald (`bg-emerald-50 text-emerald-700 border-emerald-200`)**: `active`, `approved`, `delivered`, `fully_paid`.
  - **Blue (`bg-blue-50 text-blue-700 border-blue-200`)**: `confirmed`, `shipped`.
  - **Amber (`bg-amber-50 text-amber-700 border-amber-200`)**: `advance_paid`, `pending`, `draft`.
  - **Rose (`bg-rose-50 text-rose-700 border-rose-200`)**: `rejected`, `cancelled`, `failed`.
  - **Purple (`bg-purple-50 text-purple-700 border-purple-200`)**: `refunded`.

### 2. `x-admin.source-badge`
- Refactored sales channel badges with distinct soft tones and subtle borders:
  - **Instagram**: Fuchsia pill (`bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200`).
  - **WhatsApp**: Emerald pill (`bg-emerald-50 text-emerald-700 border-emerald-200`).
  - **Phone Call**: Sky pill (`bg-sky-50 text-sky-700 border-sky-200`).
  - **Website**: Slate pill (`bg-slate-50 text-slate-700 border-slate-200`).

### 3. `x-admin.data-table`
- Enhanced with `rounded-xl`, sticky table container, uppercase tracking headers, soft row hover transitions (`hover:bg-slate-50/70`), and polished empty inbox states.

### 4. `x-admin.form-field`
- Standardized label tracking (`text-xs font-bold uppercase tracking-wider text-slate-700`), required red asterisks, error SVG alert icons, and helper hints.

### 5. `x-admin.delete-button`
- Converted into a high-visibility danger pill button with trash icon and subtle border (`border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100`).

---

## 🖥️ Screen-by-Screen Visual Polish

1. **Top Layout Header & Sidebar (`layout.blade.php`)**:
   - Polished glassmorphism top header (`bg-white/95 backdrop-blur-md`).
   - Standardized admin user badge avatar and logout link.
   - Enhanced sidebar active route indicators with high-contrast gradient pills and external storefront launcher.

2. **Operations Dashboard (`dashboard.blade.php`)**:
   - Modernized telemetry stat cards (Revenue, Gross Profit, Expenses, Net Profit).
   - Clean Live Inventory snapshot cards with total units and stock valuation.
   - Clean period switcher controls and trend chart wrappers.
   - Catalog Stock Health deck with low-stock alerts and clean direct product links.

3. **Products Catalog (`products/`)**:
   - Form structured into 4 logical cards: Information, Pricing & Stock, Organization & Status, and Image Gallery.
   - Index listing polished with filter inputs, Grid/List view switcher, and card hover animations.

4. **Categories (`categories/`)**:
   - Form wrapped in crisp card container.
   - Index listing equipped with Grid/List switcher and item count badges.

5. **Orders Management (`orders/`)**:
   - Index equipped with financial breakdown columns (Advance Paid vs Remaining COD) and channel badges.
   - Order Detail view (`show.blade.php`) structured into an executive ledger with payment summaries, customer profile cards, shipping details, and status transition forms.

6. **Coupons & Promotions (`coupons/`)**:
   - Form structured into 4 cards: Code & Value, Schedule & Limits, Eligibility Rules, and Influencer Attribution.
   - Index table polished with discount type badges and redemption counters.

7. **Reviews Moderation (`reviews/`)**:
   - Grid and List views with star ratings, verified driver badges, and instant Approve/Reject moderation buttons.

8. **Our Work / Vehicle Builds (`projects/`)**:
   - Multi-angle view management with photo thumbnail previews, work descriptions, and perspective editors.

9. **Gallery Showcase (`gallery/`)**:
   - Grid/List toggle, video player tags, and drag-and-drop multi-file bulk uploader.

10. **Announcements (`announcements/`)**:
    - Marquee headline inputs, link fields, and sort position controls.

11. **Legal & Policies (`policies/`)**:
    - Fullscreen monospace Markdown editor and clean revision timestamps.

12. **Operating Expenses (`expenses/`)**:
    - Monthly total calculation card and inline category creation.

13. **Leads & Customer Enquiries (`leads-enquiries/`)**:
    - WhatsApp direct callback buttons with formatted phone numbers and CSV export tools.

14. **Settings & Admin Profile (`settings/` & `account/`)**:
    - Razorpay advance percent config, storefront ticker settings, and profile DP photo uploads.
