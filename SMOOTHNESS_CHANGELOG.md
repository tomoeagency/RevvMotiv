# Smoothness & Micro-Interactions Changelog (`SMOOTHNESS_CHANGELOG.md`)

This document records the visual polish, transition engineering, and micro-interaction pass across the RevvMotiv e-commerce storefront (`frontend/`).

---

## 1. Global Motion Principles & Tokens

- **Consistent Easing Scale**:
  - Brand Expo Curve: `cubic-bezier(0.16, 1, 0.3, 1)` for buttery entrances, drawers, and modal transitions.
  - Spring Easing: `cubic-bezier(0.34, 1.56, 0.64, 1)` for badges, toggles, and count pop-ins.
  - Smooth UI Transition: `cubic-bezier(0.4, 0, 0.2, 1)` for hover and focus states.
- **Inertial Smooth Scrolling**:
  - Implemented `Lenis` smooth scroll provider with normalized wheel multiplier (`wheelMultiplier: 1.0`, `duration: 1.1s`) and exponential ease-out dampening.
  - Fully respects `prefers-reduced-motion: reduce` by disabling smooth scrolling and instantizing keyframes when requested by system settings.

---

## 2. Component-by-Component Transitions & Micro-Interactions

| Component / Area | Before | After | Animation Technique |
|---|---|---|---|
| **SmoothScrollProvider** (`SmoothScrollProvider.tsx`) | Empty stub returning un-scrolled DOM | Initialized `Lenis` inertial smooth scroll with requestAnimationFrame loop | Lenis RAF + CSS scroll-behavior |
| **Reviews Carousel & Cards** (`FeaturedReviews.tsx`) | Fixed truncated card requiring click to open modal | Hovering over any review card expands the full review text and pauses the marquee; moving cursor away immediately resumes the marquee | CSS `group-hover/card:line-clamp-none`, max-height transition, and paused marquee state |
| **Product Card** (`ProductCard.tsx`) | Hard hover state with standard image zoom | Subtle elevation lift (`interactive-lift`), smooth secondary image crossfade on hover, and spring-scaled quick add confirmation checkmark | Framer Motion spring + CSS opacity crossfade |
| **Shop Catalog Grid** (`ShopClientGrid.tsx`) | Full-screen spinner causing jarring layout shift when loading or filtering | 6-card shimmering skeleton grid (`ProductCardSkeleton`) + staggered `motion.div` pop-in entrance on filter update | Shimmer keyframes + Framer Motion layout transition |
| **Add To Cart Button** (`AddToCartButton.tsx`) | Flat quantity integer incrementing instantly | Animated numeric odometer slider (`AnimatePresence mode="popLayout"`) + tactile `whileTap={{ scale: 0.85 }}` button springs | Framer Motion AnimatePresence & spring scale |
| **Product Gallery** (`ProductGallery.tsx`) | Only rendered first image statically | Dedicated multi-angle gallery with crossfade transition (`AnimatePresence mode="wait"`) and active thumbnail ring indicator | Next.js Image + Framer Motion crossfade |
| **Cart Badge Count** (`Navbar.tsx`) | Static number appearing abruptly | Pop-in badge bounce animation on cart quantity update (`animate-badge-pop`) | CSS Cubic-Bezier Spring |
| **Primary CTAs** (`PrimaryCtaButton.tsx`) | Standard hover effect | Tactile button press (`whileTap: 0.97`, `whileHover: 1.03`), glowing bloom elevation, and sweeping gradient angle | Motion button + dynamic background position |

---

## 3. Accessibility & Performance Verification
- All animations use GPU-accelerated CSS properties (`transform`, `opacity`, `filter`).
- `prefers-reduced-motion` media queries applied site-wide in `globals.css` ensuring 0 animation latency for users who prefer reduced motion.
