"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Ban } from "lucide-react";
import { type ApiProduct, formatPrice, PRODUCT_IMAGE_BLUR_DATA_URL } from "@/lib/api";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: ApiProduct }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.in_stock) return;
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group cursor-pointer shimmer-card block"
    >
      <div className="aspect-square bg-surface border border-hairline-strong mb-4 flex items-center justify-center relative overflow-hidden rounded">
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={PRODUCT_IMAGE_BLUR_DATA_URL}
          className="object-cover object-center group-hover:scale-105 transition-all duration-700"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <div className="w-full flex justify-between items-center">
            <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-black)] px-2.5 py-1 rounded shadow">
              View Details
            </span>
          </div>
        </div>

        {/* Quick add-to-cart */}
        <button
          onClick={handleQuickAdd}
          disabled={!product.in_stock}
          aria-label={
            product.in_stock
              ? `Add ${product.title} to cart`
              : `${product.title} is out of stock`
          }
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/70 backdrop-blur-sm border border-white/20 text-white hover:bg-gradient-to-r hover:from-[var(--brand-red)] hover:to-[var(--brand-black)] hover:border-red-500 transition-all z-10 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-black/70 disabled:hover:border-white/20"
        >
          {!product.in_stock ? (
            <Ban className="w-4 h-4" />
          ) : justAdded ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
        </button>

        {!product.in_stock && (
          <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm border border-white/20 text-[10px] font-bold text-gray-300 uppercase tracking-widest px-2 py-1 rounded z-10">
            Out of Stock
          </span>
        )}

        {/* Red border glow on hover */}
        <div className="absolute inset-0 border border-red-500/0 group-hover:border-red-500/40 transition-all duration-500 rounded" />
      </div>
      <div>
        <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">
          {product.category.name}
        </div>
        <h3 className="text-sm font-bold text-ink mb-2 group-hover:text-red-400 transition-colors">
          {product.title}
        </h3>
        <div className="text-sm font-bold text-ink-muted">
          {formatPrice(product.price)}
        </div>
      </div>
    </Link>
  );
}
