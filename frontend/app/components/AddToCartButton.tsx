"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
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
        className="w-full sm:w-auto px-12 py-4 border border-hairline text-ink-subtle text-sm font-bold uppercase tracking-widest cursor-not-allowed"
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
      <div className="flex items-center border border-hairline-strong w-fit">
        <button
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          aria-label="Decrease quantity"
          className="w-11 h-14 flex items-center justify-center text-ink hover:bg-hover transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-10 text-center text-sm font-bold text-ink">
          {quantity}
        </span>
        <button
          onClick={() =>
            setQuantity((q) => Math.min(MAX_CART_QUANTITY, q + 1))
          }
          disabled={quantity >= MAX_CART_QUANTITY}
          aria-label="Increase quantity"
          className="w-11 h-14 flex items-center justify-center text-ink hover:bg-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      <PrimaryCtaButton
        onClick={handleAdd}
        className="w-full sm:w-auto px-12 py-4 text-sm"
      >
        Add to Cart
      </PrimaryCtaButton>
    </div>
  );
}
