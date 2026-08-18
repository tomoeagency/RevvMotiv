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
    <section className="py-24 px-6 max-w-screen-2xl mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: MOTION_DURATION.page, ease: MOTION_EASE_BRAND }}
        className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6"
      >
        <div>
          <h2 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight mb-2">
            Engineered Parts
          </h2>
          <p className="text-sm text-ink-muted font-medium tracking-wide">
            Select upgrades for maximum visual and functional impact.
          </p>
        </div>
        <Link
          href="/shop"
          className="text-xs font-bold text-ink uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors border-b border-[var(--brand-red)] pb-1"
        >
          View Catalog
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: MOTION_DURATION.base, delay: i * 0.1, ease: MOTION_EASE_BRAND }}
          >
            <ProductCard product={item} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
