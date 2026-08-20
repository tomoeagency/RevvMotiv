"use client";

import { motion } from "motion/react";
import { useFooterVisibility } from "@/lib/use-footer-avoidance";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";
import { WhatsAppIcon } from "@/app/components/WhatsAppIcon";

const PREFILLED_MESSAGE =
  "Hi RevvMotiv, I'm looking for custom styling & aero parts for my car. Can you assist me with fitment?";

export function WhatsAppFab({ digits }: { digits: string }) {
  const visible = useFooterVisibility();

  return (
    <motion.a
      href={`https://wa.me/${digits}?text=${encodeURIComponent(PREFILLED_MESSAGE)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE_BRAND }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      className="fixed right-4 sm:right-6 bottom-20 sm:bottom-[88px] z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.4)] cursor-pointer"
    >
      <WhatsAppIcon className="w-6 h-6 sm:w-7 sm:h-7" />
    </motion.a>
  );
}
