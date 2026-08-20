"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "revvmotiv-theme";

export function ThemeToggle() {
  // Starts null (renders nothing) until mount: the real theme was already
  // applied to <html> synchronously by the blocking script in layout.tsx,
  // but React doesn't know that yet on first render — reading it here
  // before mount would either mismatch SSR or require unsafe DOM access
  // during render.
  const [isLight, setIsLight] = useState<boolean | null>(null);

  useEffect(() => {
    setIsLight(document.documentElement.getAttribute("data-theme") === "light");
  }, []);

  function toggle() {
    const next = !isLight;
    setIsLight(next);
    if (next) {
      document.documentElement.setAttribute("data-theme", "light");
      localStorage.setItem(STORAGE_KEY, "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(STORAGE_KEY, "dark");
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label={isLight ? "Switch to dark theme" : "Switch to light theme"}
      className="relative text-ink hover:text-[var(--brand-red)] transition-colors w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg hover:bg-hover active:scale-95 cursor-pointer"
    >
      {isLight === null ? null : isLight ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}
