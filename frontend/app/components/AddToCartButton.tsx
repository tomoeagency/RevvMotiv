"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import type { ApiProduct } from "@/lib/api";
import { useCart, MAX_CART_QUANTITY } from "@/lib/cart-context";
import { PrimaryCtaButton } from "@/app/components/PrimaryCtaButton";

export function AddToCartButton({ product }: { product: ApiProduct }) {
  const { addItem, openDrawer } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!product.in_stock) {
    return (
      <button
        disabled
        className="w-full sm:w-auto px-12 py-4 border border-hairline text-ink-subtle text-sm font-bold uppercase tracking-widest cursor-not-allowed rounded-xl"
      >
        Out of Stock
      </button>
    );
  }

  function handleAdd() {
    addItem(product, quantity);
    openDrawer();
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
      <div className="flex items-center border border-hairline-strong rounded-xl overflow-hidden bg-surface w-fit shadow-xs">
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="w-12 h-14 flex items-center justify-center text-ink hover:bg-hover transition-colors cursor-pointer"
        >
          <Minus className="w-4 h-4" />
        </motion.button>

        <div className="w-12 h-14 flex items-center justify-center relative overflow-hidden">
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
          className="w-12 h-14 flex items-center justify-center text-ink hover:bg-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          <Plus className="w-4 h-4" />
        </motion.button>
      </div>

      <PrimaryCtaButton
        onClick={handleAdd}
        className="w-full sm:w-auto px-10 py-4 text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg"
      >
        <ShoppingCart className="w-4 h-4" />
        <span>Add to Cart</span>
      </PrimaryCtaButton>
    </div>
  );
}
