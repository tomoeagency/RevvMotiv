"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, ShoppingCart, Zap } from "lucide-react";
import type { ApiProduct, ProductVariant } from "@/lib/api";
import { useCart, MAX_CART_QUANTITY } from "@/lib/cart-context";
import { PrimaryCtaButton } from "@/app/components/PrimaryCtaButton";

export function AddToCartButton({
  product,
  selectedVariant = null,
}: {
  product: ApiProduct;
  selectedVariant?: ProductVariant | null;
}) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const [quantity, setQuantity] = useState(1);

  const isAvailable = selectedVariant
    ? (selectedVariant.in_stock !== false && (selectedVariant.stock ?? 1) > 0)
    : product.in_stock;

  if (!isAvailable) {
    return (
      <button
        disabled
        className="w-full px-12 py-4 border border-hairline text-ink-subtle text-sm font-bold uppercase tracking-widest cursor-not-allowed rounded"
      >
        {selectedVariant ? "Selected Option Out of Stock" : "Out of Stock"}
      </button>
    );
  }

  function handleAdd() {
    addItem(product, quantity, selectedVariant);
    openDrawer();
  }

  function handleBuyNow() {
    addItem(product, quantity, selectedVariant);
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      {/* Top Row: Quantity Selector + Add to Cart */}
      <div className="flex items-center gap-3 w-full">
        {/* Quantity Controls */}
        <div className="flex items-center border border-hairline-strong rounded overflow-hidden bg-surface flex-none shadow-xs">
          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            aria-label="Decrease quantity"
            className="w-11 h-12 flex items-center justify-center text-ink hover:bg-hover transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </motion.button>

          <div className="w-10 h-12 flex items-center justify-center relative overflow-hidden">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={quantity}
                initial={{ y: 12, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -12, opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="text-sm font-bold text-ink font-mono tabular-nums"
              >
                {quantity}
              </motion.span>
            </AnimatePresence>
          </div>

          <motion.button
            whileTap={{ scale: 0.85 }}
            onClick={() =>
              setQuantity((q) => Math.min(MAX_CART_QUANTITY, q + 1))
            }
            disabled={quantity >= MAX_CART_QUANTITY}
            aria-label="Increase quantity"
            className="w-11 h-12 flex items-center justify-center text-ink hover:bg-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Add to Cart Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleAdd}
          className="flex-1 h-12 px-4 border border-hairline-strong hover:border-red-500/60 bg-surface hover:bg-hover text-ink font-bold text-xs uppercase tracking-widest rounded flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <ShoppingCart className="w-4 h-4 text-red-500 flex-none" />
          <span>Add to Cart</span>
        </motion.button>
      </div>

      {/* Bottom Row: Direct Order / Buy Now Button */}
      <PrimaryCtaButton
        type="button"
        onClick={handleBuyNow}
        className="w-full h-13 py-3.5 text-sm font-black flex items-center justify-center gap-2 shadow-md cursor-pointer"
      >
        <Zap className="w-4 h-4 fill-white text-white flex-none" />
        <span>Buy Now — Direct Order</span>
      </PrimaryCtaButton>
    </div>
  );
}
