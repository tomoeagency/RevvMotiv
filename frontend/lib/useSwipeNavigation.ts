"use client";

import { useRef } from "react";

// Shared touch-gesture handling for the Reels and Gallery lightboxes —
// horizontal swipe for next/previous, swipe-down to close (the common
// "dismiss a full-screen modal" gesture on mobile).
export function useSwipeNavigation({
  onSwipeLeft,
  onSwipeRight,
  onSwipeDown,
  threshold = 50,
}: {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
}) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  function onTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  }

  function onTouchEnd(e: React.TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;

    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx <= -threshold) onSwipeLeft?.();
      else if (dx >= threshold) onSwipeRight?.();
    } else if (dy >= threshold) {
      onSwipeDown?.();
    }
  }

  return { onTouchStart, onTouchEnd };
}
