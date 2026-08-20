"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import type { ApiProduct } from "@/lib/api";
import { ProductCard } from "@/app/components/ProductCard";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

export function FeaturedProducts({ products: initialProducts = [] }: { products?: ApiProduct[] }) {
  const [products, setProducts] = useState<ApiProduct[]>(initialProducts || []);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      return;
    }

    fetch("/api/v1/products?per_page=4")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data.slice(0, 4));
        }
      })
      .catch(() => {});
  }, [initialProducts]);

  return (
    <section className="py-12 sm:py-20 md:py-24 px-4 sm:px-6 max-w-screen-2xl mx-auto w-full overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: MOTION_DURATION.page, ease: MOTION_EASE_BRAND }}
        className="flex flex-row items-end justify-between mb-8 sm:mb-12 gap-4"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink uppercase tracking-tight mb-1 sm:mb-2">
            Customised Parts
          </h2>
          <p className="text-xs sm:text-sm text-ink-muted font-medium tracking-wide">
            Select upgrades for maximum visual and functional impact.
          </p>
        </div>
        <Link
          href="/shop"
          className="text-xs font-bold text-ink uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors border-b border-[var(--brand-red)] pb-1 whitespace-nowrap"
        >
          View Catalog →
        </Link>
      </motion.div>

      {/* Horizontal Swipe on Mobile / Grid on Desktop */}
      <div data-lenis-prevent className="flex overflow-x-auto pb-4 pt-1 gap-4 snap-x snap-mandatory hide-scrollbar touch-pan-x overscroll-x-contain sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 -mx-4 px-4 sm:mx-0 sm:px-0">
        {products.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: MOTION_DURATION.base, delay: i * 0.08, ease: MOTION_EASE_BRAND }}
            className="flex-none w-[76vw] max-w-[280px] sm:w-auto snap-start"
          >
            <ProductCard product={item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
