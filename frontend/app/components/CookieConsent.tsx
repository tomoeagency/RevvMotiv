"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { Cookie } from "lucide-react";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

const CONSENT_KEY = "revvmotiv-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(CONSENT_KEY) === null) {
      setVisible(true);
    }
  }, []);

  function respond(choice: "accepted" | "declined") {
    localStorage.setItem(CONSENT_KEY, choice);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: MOTION_DURATION.page, ease: MOTION_EASE_BRAND }}
          className="fixed bottom-0 inset-x-0 z-[60] border-t border-hairline-strong bg-canvas/95 backdrop-blur-md"
        >
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-2.5 sm:py-3 flex items-center gap-3">
            <Cookie className="w-4 h-4 text-[var(--brand-red)] flex-none hidden sm:block" />
            <p className="flex-1 text-[11px] sm:text-xs text-ink-muted leading-snug">
              We use cookies for your cart and a better experience.{" "}
              <Link
                href="/policies/privacy-policy"
                className="text-ink font-semibold hover:text-[var(--brand-red)] transition-colors underline underline-offset-2"
              >
                Privacy Policy
              </Link>
            </p>
            <div className="flex-none flex items-center gap-2">
              <button
                onClick={() => respond("declined")}
                className="px-3 sm:px-4 py-1.5 border border-hairline-strong text-ink text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] transition-colors"
              >
                Decline
              </button>
              <button
                onClick={() => respond("accepted")}
                className="px-3 sm:px-4 py-1.5 brand-gradient-flow text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded shadow-[var(--cta-glow-rest)] hover:shadow-[var(--cta-glow-hover)] transition-[background-position,box-shadow] duration-500"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
