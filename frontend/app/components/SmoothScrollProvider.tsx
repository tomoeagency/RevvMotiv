"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import Lenis from "lenis";

interface LenisContextValue {
  stop: () => void;
  start: () => void;
}

const LenisContext = createContext<LenisContextValue>({
  stop: () => {},
  start: () => {},
});

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect user's motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    let animationFrameId: number;

    function raf(time: number) {
      lenis.raf(time);
      animationFrameId = requestAnimationFrame(raf);
    }

    animationFrameId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(animationFrameId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const ctx: LenisContextValue = {
    stop: () => lenisRef.current?.stop(),
    start: () => lenisRef.current?.start(),
  };

  return (
    <LenisContext.Provider value={ctx}>
      {children}
    </LenisContext.Provider>
  );
}
