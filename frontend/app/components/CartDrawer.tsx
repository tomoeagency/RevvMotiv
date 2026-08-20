"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, X } from "lucide-react";
import { formatPrice } from "@/lib/api";
import { useCart, MAX_CART_QUANTITY } from "@/lib/cart-context";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";
import { useLenis } from "@/app/components/SmoothScrollProvider";

export function CartDrawer() {
  const {
    items,
    subtotal,
    isDrawerOpen,
    closeDrawer,
    closeDrawerForNavigation,
    updateQuantity,
    removeItem,
  } = useCart();

  const lenis = useLenis();

  // Pause Lenis smooth scroll while drawer is open, resume when it closes.
  // Using lenis.stop()/start() instead of body.overflow so the Lenis RAF
  // loop stays intact and scroll resumes cleanly without getting stuck.
  useEffect(() => {
    if (isDrawerOpen) {
      lenis.stop();
    } else {
      lenis.start();
    }

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") closeDrawer();
    }

    if (isDrawerOpen) {
      document.addEventListener("keydown", handleKeydown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isDrawerOpen, closeDrawer, lenis]);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
            className="fixed inset-0 bg-canvas/80 backdrop-blur-md z-[55]"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
            className="fixed inset-y-0 right-0 z-[60] w-full sm:w-[420px] bg-canvas border-l border-hairline shadow-[0_0_60px_rgba(0,0,0,0.8)] flex flex-col"
          >
            <div className="flex items-center justify-between px-5 sm:px-6 h-16 sm:h-20 border-b border-hairline">
              <span className="text-base sm:text-lg font-bold text-ink uppercase tracking-tight">
                Your Cart
              </span>
              <button
                onClick={closeDrawer}
                aria-label="Close cart"
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-ink-muted hover:text-ink hover:bg-hover rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
                <p className="text-sm text-ink-muted">Your cart is empty.</p>
                <p className="text-xs text-ink-subtle max-w-xs">Explore our catalog to find custom styling parts for your car.</p>
                <Link
                  href="/shop"
                  onClick={closeDrawerForNavigation}
                  className="text-xs font-bold text-ink uppercase tracking-widest hover:text-red-400 transition-colors border-b border-red-500 pb-1"
                >
                  Browse Catalog
                </Link>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 sm:py-6 flex flex-col gap-5 sm:gap-6">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.variantId || 'default'}`} className="flex gap-3.5 sm:gap-4">
                      <div className="relative w-20 h-20 flex-none bg-surface border border-hairline rounded-lg overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-cover object-center"
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="text-xs sm:text-sm font-bold text-ink leading-tight truncate">
                              {item.title}
                            </h3>
                            {item.variantName && (
                              <span className="inline-block px-1.5 py-0.5 mt-1 rounded bg-red-500/10 border border-red-500/20 text-[10px] font-bold text-red-500 uppercase tracking-wider">
                                {item.variantName}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.productId, item.variantId)}
                            aria-label={`Remove ${item.title}`}
                            className="p-1.5 -mr-1 text-ink-subtle hover:text-red-400 hover:bg-hover rounded-lg transition-colors flex-none cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-hairline-strong rounded-lg overflow-hidden bg-surface">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity - 1, item.variantId)
                              }
                              aria-label="Decrease quantity"
                              className="w-8 h-8 flex items-center justify-center text-ink hover:bg-hover transition-colors cursor-pointer"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-8 text-center text-xs font-bold text-ink font-mono">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.quantity + 1, item.variantId)
                              }
                              disabled={item.quantity >= MAX_CART_QUANTITY}
                              aria-label="Increase quantity"
                              className="w-8 h-8 flex items-center justify-center text-ink hover:bg-hover transition-colors disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent cursor-pointer"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <span className="text-xs sm:text-sm font-bold text-ink-muted">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-hairline p-5 sm:p-6 pb-8 sm:pb-6 flex flex-col gap-4 bg-surface/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-ink-muted uppercase tracking-widest text-xs font-bold">
                      Subtotal
                    </span>
                    <span className="text-ink font-bold text-lg">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <PrimaryCtaLink
                    href="/checkout"
                    onClick={closeDrawerForNavigation}
                    className="w-full px-12 py-4 text-sm text-center"
                  >
                    Checkout
                  </PrimaryCtaLink>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
