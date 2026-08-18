"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { ProductCard } from "@/app/components/ProductCard";
import type { ApiProduct } from "@/lib/api";

interface ShopClientGridProps {
  initialProducts: ApiProduct[];
  initialTotal: number;
  initialPage: number;
  initialLastPage: number;
  category?: string;
  search?: string;
  buildHref: (overrides: { category?: string; page?: number }) => string;
}

export function ShopClientGrid({
  initialProducts,
  initialTotal,
  initialPage,
  initialLastPage,
  category,
  search,
  buildHref,
}: ShopClientGridProps) {
  const [products, setProducts] = useState<ApiProduct[]>(initialProducts);
  const [total, setTotal] = useState(initialTotal);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [lastPage, setLastPage] = useState(initialLastPage);
  const [isLoading, setIsLoading] = useState(initialProducts.length === 0);

  useEffect(() => {
    // If server passed products, use them
    if (initialProducts.length > 0) {
      setProducts(initialProducts);
      setTotal(initialTotal);
      setCurrentPage(initialPage);
      setLastPage(initialLastPage);
      setIsLoading(false);
      return;
    }

    // Client-side fallback fetch via /api/v1/products
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
        if (json?.data) {
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
      <div className="py-24 text-center flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-4" />
        <p className="text-xs uppercase font-bold tracking-widest text-ink-muted">
          Loading Precision Aero Catalog...
        </p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center border border-hairline bg-surface rounded-lg p-12">
        <h3 className="text-xl font-bold uppercase tracking-tight text-ink mb-2">
          No Products Found
        </h3>
        <p className="text-sm text-ink-muted mb-6">
          There are currently no items in this category.
        </p>
        <Link
          href="/shop"
          className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-widest rounded transition-colors"
        >
          View All Products
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {lastPage > 1 && (
        <div className="mt-12 pt-8 border-t border-hairline flex items-center justify-between">
          <div className="text-xs font-bold text-ink-muted uppercase tracking-widest">
            Page {currentPage} of {lastPage}
          </div>
          <div className="flex items-center gap-2">
            {currentPage > 1 && (
              <Link
                href={buildHref({ page: currentPage - 1 })}
                className="p-2 border border-hairline bg-surface rounded hover:border-red-500 transition-colors text-ink"
                aria-label="Previous page"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
            )}
            {currentPage < lastPage && (
              <Link
                href={buildHref({ page: currentPage + 1 })}
                className="p-2 border border-hairline bg-surface rounded hover:border-red-500 transition-colors text-ink"
                aria-label="Next page"
              >
                <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
