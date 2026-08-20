"use client";

import { useState, useMemo } from "react";
import { CheckCircle2, ShieldCheck, Truck, Video, XCircle } from "lucide-react";
import type { ApiProduct, ProductVariant } from "@/lib/api";
import { formatPrice } from "@/lib/api";
import { ProductGallery } from "@/app/components/ProductGallery";
import { AddToCartButton } from "@/app/components/AddToCartButton";

export function ProductDetailInteractive({ product }: { product: ApiProduct }) {
  const variants = product.variants ?? [];
  const defaultVariant = useMemo(() => {
    if (!variants.length) return null;
    return variants.find((v) => v.is_default) || variants[0];
  }, [variants]);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(defaultVariant);

  const displayPrice = selectedVariant ? selectedVariant.price : product.price;
  const displayComparePrice = selectedVariant
    ? selectedVariant.compare_at_price
    : product.compare_at_price;

  const isAvailable = selectedVariant
    ? selectedVariant.in_stock !== false && (selectedVariant.stock ?? 1) > 0
    : product.in_stock;

  // Collect all images that belong specifically to OTHER variants
  const otherVariantImages = useMemo(() => {
    return variants
      .filter((v) => v.id !== selectedVariant?.id && Boolean(v.image))
      .map((v) => v.image as string);
  }, [variants, selectedVariant?.id]);

  // Build the active image gallery list:
  // If the selected variant has its own image, show it and exclude images belonging to other variants
  const galleryImages = useMemo(() => {
    if (selectedVariant?.image) {
      const generalImages = (product.images || []).filter(
        (img) => img !== selectedVariant.image && !otherVariantImages.includes(img)
      );
      return [selectedVariant.image, ...generalImages];
    }

    // If no variant-specific image is set on selected variant, show base product images excluding other variant photos
    const baseImages = (product.images || []).filter(
      (img) => !otherVariantImages.includes(img)
    );

    if (baseImages.length > 0) return baseImages;
    if (product.images && product.images.length > 0) return product.images;
    return ["/images/logo.png"];
  }, [product.images, selectedVariant?.image, otherVariantImages]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start">
      <ProductGallery
        key={selectedVariant?.id ?? "default"}
        images={galleryImages}
        title={product.title}
      />

      <div className="flex flex-col justify-center md:sticky md:top-28">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
            {product.category.name}
          </span>
          <span className="text-ink-subtle">·</span>
          {isAvailable ? (
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> In Stock & Ready to Dispatch
            </span>
          ) : (
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <XCircle className="w-3 h-3" /> Currently Out of Stock
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink uppercase tracking-tight mb-3">
          {product.title}
        </h1>

        <div className="flex items-baseline gap-3 mb-1">
          <span className="text-2xl sm:text-3xl font-bold text-ink font-mono">
            {formatPrice(displayPrice)}
          </span>
          {displayComparePrice && displayComparePrice > displayPrice && (
            <span className="text-sm text-ink-subtle line-through">
              {formatPrice(displayComparePrice)}
            </span>
          )}
        </div>

        <p className="text-[11px] text-ink-subtle uppercase tracking-wider mb-5">
          All prices are final — no hidden charges.
        </p>

        {/* Variants Selector */}
        {variants.length > 0 && (
          <div className="mb-6 p-4 rounded-xl border border-hairline bg-surface/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink uppercase tracking-wider">
                Select Option / Finish
              </span>
              {selectedVariant && (
                <span className="text-xs font-medium text-red-400">
                  {selectedVariant.name}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {variants.map((v) => {
                const isSelected = selectedVariant?.id === v.id;
                const inStock = v.in_stock !== false && (v.stock ?? 1) > 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => setSelectedVariant(v)}
                    className={`px-3.5 py-2.5 rounded-lg border text-xs font-bold transition-all text-left flex flex-col gap-0.5 cursor-pointer ${
                      isSelected
                        ? "border-red-500 bg-red-500/10 text-ink ring-1 ring-red-500/40 shadow-sm"
                        : "border-hairline bg-surface hover:border-slate-400 text-ink-muted hover:text-ink"
                    } ${!inStock ? "opacity-60" : ""}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="truncate">{v.name}</span>
                      {!inStock && (
                        <span className="text-[9px] text-rose-400 uppercase font-mono font-bold">(Out)</span>
                      )}
                    </div>
                    <span className="font-mono text-[11px] text-ink-subtle">
                      {formatPrice(v.price)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {product.description && (
          <p className="text-sm text-ink-muted font-medium leading-relaxed mb-6 max-w-md">
            {product.description}
          </p>
        )}

        {/* Structured Machine-Parseable Fitment Data Block (AEO / GEO) */}
        <div className="border border-hairline bg-surface p-4 rounded-xl mb-6 max-w-md text-xs space-y-2 shadow-2xs">
          <div className="flex items-center justify-between border-b border-hairline pb-2">
            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
              Fitment & Vehicle Compatibility
            </span>
            <span className="text-[10px] text-emerald-500 font-bold uppercase">100% Pre-Checked</span>
          </div>
          <div className="font-mono text-xs font-semibold text-ink">
            Fits: {product.category.name} & Compatible Models — Direct OEM Bolt-On
          </div>
          <p className="text-[11px] text-ink-muted leading-relaxed">
            Engineered to align with factory chassis mounting points. Pre-checked by workshop technician before dispatch.
          </p>
        </div>

        {/* Quality & Policy Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-lg border border-hairline bg-surface mb-8 max-w-md text-xs">
          <div className="flex items-center gap-2 text-ink">
            <ShieldCheck className="w-4 h-4 text-red-500 flex-none" />
            <span>100% Fitment Guarantee</span>
          </div>
          <div className="flex items-center gap-2 text-ink">
            <Truck className="w-4 h-4 text-emerald-400 flex-none" />
            <span>Standard Tracked Courier (5–7 Days)</span>
          </div>
          <div className="flex items-center gap-2 text-ink-muted col-span-full pt-1 border-t border-hairline text-[11px]">
            <Video className="w-3.5 h-3.5 text-ink-subtle flex-none" />
            <span>Note: Uninterrupted unboxing video required for damage claims.</span>
          </div>
        </div>

        <AddToCartButton product={product} selectedVariant={selectedVariant} />
      </div>
    </div>
  );
}
