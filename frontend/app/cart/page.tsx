"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/api";
import { useCart, MAX_CART_QUANTITY } from "@/lib/cart-context";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <div className="w-full bg-carbon text-ink min-h-screen">
      {/* 1. Hero Banner */}
      <section className="relative border-b border-hairline bg-canvas overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40" />
        <div className="relative max-w-screen-2xl mx-auto px-6 py-16 md:py-20">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
            Order Review
          </span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight">
            Your Shopping Cart
          </h1>
        </div>
      </section>

      {/* 2. Main Cart Content */}
      <section className="max-w-screen-2xl mx-auto px-6 py-16">
        {items.length === 0 ? (
          <div className="max-w-md mx-auto p-12 border border-hairline bg-surface rounded-lg text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-surface-alt border border-hairline flex items-center justify-center mb-6 text-ink-subtle">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight mb-2">
              Your Cart is Empty
            </h2>
            <p className="text-xs text-ink-muted leading-relaxed mb-8">
              Looks like you haven&apos;t added any performance parts or carbon styling items to your build yet.
            </p>
            <Link
              href="/shop"
              className="px-8 py-3.5 brand-gradient-flow text-white font-bold text-xs uppercase tracking-widest rounded shadow-lg shadow-red-500/20"
            >
              Explore Parts Catalog
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_400px] gap-12 items-start">
            {/* Left: Items List */}
            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between pb-4 border-b border-hairline text-xs font-bold uppercase tracking-widest text-ink-muted">
                <span>Items ({items.length})</span>
                <span>Price</span>
              </div>

              {items.map((item) => (
                <div
                  key={item.productId}
                  className="p-6 border border-hairline bg-surface rounded-lg flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
                >
                  <div className="flex gap-5 items-center">
                    <div className="relative w-20 h-20 flex-none bg-carbon border border-hairline rounded overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-ink mb-1">
                        {item.title}
                      </h3>
                      <div className="text-xs text-red-500 font-bold uppercase tracking-widest mb-3">
                        In Stock • 3D Fitment Guaranteed
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        aria-label={`Remove ${item.title}`}
                        className="inline-flex items-center gap-1.5 text-xs text-ink-subtle hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Remove Item</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-8 w-full sm:w-auto border-t sm:border-t-0 border-hairline pt-4 sm:pt-0">
                    <div className="flex items-center border border-hairline-strong rounded">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        aria-label="Decrease quantity"
                        className="w-8 h-8 flex items-center justify-center text-ink hover:bg-hover transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold text-ink">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= MAX_CART_QUANTITY}
                        aria-label="Increase quantity"
                        className="w-8 h-8 flex items-center justify-center text-ink hover:bg-hover transition-colors disabled:opacity-30"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-base font-bold text-ink">
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      {item.quantity > 1 && (
                        <div className="text-[10px] text-ink-muted">
                          {formatPrice(item.price)} each
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4 flex justify-between items-center">
                <Link
                  href="/shop"
                  className="text-xs font-bold text-ink uppercase tracking-widest hover:text-red-400 transition-colors border-b border-red-500 pb-1"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>

            {/* Right: Order Summary Sidebar */}
            <div className="p-8 border border-hairline bg-surface rounded-lg sticky top-28 shadow-xl">
              <h2 className="text-lg font-black uppercase tracking-tight mb-6 pb-4 border-b border-hairline">
                Order Summary
              </h2>

              <div className="flex flex-col gap-4 text-sm mb-6">
                <div className="flex justify-between text-ink-muted">
                  <span>Subtotal</span>
                  <span className="text-ink font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>Express Shipping</span>
                  <span className="text-green-400 font-bold uppercase text-xs">FREE</span>
                </div>
                <div className="flex justify-between text-ink-muted">
                  <span>3D Laser Fitment Check</span>
                  <span className="text-green-400 font-bold uppercase text-xs">INCLUDED</span>
                </div>
                <div className="border-t border-hairline pt-4 flex justify-between items-baseline">
                  <span className="text-base font-bold text-ink uppercase">Total</span>
                  <span className="text-2xl font-black text-ink">{formatPrice(subtotal)}</span>
                </div>
              </div>

              <PrimaryCtaLink
                href="/checkout"
                className="w-full py-4 text-sm text-center flex items-center justify-center gap-2 rounded mb-6"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </PrimaryCtaLink>

              <div className="space-y-3 pt-6 border-t border-hairline text-xs text-ink-muted">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-red-500 flex-none" />
                  <span>Free Inspected Express Delivery Across India</span>
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-red-500 flex-none" />
                  <span>100% Guaranteed OEM Mounting Alignment</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
