// JS-side mirror of the CSS timing tokens in app/globals.css
// (--duration-micro/base/page, --ease-brand). Motion's `transition` prop
// needs numeric seconds and an easing array, which a CSS var reference
// can't provide directly, so these constants are the one place motion
// timing is defined for components — import them instead of picking a
// duration/ease per component.
export const MOTION_DURATION = {
  /** Hover states, small UI chrome: FABs, icons, badges, tiny captions. */
  micro: 0.15,
  /** Card entrances, drawers, modals, standard content blocks/list items. */
  base: 0.3,
  /** Page-level elements: navbar, hero copy, major section reveals. */
  page: 0.6,
} as const;

export const MOTION_EASE_BRAND = [0.16, 1, 0.3, 1] as const;
