"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";

// 8 tiny offsets around a ring, used to fake a thin outline on the gif (see
// below — a raster image has no path to stroke).
const OUTLINE_OFFSETS: Array<[number, number]> = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [0.7, 0.7],
  [-0.7, 0.7],
  [0.7, -0.7],
  [-0.7, -0.7],
];

// Quick side-by-side alternative to CarDriftOverlay for comparison —
// same backdrop treatment, just a spinning wheel instead of the drift
// animation. Swap which one RouteLoader renders via LOADER_VARIANT there;
// this file doesn't touch or replace CarDriftOverlay.tsx.
export function WheelSpinOverlay({ visible }: { visible: boolean }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  if (reducedMotion) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[190] flex items-center justify-center bg-canvas/90 backdrop-blur-sm pointer-events-none"
      aria-hidden="true"
    >
      {visible && (
        // The gif's own transparent canvas has a hard rectangular edge
        // (1-bit GIF transparency, no soft alpha) right where the wheel and
        // smoke pixels end — masking that same box directly always eats
        // into real content on whichever side sits closest to the edge
        // (the wheel top/bottom, the smoke on the left). So the mask lives
        // on a WRAPPER sized ~23% larger than the image, with the image
        // centered inside it — the feather band then falls entirely within
        // that empty margin and never touches a wheel or smoke pixel.
        <div
          className="relative w-64 sm:w-80 aspect-[3/2] flex items-center justify-center"
          style={{
            WebkitMaskImage: "radial-gradient(ellipse closest-side, #000 84%, transparent 100%)",
            maskImage: "radial-gradient(ellipse closest-side, #000 84%, transparent 100%)",
          }}
        >
          {/* A raster gif has no path to stroke. Chaining CSS drop-shadow()
              calls doesn't work for this either — each one shadows the
              CUMULATIVE output of the ones before it, not the original
              image, so 8 stacked "thin" shadows compound into one huge
              blob instead of a thin ring (tried, looked broken). Instead:
              8 solid-color copies of the same gif, used as a mask-image on
              plain colored divs (so each is a flat silhouette, not the
              actual art), each nudged ~1px in a different direction and
              stacked behind the real image — a real outline, not a filter
              hack. Needed because the tire's black rubber silhouette sits
              close enough to the dark-theme canvas color that its own edge
              nearly disappears without one; --raster-outline flips to a
              dark tone in light theme so it reads as a clean edge there
              too instead of a stray white fringe. */}
          <div className="relative w-52 sm:w-64 aspect-[3/2]">
            {OUTLINE_OFFSETS.map(([dx, dy], i) => (
              <div
                key={i}
                className="absolute inset-0"
                style={{
                  backgroundColor: "var(--raster-outline)",
                  WebkitMaskImage: "url(/wheel-spin.gif)",
                  maskImage: "url(/wheel-spin.gif)",
                  WebkitMaskSize: "contain",
                  maskSize: "contain",
                  WebkitMaskRepeat: "no-repeat",
                  maskRepeat: "no-repeat",
                  WebkitMaskPosition: "center",
                  maskPosition: "center",
                  transform: `translate(${dx}px, ${dy}px)`,
                }}
              />
            ))}
            <img
              src="/wheel-spin.gif"
              alt=""
              className="relative w-full h-full object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.55)]"
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}
