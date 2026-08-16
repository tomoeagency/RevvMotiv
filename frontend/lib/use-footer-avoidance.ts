"use client";

import { useEffect, useState } from "react";

// Shared by any fixed-position element anchored to the viewport corner (the
// consultant FAB, the WhatsApp button). Earlier version kept the FAB
// visible by continuously lifting it as the footer scrolled up underneath
// — that reads as the button jittering up and down while scrolling through
// a tall footer. Instead: stay pinned at the resting corner position the
// entire time, and simply fade out once the footer starts entering view —
// real equivalent buttons live inside the footer itself for that case (see
// Footer.tsx). Hysteresis (different show/hide thresholds) avoids flicker
// right at the boundary.
export function useFooterVisibility() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    let ticking = false;

    function measure() {
      ticking = false;
      const footer = document.querySelector("footer");
      if (!footer) return;
      const overlap = window.innerHeight - footer.getBoundingClientRect().top;
      setVisible((prev) => {
        if (prev && overlap > 48) return false;
        if (!prev && overlap < 8) return true;
        return prev;
      });
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return visible;
}
