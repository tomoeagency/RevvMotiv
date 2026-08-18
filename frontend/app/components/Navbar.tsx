"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, ChevronDown, Search } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { getCategories, type Category } from "@/lib/api";
import { ThemeToggle } from "@/app/components/ThemeToggle";
import { LogoMark } from "@/app/components/LogoMark";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

// Site-page nav links, both desktop and mobile — kept as data so the
// active-route check (usePathname, not useSearchParams — that needs a
// Suspense boundary and would opt every static page out of prerendering)
// stays in one place instead of duplicated per link.
import { FALLBACK_CATEGORIES } from "@/lib/constants";

const PAGE_LINKS = [
  { href: "/work", label: "Our Work" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
] as const;

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const { itemCount, openDrawer } = useCart();
  const pathname = usePathname();
  const [categories, setCategories] = useState<Category[]>([...FALLBACK_CATEGORIES]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isMobileShopOpen, setIsMobileShopOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Add scroll listener for transparent navbar on hero
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/v1/categories")
      .then((res) => res.json())
      .then((json) => {
        if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
          setCategories(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const isShopActive = isActive(pathname, "/shop");

  // A small delay on close (not on open) — moving the cursor from the
  // "Shop" label down into the dropdown panel briefly leaves both, and an
  // instant close there reads as flaky/flickery rather than intentional.
  function openShop() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setIsShopOpen(true);
  }
  function closeShop() {
    closeTimer.current = setTimeout(() => setIsShopOpen(false), 120);
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: MOTION_DURATION.page, ease: MOTION_EASE_BRAND }}
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        isScrolled || pathname !== "/"
          ? "bg-canvas/90 backdrop-blur-md border-b border-hairline"
          : "bg-transparent border-transparent"
      } ${pathname === "/" ? "-mb-20" : ""}`}
    >
      <div className="flex items-center justify-between px-6 h-20 max-w-screen-2xl mx-auto w-full">
        <Link href="/" className="flex items-center flex-none mr-8 lg:mr-12">
          {/* Full wordmark lives in the logo file itself — no adjacent
              text label, that would just repeat the name a second time.
              Inline SVG (not <img src="/logo.webp">) so it inherits
              text-ink and flips color with the theme automatically.
              Explicit right margin (not relying on justify-between's
              leftover space) keeps a fixed gap before the nav links. */}
          <motion.div whileHover={{ scale: 1.05 }}>
            <LogoMark className="h-9 w-auto text-ink" />
          </motion.div>
        </Link>

        {/* "Shop" + the site pages are now one visually consistent group */}
        <div className={`hidden md:flex items-center gap-8 text-xs uppercase font-bold tracking-[0.1em] text-ink transition-all duration-300 ${!isScrolled && pathname === "/" ? "bg-canvas/80 backdrop-blur-xl shadow-lg px-8 py-3 rounded-full" : ""}`}>
          <div
            className="relative"
            onMouseEnter={openShop}
            onMouseLeave={closeShop}
            onFocus={openShop}
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node)) closeShop();
            }}
          >
            <Link
              href="/shop"
              className={`relative group flex items-center gap-1 transition-colors whitespace-nowrap ${
                isShopActive ? "text-[var(--brand-red)]" : "hover:text-[var(--brand-red)]"
              }`}
            >
              Shop
              <ChevronDown
                className={`w-3 h-3 transition-transform duration-[var(--duration-micro)] ${
                  isShopOpen ? "rotate-180" : ""
                }`}
              />
              <span
                className={`absolute -bottom-0.5 left-0 h-px bg-[var(--brand-red)] transition-all duration-300 ${
                  isShopActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </Link>

            <AnimatePresence>
              {isShopOpen && categories.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE_BRAND }}
                  // pt-3 (rather than a plain top margin) keeps this whole
                  // block — including the gap above the visible panel —
                  // inside the parent's hover/focus region, so crossing
                  // from "Shop" down into the menu doesn't register as a
                  // mouseleave and snap it shut.
                  className="absolute left-0 top-full pt-3 w-56"
                >
                  <div className="bg-canvas border border-hairline-strong shadow-[0_20px_40px_rgba(0,0,0,0.5)] py-2">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?category=${cat.slug}`}
                        className="block px-4 py-2 text-xs font-semibold tracking-[0.1em] text-ink-muted uppercase hover:text-ink hover:bg-hover transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {PAGE_LINKS.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={`relative group transition-colors whitespace-nowrap ${
                  active ? "text-[var(--brand-red)]" : "hover:text-[var(--brand-red)]"
                }`}
              >
                {label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-[var(--brand-red)] transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-4 flex-none ml-4">
          <Link
            href="/shop?focus=search"
            aria-label="Search products"
            className="text-ink hover:text-[var(--brand-red)] transition-colors"
          >
            <Search className="w-5 h-5" />
          </Link>
          <ThemeToggle />
          <button
            onClick={openDrawer}
            aria-label={itemCount > 0 ? `${itemCount} ${itemCount === 1 ? "item" : "items"} in cart, open cart` : "Open cart (empty)"}
            className="relative text-ink hover:text-[var(--brand-red)] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-black)] text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            className="md:hidden text-ink"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
            className="md:hidden overflow-hidden bg-canvas border-t border-hairline"
          >
            <div className="flex flex-col px-6 py-4">
              {/* Shop accordion — tapping the label navigates to /shop
                  (same as desktop's click behavior), the chevron is a
                  separate hit target that only expands/collapses the
                  category list, mirroring the desktop hover-menu without
                  requiring a hover state that doesn't exist on touch. */}
              <div className="border-b border-hairline">
                <div className="flex items-center">
                  <Link
                    href="/shop"
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex-1 py-3 text-xs font-bold tracking-[0.1em] uppercase transition-colors ${
                      isShopActive ? "text-[var(--brand-red)]" : "text-ink hover:text-[var(--brand-red)]"
                    }`}
                  >
                    Shop
                  </Link>
                  <button
                    type="button"
                    onClick={() => setIsMobileShopOpen((v) => !v)}
                    aria-label={isMobileShopOpen ? "Collapse categories" : "Expand categories"}
                    aria-expanded={isMobileShopOpen}
                    className="p-3 -mr-3 text-ink-muted hover:text-ink transition-colors"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-[var(--duration-micro)] ${
                        isMobileShopOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                </div>
                <AnimatePresence>
                  {isMobileShopOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
                      className="overflow-hidden"
                    >
                      <div className="pb-2 pl-3 flex flex-col">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/shop?category=${cat.slug}`}
                            onClick={() => setIsMenuOpen(false)}
                            className="py-2 text-xs font-semibold tracking-[0.1em] text-ink-muted uppercase hover:text-ink transition-colors"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Site pages, grouped apart from Shop above by their own
                  header + border, same distinction the desktop nav draws
                  with its divider + bold ink weight. */}
              <div className="pt-4 mt-1 border-t border-hairline">
                <span className="block pb-2 text-[10px] font-bold text-ink-subtle uppercase tracking-widest">
                  Pages
                </span>
                {PAGE_LINKS.map(({ href, label }, i) => {
                  const active = isActive(pathname, href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`block py-3 text-xs font-bold tracking-[0.1em] uppercase transition-colors ${
                        i < PAGE_LINKS.length - 1 ? "border-b border-hairline" : ""
                      } ${active ? "text-[var(--brand-red)]" : "text-ink hover:text-[var(--brand-red)]"}`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
