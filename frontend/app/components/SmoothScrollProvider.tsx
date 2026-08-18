"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

interface LenisContextValue {
  stop: () => void;
  start: () => void;
  lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextValue>({
  stop: () => {},
  start: () => {},
  lenis: null,
});

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect user's motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      syncTouch: false, // Let mobile/touch devices use native momentum
    });

    lenisRef.current = lenis;

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    // Auto-update Lenis scroll dimensions whenever page content/images load
    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && document.body) {
      resizeObserver = new ResizeObserver(() => {
        lenis.resize();
      });
      resizeObserver.observe(document.body);
    }

    const handleWindowResize = () => {
      lenis.resize();
    };

    // Prevent RAF desync when tab loses and regains focus
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        lenis.resize();
        lenis.start();
      }
    };

    window.addEventListener("resize", handleWindowResize);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleWindowResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // On route change, re-measure page height and reset scroll
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.resize();
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  const ctx: LenisContextValue = {
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
    lenis: lenisRef.current,
  };

  return (
    <LenisContext.Provider value={ctx}>
      {children}
    </LenisContext.Provider>
  );
}

