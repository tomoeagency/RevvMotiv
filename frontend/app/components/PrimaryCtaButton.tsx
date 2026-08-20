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
  "group relative overflow-hidden bg-gradient-to-r from-red-600 via-red-700 to-red-900 " +
  "hover:from-red-500 hover:via-red-600 hover:to-red-800 " +
  "text-white font-bold uppercase tracking-widest rounded " +
  "shadow-lg shadow-red-600/30 hover:shadow-xl hover:shadow-red-600/50 " +
  "transition-all duration-300 ease-out " +
  "disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none";

const CTA_HOVER = { scale: 1.03 };
const CTA_TAP = { scale: 0.97 };

import type { ReactNode } from "react";

export interface PrimaryCtaButtonProps
  extends Omit<HTMLMotionProps<"button">, "children"> {
  children?: ReactNode;
}

export const PrimaryCtaButton = forwardRef<
  HTMLButtonElement,
  PrimaryCtaButtonProps
>(function PrimaryCtaButton({ className = "", disabled, children, ...props }, ref) {
  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      whileHover={disabled ? undefined : CTA_HOVER}
      whileTap={disabled ? undefined : CTA_TAP}
      className={`${CTA_BASE} ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-full">
        <span className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
      </span>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
});

const MotionLink = motion.create(Link);

export interface PrimaryCtaLinkProps
  extends Omit<React.ComponentProps<typeof MotionLink>, "children"> {
  children?: ReactNode;
}

export const PrimaryCtaLink = forwardRef<
  HTMLAnchorElement,
  PrimaryCtaLinkProps
>(function PrimaryCtaLink({ className = "", children, ...props }, ref) {
  return (
    <MotionLink
      ref={ref}
      whileHover={CTA_HOVER}
      whileTap={CTA_TAP}
      className={`${CTA_BASE} ${className}`}
      {...props}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-out group-hover:translate-x-full">
        <span className="absolute inset-y-0 left-1/2 w-12 -translate-x-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12" />
      </span>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </MotionLink>
  );
});
