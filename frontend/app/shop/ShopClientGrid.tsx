"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { LayoutGrid, List, Square } from "lucide-react";
import { ProductCard } from "@/app/components/ProductCard";
import { Pagination } from "@/app/components/Pagination";
import type { ApiProduct } from "@/lib/api";

type LayoutMode = "single" | "grid" | "list";

interface ShopClientGridProps {
  initialProducts: ApiProduct[];
  initialTotal: number;
  initialPage: number;
  initialLastPage: number;
  category?: string;
  search?: string;
}

function ProductCardSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      <div className="aspect-square bg-surface border border-hairline rounded-xl skeleton-box" />
      <div className="space-y-2">
        <div className="h-2.5 w-20 bg-surface-alt rounded skeleton-box" />
        <div className="h-4 w-3/4 bg-surface-alt rounded skeleton-box" />
        <div className="h-3.5 w-1/3 bg-surface-alt rounded skeleton-box" />
      </div>
    </div>
  );
}

export function ShopClientGrid({
  initialProducts,
  initialTotal,
  initialPage,
  initialLastPage,
  category,
  search,
}: ShopClientGridProps) {
  const [products, setProducts] = useState<ApiProduct[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0);
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("grid");

  // Load user view preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("revvmotiv_shop_view") as LayoutMode;
      if (saved === "single" || saved === "grid" || saved === "list") {
        setLayoutMode(saved);
      }
    } catch {}
  }, []);

  const handleLayoutChange = (mode: LayoutMode) => {
    setLayoutMode(mode);
    try {
      localStorage.setItem("revvmotiv_shop_view", mode);
    } catch {}
  };

  const buildHref = (page: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (page > 1) params.set("page", String(page));
    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
  };

  useEffect(() => {
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
      setTotal(initialTotal);
      setCurrentPage(initialPage);
      setLastPage(initialLastPage);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (search) params.set("search", search);
    if (initialPage > 1) params.set("page", String(initialPage));
    params.set("per_page", "12");

    fetch(`/api/v1/products?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        if (json?.data && Array.isArray(json.data)) {
          setProducts(json.data);
          setTotal(json.meta?.total ?? json.data.length);
          setCurrentPage(json.meta?.current_page ?? 1);
          setLastPage(json.meta?.last_page ?? 1);
        }
      })
      .catch((err) => {
        console.error("[Shop Client Fetch Error]", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [initialProducts, initialTotal, initialPage, initialLastPage, category, search]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <ProductCardSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="py-20 text-center border border-hairline bg-surface rounded-2xl p-12 shadow-sm"
      >
        <h3 className="text-xl font-bold uppercase tracking-tight text-ink mb-2">
          No Products Found
        </h3>
        <p className="text-sm text-ink-muted mb-6">
          {search
            ? `Nothing matched "${search}". Try a different search term.`
            : "There are currently no items in this category."}
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-black)] hover:brightness-110 text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md active:scale-95"
        >
          View All Products
        </Link>
      </motion.div>
    );
  }

  // Dynamic layout grid classes depending on selected mobile mode
  const gridClasses =
    layoutMode === "list"
      ? "flex flex-col gap-3 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6"
      : layoutMode === "grid"
      ? "grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
      : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6";

  return (
    <>
      {/* Mobile-Only View Switcher Bar (< md) */}
      <div className="md:hidden flex items-center justify-between mb-4 pb-3 border-b border-hairline">
        <div className="text-[11px] font-bold text-ink-muted uppercase tracking-wider">
          <span>{total} Products</span>
        </div>

        {/* 3 View Mode Toggle Buttons */}
        <div className="flex items-center gap-1 bg-surface border border-hairline p-1 rounded-xl shadow-2xs">
          {/* 1. Large Single Card */}
          <button
            type="button"
            onClick={() => handleLayoutChange("single")}
            aria-label="Single Large Card View"
            title="Single Large Card View"
            className={`min-h-[34px] px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer ${
              layoutMode === "single"
                ? "bg-red-600 text-white shadow-sm font-bold"
                : "text-ink-muted hover:text-ink hover:bg-hover"
            }`}
          >
            <Square className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden xs:inline">Large</span>
          </button>

          {/* 2. Compact Grid (2x2 / 4 items) */}
          <button
            type="button"
            onClick={() => handleLayoutChange("grid")}
            aria-label="4-Grid 2x2 View"
            title="4-Grid 2x2 View"
            className={`min-h-[34px] px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer ${
              layoutMode === "grid"
                ? "bg-red-600 text-white shadow-sm font-bold"
                : "text-ink-muted hover:text-ink hover:bg-hover"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden xs:inline">Grid 4</span>
          </button>

          {/* 3. List Row View */}
          <button
            type="button"
            onClick={() => handleLayoutChange("list")}
            aria-label="List Row View"
            title="List Row View"
            className={`min-h-[34px] px-2.5 py-1.5 rounded-lg text-xs transition-all flex items-center gap-1 cursor-pointer ${
              layoutMode === "list"
                ? "bg-red-600 text-white shadow-sm font-bold"
                : "text-ink-muted hover:text-ink hover:bg-hover"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="text-[10px] hidden xs:inline">List</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <motion.div layout className={gridClasses}>
        <AnimatePresence mode="popLayout">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, delay: Math.min(index * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
            >
              <ProductCard product={product} layoutMode={layoutMode} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <Pagination
        currentPage={currentPage}
        totalPages={lastPage}
        totalItems={total}
        itemsPerPage={12}
        buildHref={buildHref}
      />
    </>
  );
}
