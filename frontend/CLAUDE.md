# Project: RevvMotiv Frontend — Next.js (App Router, migrated from Vite)

## What this project is
The customer-facing storefront. **Originally generated in Google AI
Studio as a Vite + React SPA** (dark carbon-fiber automotive theme, blue/
red gradient accents, Orbitron + Inter fonts, Motion animations, Lucide
icons) — **now migrating to Next.js (App Router)** because product-page
SEO/organic Google traffic matters for this business, and a pure
client-rendered Vite SPA can't deliver that (crawlers get an empty
`<div id="root">` on first paint).

**The visual design, components, and animations from the AI Studio
build are the source of truth — port them as-is, don't redesign.** Only
the rendering strategy changes (CSR → SSR/SSG), not the look.

Backend is a separate Laravel repo (`../backend`) exposing a REST API —
this repo never touches PHP/Blade.

Deployment target: **Vercel** (native Next.js support, zero-config).

## Migration approach
1. Scaffold a fresh Next.js (App Router, TypeScript, Tailwind v4) project.
2. Port `index.css` custom utilities (`.text-chrome`, `.bg-carbon`,
   `.shimmer-card`, keyframes) into the new `app/globals.css` unchanged.
3. Port each component from the old `App.tsx` (Navbar, Hero,
   CategoryStrip, FeaturedProducts, ReelsSection, Footer) into
   `app/components/` — mark any component using `motion/react`,
   `useState`, or `useEffect` with `"use client"` at the top (Server
   Components can't use hooks or browser-only animation libs).
4. The homepage (`app/page.tsx`) can be a Server Component that fetches
   product data server-side and passes it down to client components —
   this is where the real SEO win comes from (products in the initial
   HTML, not fetched after JS loads).
5. Product listing/detail pages become dynamic routes
   (`app/products/page.tsx`, `app/products/[slug]/page.tsx`) — detail
   pages should use `generateMetadata` for per-product `<title>`/
   `<meta description>`/OpenGraph tags, this is the actual SEO payoff.

## Hard constraints — never violate these
- **Match the existing visual language exactly** — same dark palette,
  chrome-gradient text, blue accent, uppercase-tracked typography,
  Motion animation timing already established. Don't introduce a
  different style for new pages.
- **Product/category/detail pages must be Server Components (or use
  `generateStaticParams` + ISR) that fetch data server-side** — this is
  the entire point of the migration. Don't build them as client-side
  `useEffect` fetches, that regresses back to the SEO problem this
  migration exists to fix.
- **Purely interactive pieces (Navbar animations, cart drawer, checkout
  form, social-proof popup) are Client Components** (`"use client"`) —
  that's fine and expected, SEO doesn't require the whole app to be a
  Server Component, just the content that needs indexing.
- **API base URL is `NEXT_PUBLIC_API_URL`** (Next's env var convention,
  not `VITE_API_URL` anymore) for anything fetched client-side; for
  server-side fetches in Server Components, the same URL works via
  plain `fetch()` (no `NEXT_PUBLIC_` prefix needed server-side, but
  using one var for both is simplest — confirm before over-engineering
  a server/client split).
- **Never invent product/order data.** Real API data only, matching
  `.claude/skills/api-integration/SKILL.md`.
- **Razorpay Checkout.js runs client-side only** on the checkout page
  (must be a Client Component) — order creation, amount calc, and
  payment verification all happen on the backend, per
  `.claude/skills/razorpay-checkout/SKILL.md`.
- **Mobile-first**, same as before.

## Tech conventions
- Next.js App Router, TypeScript, Tailwind v4.
- `motion/react` for animations (unchanged from the AI Studio build) —
  any component using it needs `"use client"`.
- `lucide-react` for icons (unchanged).
- Use `next/image` for product/hero images instead of plain `<img>`
  where practical — it's a meaningful Core Web Vitals/SEO win and this
  migration is already an SEO-focused pass, don't skip it.

## Definition of done, for any task in this repo
1. Visually consistent with the existing (ported) design.
2. Any page meant to be indexed (product listing, product detail,
   homepage) is server-rendered with real metadata via
   `generateMetadata` — not a client-only fetch.
3. Real API data, `NEXT_PUBLIC_API_URL` used, no hardcoded hosts.
4. Works at mobile width.
5. If backend's response shape doesn't match expectations, flag it
   explicitly.

## What NOT to do unless explicitly asked
- Don't add a state-management library — React state + hooks is enough.
- Don't build customer login/accounts — guest checkout only.
- Don't mark everything `"use client"` out of convenience — that
  silently undoes the SEO benefit this migration is for; only mark what
  genuinely needs browser APIs/hooks/interactivity.

## Working style
- Check `.claude/skills/` first for ambiguous requests.
- For genuinely new page/layout decisions, consult the `ui-ux-pro-max`
  skill (install per root README) rather than guessing.
