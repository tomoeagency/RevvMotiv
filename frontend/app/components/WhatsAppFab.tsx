"use client";

import { motion } from "motion/react";
import { useFooterVisibility } from "@/lib/use-footer-avoidance";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";
import { WhatsAppIcon } from "@/app/components/WhatsAppIcon";

const PREFILLED_MESSAGE =
  "Hi RevvMotiv, I'm looking for styling & aero parts for my car. Can you assist me?";

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
      className="fixed right-6 bottom-[88px] z-40 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-[0_0_30px_rgba(37,211,102,0.4)]"
    >
      <WhatsAppIcon className="w-7 h-7" />
    </motion.a>
  );
}
