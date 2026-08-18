"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ShoppingCart, Check, Ban } from "lucide-react";
import { type ApiProduct, formatPrice, PRODUCT_IMAGE_BLUR_DATA_URL } from "@/lib/api";
import { useCart } from "@/lib/cart-context";

export function ProductCard({ product }: { product: ApiProduct }) {
  const { addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!product.in_stock) return;
    addItem(product, 1);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1400);
  }

  const hasSecondaryImage = product.images && product.images.length > 1;

  return (
    <Link
      href={`/products/${product.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer block interactive-lift"
    >
      <div className="aspect-square bg-surface border border-hairline-strong mb-4 flex items-center justify-center relative overflow-hidden rounded-xl transition-all duration-300 group-hover:border-red-500/50 group-hover:shadow-[0_12px_32px_rgba(201,24,43,0.12)]">
        {/* Primary Image */}
        <Image
          src={product.images[0]}
          alt={product.title}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          placeholder="blur"
          blurDataURL={PRODUCT_IMAGE_BLUR_DATA_URL}
          className={`object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 pointer-events-none ${
            hasSecondaryImage && isHovered ? "opacity-0 scale-100" : "opacity-100"
          }`}
        />

        {/* Secondary Image Crossfade on Hover (if available) */}
        {hasSecondaryImage && (
          <Image
            src={product.images[1]}
            alt={`${product.title} alternate view`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
            className={`object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 pointer-events-none ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        )}

        {/* Hover Action Pill Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-black)] px-3 py-1 rounded-md shadow-md backdrop-blur-xs transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
            View Details
          </span>
        </div>

        {/* Quick add-to-cart Tactile Button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleQuickAdd}
          disabled={!product.in_stock}
          aria-label={
            product.in_stock
              ? `Add ${product.title} to cart`
              : `${product.title} is out of stock`
          }
          className="absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white hover:bg-gradient-to-r hover:from-[var(--brand-red)] hover:to-[var(--brand-black)] hover:border-red-500 shadow-md transition-colors z-20 pointer-events-auto disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {!product.in_stock ? (
            <Ban className="w-4 h-4 text-slate-400" />
          ) : justAdded ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Check className="w-4 h-4 text-emerald-400" />
            </motion.div>
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
        </motion.button>

        {!product.in_stock && (
          <span className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-white/20 text-[10px] font-bold text-slate-300 uppercase tracking-widest px-2.5 py-1 rounded-md z-10">
            Out of Stock
          </span>
        )}
      </div>

      <div className="space-y-1">
        <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
          {product.category.name}
        </div>
        <h3 className="text-sm font-bold text-ink group-hover:text-red-400 transition-colors line-clamp-1">
          {product.title}
        </h3>
        <div className="text-sm font-bold text-ink-muted">
          {formatPrice(product.price)}
        </div>
      </div>
    </Link>
  );
}
