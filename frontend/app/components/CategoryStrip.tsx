"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import type { Category } from "@/lib/api";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

export function CategoryStrip({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
      className="border-b border-hairline bg-surface-alt relative z-20"
    >
      {/* Mobile: Sleek Touch-Swipeable Category Chips Bar */}
      <div className="md:hidden py-3 px-4 overflow-x-auto hide-scrollbar flex items-center gap-2 snap-x snap-mandatory scroll-smooth touch-pan-x" data-lenis-prevent>
        <div className="flex-none flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-600/10 border border-red-500/20 text-[10px] font-black text-red-500 uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          <span>Categories</span>
        </div>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="flex-none snap-start px-3.5 py-1.5 rounded-lg bg-surface border border-hairline text-ink-muted hover:text-ink hover:border-red-500 text-[11px] font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-2xs active:scale-95"
          >
            <span>{cat.name}</span>
            <ChevronRight className="w-3 h-3 text-ink-subtle" />
          </Link>
        ))}
      </div>

      {/* Desktop: Elegant Grid / Row Layout */}
      <div className="hidden md:flex max-w-screen-2xl mx-auto divide-x divide-hairline">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04, duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
            className="flex-1"
          >
            <Link
              href={`/shop?category=${cat.slug}`}
              className="w-full h-full p-4 lg:p-5 hover:bg-hover transition-colors group flex items-center justify-between"
            >
              <span className="text-[11px] lg:text-xs font-bold text-ink-muted uppercase tracking-widest group-hover:text-ink transition-colors line-clamp-1">
                {cat.name}
              </span>
              <ChevronRight className="w-3.5 h-3.5 text-ink-subtle group-hover:text-red-500 group-hover:translate-x-0.5 transition-all flex-none ml-1" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

