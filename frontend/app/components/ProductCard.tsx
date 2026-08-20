"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { ShoppingCart, Check, Ban, Star } from "lucide-react";
import { type ApiProduct, formatPrice, PRODUCT_IMAGE_BLUR_DATA_URL } from "@/lib/api";
import { useCart } from "@/lib/cart-context";

export function ProductCard({
  product,
  layoutMode = "single",
}: {
  product: ApiProduct;
  layoutMode?: "single" | "grid" | "list";
}) {
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
  const primaryImage = product.images?.[0] || "/images/logo.png";
  const secondaryImage = hasSecondaryImage ? product.images[1] : primaryImage;

  // 1. LIST VIEW (Horizontal Row)
  if (layoutMode === "list") {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group cursor-pointer flex items-center justify-between gap-3 p-3 bg-surface border border-hairline rounded-xl hover:border-red-500/50 hover:shadow-lg transition-all"
      >
        {/* Left: Thumbnail Image */}
        <div className="relative w-20 h-20 flex-none rounded-lg overflow-hidden bg-black border border-hairline">
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="80px"
            placeholder="blur"
            blurDataURL={PRODUCT_IMAGE_BLUR_DATA_URL}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />
          {!product.in_stock && (
            <span className="absolute inset-0 bg-black/75 flex items-center justify-center text-[8px] font-black text-slate-300 uppercase tracking-tighter">
              Sold Out
            </span>
          )}
        </div>

        {/* Center: Details */}
        <div className="flex-1 min-w-0 pr-2">
          <div className="text-[9px] font-bold text-red-500 uppercase tracking-widest truncate mb-0.5">
            {product.category.name}
          </div>
          <h3 className="text-xs font-bold text-ink group-hover:text-red-400 transition-colors line-clamp-2 leading-snug mb-1">
            {product.title}
          </h3>
          <div className="text-xs font-black text-ink">
            {formatPrice(product.price)}
          </div>
        </div>

        {/* Right: Quick Add Button */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleQuickAdd}
          disabled={!product.in_stock}
          aria-label={
            product.in_stock
              ? `Add ${product.title} to cart`
              : `${product.title} is out of stock`
          }
          className="flex-none h-9 px-3 rounded-lg bg-surface-alt border border-hairline hover:border-red-500 hover:bg-red-600 hover:text-white text-ink transition-all flex items-center justify-center gap-1.5 text-xs font-bold disabled:opacity-50"
        >
          {!product.in_stock ? (
            <Ban className="w-3.5 h-3.5 text-slate-400" />
          ) : justAdded ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <Check className="w-3.5 h-3.5" />
              <span className="text-[10px]">Added</span>
            </span>
          ) : (
            <span className="flex items-center gap-1 text-red-500 group-hover:text-white">
              <ShoppingCart className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">Add</span>
            </span>
          )}
        </motion.button>
      </Link>
    );
  }

  // 2. GRID VIEW (Compact 2x2 on Mobile)
  if (layoutMode === "grid") {
    return (
      <Link
        href={`/products/${product.slug}`}
        className="group cursor-pointer block p-2 sm:p-2.5 bg-surface border border-hairline rounded-xl hover:border-red-500/50 hover:shadow-lg transition-all"
      >
        <div className="aspect-square bg-black border border-hairline mb-2 flex items-center justify-center relative overflow-hidden rounded-lg">
          <Image
            src={primaryImage}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 45vw, 25vw"
            placeholder="blur"
            blurDataURL={PRODUCT_IMAGE_BLUR_DATA_URL}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
          />

          {/* Compact Quick Add Button */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={handleQuickAdd}
            disabled={!product.in_stock}
            aria-label={product.in_stock ? `Add to cart` : `Out of stock`}
            className="absolute top-2 right-2 w-8 h-8 sm:w-8.5 sm:h-8.5 flex items-center justify-center rounded-full bg-black/80 backdrop-blur border border-white/20 text-white hover:bg-red-600 shadow-md transition-colors z-20 disabled:opacity-50 cursor-pointer"
          >
            {!product.in_stock ? (
              <Ban className="w-3.5 h-3.5 text-slate-400" />
            ) : justAdded ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" />
            )}
          </motion.button>

          {!product.in_stock && (
            <span className="absolute top-2 left-2 bg-black/80 backdrop-blur text-[8px] font-black text-slate-300 uppercase tracking-tight px-1.5 py-0.5 rounded">
              Out of Stock
            </span>
          )}
        </div>

        <div className="space-y-0.5">
          <div className="text-[9px] font-bold text-red-500 uppercase tracking-widest truncate">
            {product.category.name}
          </div>
          <h3 className="text-xs font-bold text-ink group-hover:text-red-400 transition-colors line-clamp-1 leading-snug">
            {product.title}
          </h3>
          <div className="text-xs font-black text-ink">
            {formatPrice(product.price)}
          </div>
        </div>
      </Link>
    );
  }

  // 3. STANDARD SINGLE LARGE CARD (Default View)
  return (
    <Link
      href={`/products/${product.slug}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group cursor-pointer block"
    >
      <div className="aspect-square bg-surface border border-hairline-strong mb-4 flex items-center justify-center relative overflow-hidden rounded-xl transition-all duration-300 group-hover:border-red-500/50 group-hover:shadow-[0_12px_32px_rgba(201,24,43,0.12)]">
        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={product.title}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 360px"
          placeholder="blur"
          blurDataURL={PRODUCT_IMAGE_BLUR_DATA_URL}
          className={`object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 pointer-events-none ${
            hasSecondaryImage && isHovered ? "opacity-0 scale-100" : "opacity-100"
          }`}
        />

        {/* Secondary Image Crossfade on Hover (if available) */}
        {hasSecondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.title} alternate view`}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 360px"
            className={`object-cover object-center transition-all duration-500 ease-out group-hover:scale-105 pointer-events-none ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        )}

        {/* Hover Action Pill Overlay */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3.5 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none">
          <span className="text-[10px] font-bold text-white uppercase tracking-widest bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-black)] px-3 py-1 rounded-md shadow-md backdrop-blur-xs">
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
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest truncate">
            {product.category.name}
          </span>
          {product.average_rating ? (
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-bold flex-none">
              <Star className="w-3 h-3 fill-amber-400" />
              <span className="text-ink font-mono text-xs">{Number(product.average_rating).toFixed(1)}</span>
            </div>
          ) : null}
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
