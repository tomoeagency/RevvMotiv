"use client";

import { forwardRef } from "react";
import Link from "next/link";
import { motion, type HTMLMotionProps } from "motion/react";

// Shared visual + interaction treatment for every primary (brand gradient)
// CTA across the site — the red→black gradient plus a hover-intensified
// glow and a slight lift, standardized here so no individual button can
// drift from it again. Callers own their own layout classes (padding,
// width, flex, gap, text size); this owns color/gradient/glow/transition/
// hover-scale only.
const CTA_BASE =
  "bg-gradient-to-r from-[var(--brand-red)] via-[var(--brand-black)] to-[var(--brand-red)] bg-[length:200%_100%] bg-[position:0%_0%] " +
  "text-white font-bold uppercase tracking-widest " +
  "shadow-[var(--cta-glow-rest)] transition-[background-position,box-shadow,filter] duration-500 ease-[var(--ease-brand)] " +
  "hover:bg-[position:100%_0%] hover:shadow-[var(--cta-glow-hover)] hover:brightness-110 " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const CTA_HOVER = { scale: 1.03 };
const CTA_TAP = { scale: 0.97 };

export const PrimaryCtaButton = forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button">
>(function PrimaryCtaButton({ className = "", disabled, ...props }, ref) {
  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      whileHover={disabled ? undefined : CTA_HOVER}
      whileTap={disabled ? undefined : CTA_TAP}
      className={`${CTA_BASE} ${className}`}
      {...props}
    />
  );
});

const MotionLink = motion.create(Link);

export const PrimaryCtaLink = forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<typeof MotionLink>
>(function PrimaryCtaLink({ className = "", ...props }, ref) {
  return (
    <MotionLink
      ref={ref}
      whileHover={CTA_HOVER}
      whileTap={CTA_TAP}
      className={`${CTA_BASE} ${className}`}
      {...props}
    />
  );
});
