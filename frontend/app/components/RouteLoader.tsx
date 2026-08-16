"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { CarDriftOverlay, type DriftDirection } from "./CarDriftOverlay";
import { WheelSpinOverlay } from "./WheelSpinOverlay";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

// TEMP-COMPARE: flip to "drift" to go back to CarDriftOverlay — this is a
// side-by-side toggle for comparing the two loaders live, not a real
// feature flag. Neither component is deleted either way.
const LOADER_VARIANT: "drift" | "wheel" = "wheel";

// The thin top bar stays threshold-gated (sub-300ms waits show nothing —
// a flash on a fast nav reads worse than no indicator). The car-drift
// sequence is different: it's a branded transition moment now, meant to
// play on every navigation, not just slow ones — so it fires immediately
// and runs for its own fixed duration rather than waiting on or being cut
// short by how fast the route actually commits. HERO_VISIBLE_MS should
// stay a beat longer than CarDriftOverlay's own DURATION so it never gets
// cut off mid-animation.
const BAR_THRESHOLD_MS = 350;
const BAR_COMPLETE_MS = 250;
const HERO_VISIBLE_MS = 1800;

// Forward vs. back vs. lateral, by comparing path depth (segment count)
// between where we're leaving from and where we're headed:
//   - deeper (more segments)  -> "forward"  -> linear drift
//   - shallower (fewer)       -> "back"     -> U-turn arc
//   - same depth              -> "lateral"  -> circular drift
// Real popstate (browser back/forward buttons) can't be told apart from
// each other by the event itself, so it's classified the same way by
// comparing the path we're leaving to the one the browser already
// navigated to — a browser-forward into a deeper route still reads as
// "forward," a browser-back to a shallower one still reads as "back."
function classifyDirection(fromPath: string, toPath: string): DriftDirection {
  const fromDepth = fromPath.split("/").filter(Boolean).length;
  const toDepth = toPath.split("/").filter(Boolean).length;
  if (toDepth > fromDepth) return "forward";
  if (toDepth < fromDepth) return "back";
  return "lateral";
}

export function RouteLoader() {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [showHero, setShowHero] = useState(false);
  const [direction, setDirection] = useState<DriftDirection>("forward");
  const [heroKey, setHeroKey] = useState(0);
  const previousPathname = useRef(pathname);
  const barTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heroHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function startNavigation(dir: DriftDirection) {
    setIsCompleting(false);
    setDirection(dir);
    // Bump the key so CarDriftOverlay fully remounts even if two
    // navigations in a row happen to share the same direction — otherwise
    // the second one wouldn't replay from the start.
    setHeroKey((k) => k + 1);
    setShowHero(true);

    if (barTimer.current) clearTimeout(barTimer.current);
    if (heroHideTimer.current) clearTimeout(heroHideTimer.current);
    barTimer.current = setTimeout(() => setIsVisible(true), BAR_THRESHOLD_MS);
    heroHideTimer.current = setTimeout(() => setShowHero(false), HERO_VISIBLE_MS);
  }

  // Trigger immediately on click of any internal link — this is what
  // makes it feel tied to "you just navigated," not to fetch timing.
  // Must run in the CAPTURE phase: Next.js's Link calls preventDefault()
  // during the bubble phase to do its client-side transition, so a normal
  // bubble-phase listener here would never see the click in time.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      const anchor = (e.target as HTMLElement)?.closest("a");
      if (!anchor) return;
      if (anchor.target && anchor.target !== "_self") return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      let url: URL;
      try {
        url = new URL(href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // A same-pathname, different-query link (e.g. a category filter tab)
      // is still a real navigation the visitor should see feedback for —
      // only a click that changes literally nothing is a no-op.
      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        return;
      }

      startNavigation(classifyDirection(window.location.pathname, url.pathname));
    }

    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  // Real browser back/forward buttons don't fire a click on our page at
  // all — they fire popstate. By the time this listener runs, the URL has
  // already changed but `previousPathname.current` (a ref, not React
  // state) hasn't been updated yet — it's still the page we're leaving.
  useEffect(() => {
    function handlePopstate() {
      startNavigation(classifyDirection(previousPathname.current, window.location.pathname));
    }
    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  // Once the new route has actually committed (pathname changed), resolve
  // the bar — never hold it open longer than needed. The hero overlay is
  // deliberately NOT touched here: it runs on its own fixed timer from
  // startNavigation so it always plays its full animation regardless of
  // how fast the route actually commits underneath it.
  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    if (barTimer.current) clearTimeout(barTimer.current);
    if (!isVisible) return; // resolved within the fast threshold — nothing was ever shown

    setIsCompleting(true);
    const timer = setTimeout(() => {
      setIsVisible(false);
      setIsCompleting(false);
    }, BAR_COMPLETE_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      {LOADER_VARIANT === "drift" ? (
        <CarDriftOverlay key={heroKey} direction={direction} visible={showHero} />
      ) : (
        <WheelSpinOverlay key={heroKey} visible={showHero} />
      )}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE_BRAND }}
            className="fixed top-0 inset-x-0 z-[200] h-[3px] bg-transparent"
          >
            <div
              className={`h-full origin-left bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-black)] shadow-[0_0_10px_rgba(201,24,43,0.6)] ${
                isCompleting ? "" : "animate-route-progress"
              }`}
              style={
                isCompleting
                  ? { transform: "scaleX(1)", transition: `transform 0.2s cubic-bezier(${MOTION_EASE_BRAND.join(",")})` }
                  : undefined
              }
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
