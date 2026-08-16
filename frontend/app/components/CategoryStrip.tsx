"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
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
      className="border-b border-hairline bg-surface-alt"
    >
      <div className="max-w-screen-2xl mx-auto flex flex-col md:flex-row">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
            className="flex-1 border-b md:border-b-0 md:border-r border-hairline last:border-r-0"
          >
            <Link
              href={`/shop?category=${cat.slug}`}
              className="w-full h-full p-6 hover:bg-hover transition-colors group flex items-center justify-between"
            >
              <span className="text-xs font-bold text-ink-muted uppercase tracking-widest group-hover:text-ink transition-colors">
                {cat.name}
              </span>
              <ChevronRight className="w-4 h-4 text-ink-subtle group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
