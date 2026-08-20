"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ApiProduct } from "@/lib/api";
import { ProductCard } from "@/app/components/ProductCard";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

export function FeaturedProducts({
  products: initialProducts = [],
}: {
  products?: ApiProduct[];
}) {
  const [products, setProducts] = useState<ApiProduct[]>(initialProducts || []);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (initialProducts && initialProducts.length > 0) {
      setProducts(initialProducts);
      return;
    }

    fetch("/api/v1/products?per_page=12")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((json) => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setProducts(json.data);
        }
      })
      .catch(() => {});
  }, [initialProducts]);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollState, { passive: true });
      window.addEventListener("resize", updateScrollState);
      return () => {
        el.removeEventListener("scroll", updateScrollState);
        window.removeEventListener("resize", updateScrollState);
      };
    }
  }, [products]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.clientWidth < 640 ? el.clientWidth * 0.76 : el.clientWidth * 0.5;
    const scrollAmount = direction === "left" ? -cardWidth : cardWidth;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (!products || products.length === 0) return null;

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

        <div className="flex items-center gap-4">
          <Link
            href="/shop"
            className="text-xs font-bold text-ink uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors border-b border-[var(--brand-red)] pb-1 whitespace-nowrap hidden sm:inline-block"
          >
            View Catalog →
          </Link>

          {products.length > 4 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollByAmount("left")}
                disabled={!canScrollLeft}
                aria-label="Previous products"
                className="w-9 h-9 rounded-lg border border-hairline bg-surface hover:bg-hover hover:border-red-500 disabled:opacity-30 text-ink transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollByAmount("right")}
                disabled={!canScrollRight}
                aria-label="Next products"
                className="w-9 h-9 rounded-lg border border-hairline bg-surface hover:bg-hover hover:border-red-500 disabled:opacity-30 text-ink transition-all flex items-center justify-center cursor-pointer disabled:cursor-not-allowed shadow-xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Responsive Carousel Track: Seamless for 4, 8, 12+ items */}
      <div
        ref={scrollRef}
        data-lenis-prevent
        className="flex overflow-x-auto pb-4 pt-1 gap-4 sm:gap-6 snap-x snap-mandatory hide-scrollbar touch-pan-y touch-pan-x overscroll-x-contain -mx-4 px-4 sm:mx-0 sm:px-0"
      >
        {products.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: MOTION_DURATION.base,
              delay: Math.min(i * 0.06, 0.4),
              ease: MOTION_EASE_BRAND,
            }}
            className="flex-none snap-start w-[76vw] max-w-[280px] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)]"
          >
            <ProductCard product={item} />
          </motion.div>
        ))}
      </div>

      <div className="mt-4 sm:hidden flex justify-end">
        <Link
          href="/shop"
          className="text-xs font-bold text-ink uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors border-b border-[var(--brand-red)] pb-1"
        >
          View Catalog →
        </Link>
      </div>
    </section>
  );
}
