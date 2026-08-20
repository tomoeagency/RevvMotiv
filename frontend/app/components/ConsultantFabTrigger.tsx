"use client";

import { motion } from "motion/react";
import { Headset } from "lucide-react";
import { useConsultant } from "@/lib/consultant-context";
import { useFooterVisibility } from "@/lib/use-footer-avoidance";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

export function ConsultantFabTrigger() {
  const { open } = useConsultant();
  const visible = useFooterVisibility();

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: visible ? 1 : 0, scale: 1 }}
      transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE_BRAND }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.96 }}
      onClick={open}
      aria-label="Talk to our consultant"
      className="fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full brand-gradient-flow text-white flex items-center justify-center shadow-[0_0_30px_rgba(201,24,43,0.35)] cursor-pointer"
    >
      <Headset className="w-5 h-5 sm:w-6 sm:h-6" />
    </motion.button>
  );
}
