"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { ApiProduct, ProductVariant } from "@/lib/api";

export interface CartItem {
  productId: number;
  variantId?: number | null;
  variantName?: string | null;
  slug: string;
  title: string;
  price: number; // rupees, snapshot at add-time (variant price if present)
  image: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
}

function getItemKey(item: { productId: number; variantId?: number | null }): string {
  return `${item.productId}-${item.variantId || "default"}`;
}

type CartAction =
  | { type: "ADD_ITEM"; product: ApiProduct; quantity: number; variant?: ProductVariant | null }
  | { type: "REMOVE_ITEM"; productId: number; variantId?: number | null }
  | { type: "UPDATE_QUANTITY"; productId: number; quantity: number; variantId?: number | null }
  | { type: "CLEAR_CART" }
  | { type: "OPEN_DRAWER" }
  | { type: "CLOSE_DRAWER" }
  | { type: "HYDRATE"; items: CartItem[] };

const STORAGE_KEY = "revvmotiv-cart";

export const MAX_CART_QUANTITY = 99;

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity, variant } = action;
      const targetKey = `${product.id}-${variant?.id || "default"}`;
      const existingIndex = state.items.findIndex(
        (i) => `${i.productId}-${i.variantId || "default"}` === targetKey
      );

      const price = variant?.price ?? product.price;
      const image = variant?.image || product.images[0] || "";
      const variantName = variant?.name || null;
      const variantId = variant?.id || null;

      let items: CartItem[];
      if (existingIndex > -1) {
        items = state.items.map((item, idx) =>
          idx === existingIndex
            ? {
                ...item,
                quantity: Math.min(item.quantity + quantity, MAX_CART_QUANTITY),
              }
            : item
        );
      } else {
        items = [
          ...state.items,
          {
            productId: product.id,
            variantId,
            variantName,
            slug: product.slug,
            title: product.title,
            price,
            image,
            quantity: Math.min(quantity, MAX_CART_QUANTITY),
          },
        ];
      }

      return { ...state, items };
    }

    case "REMOVE_ITEM": {
      const targetKey = `${action.productId}-${action.variantId || "default"}`;
      return {
        ...state,
        items: state.items.filter(
          (i) => `${i.productId}-${i.variantId || "default"}` !== targetKey
        ),
      };
    }

    case "UPDATE_QUANTITY": {
      const targetKey = `${action.productId}-${action.variantId || "default"}`;
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => `${i.productId}-${i.variantId || "default"}` !== targetKey
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          `${i.productId}-${i.variantId || "default"}` === targetKey
            ? { ...i, quantity: Math.min(action.quantity, MAX_CART_QUANTITY) }
            : i
        ),
      };
    }

    case "CLEAR_CART":
      return { ...state, items: [] };

    case "OPEN_DRAWER":
      return { ...state, isDrawerOpen: true };

    case "CLOSE_DRAWER":
      return { ...state, isDrawerOpen: false };

    case "HYDRATE":
      return { ...state, items: action.items };

    default:
      return state;
  }
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: ApiProduct, quantity?: number, variant?: ProductVariant | null) => void;
  removeItem: (productId: number, variantId?: number | null) => void;
  updateQuantity: (productId: number, quantity: number, variantId?: number | null) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  closeDrawerForNavigation: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isDrawerOpen: false,
  });

  // Storage isn't available during SSR/first render — hydrate after mount
  // so server and client markup match on first paint (no hydration warning).
  //
  // isHydrated is state (not a ref) on purpose: the save-effect below reads
  // it as a dependency, so it only starts writing to sessionStorage once a
  // render has actually committed *after* hydration ran. A ref guard looks
  // equivalent but isn't — both effects still fire in the same commit on
  // mount, so the save-effect would read the pre-hydration (empty) closure
  // of state.items and immediately overwrite real storage with `[]` before
  // the HYDRATE dispatch's re-render ever lands. That race is also what
  // made React Strict Mode's dev-only double-invoke of these effects
  // permanently wipe the cart on a hard navigation.
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        dispatch({ type: "HYDRATE", items: JSON.parse(raw) });
      }
    } catch {
      // Corrupt/old-shape storage — ignore, start with an empty cart.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  }, [isHydrated, state.items]);

  // URL sync — the drawer itself never changes (still an overlay on top of
  // whatever page you're on), but the address bar reflects /cart while it's
  // open, so the browser Back button closes it and the URL is shareable/
  // refreshable (see app/cart/page.tsx, which opens the drawer on mount for
  // exactly that direct-visit/refresh case). Deliberately raw History API,
  // not router.push — a real Next.js navigation would unmount the current
  // page and kill the "blurred current page behind the drawer" effect,
  // which is the whole point of a drawer instead of a real cart page.
  const previousPathRef = useRef<string | null>(null);
  // Guards the close branch below to only fire on a real true->false
  // transition — without it, landing directly on /cart (isDrawerOpen still
  // false on that first render) would immediately replace the URL back to
  // "/" before app/cart/page.tsx ever gets a chance to open the drawer.
  const wasOpenRef = useRef(false);
  // Set by closeDrawerForNavigation() right before it dispatches — tells
  // this effect to leave the URL alone because a real Link navigation
  // (Checkout, Continue Shopping) is about to set the real destination
  // itself. Without this, the replaceState below (which runs async,
  // relative to the click, since it's a useEffect) can resolve *after*
  // Next's own router.push and silently overwrite /checkout back to
  // whatever page the drawer was opened from.
  const skipUrlRestoreRef = useRef(false);

  useEffect(() => {
    if (state.isDrawerOpen) {
      if (window.location.pathname !== "/cart") {
        previousPathRef.current = window.location.pathname + window.location.search;
        window.history.pushState({ cartDrawer: true }, "", "/cart");
      }
    } else if (wasOpenRef.current && window.location.pathname === "/cart") {
      if (skipUrlRestoreRef.current) {
        skipUrlRestoreRef.current = false;
      } else {
        // replaceState, not back() — back() would still race a concurrent
        // Link navigation the same way, just less obviously.
        window.history.replaceState({}, "", previousPathRef.current ?? "/");
      }
    }
    wasOpenRef.current = state.isDrawerOpen;
  }, [state.isDrawerOpen]);

  useEffect(() => {
    function handlePopstate() {
      dispatch({ type: window.location.pathname === "/cart" ? "OPEN_DRAWER" : "CLOSE_DRAWER" });
    }
    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = state.items.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0
    );

    return {
      items: state.items,
      itemCount,
      subtotal,
      addItem: (product, quantity = 1, variant = null) =>
        dispatch({ type: "ADD_ITEM", product, quantity, variant }),
      removeItem: (productId, variantId = null) =>
        dispatch({ type: "REMOVE_ITEM", productId, variantId }),
      updateQuantity: (productId, quantity, variantId = null) =>
        dispatch({ type: "UPDATE_QUANTITY", productId, quantity, variantId }),
      clearCart: () => dispatch({ type: "CLEAR_CART" }),
      isDrawerOpen: state.isDrawerOpen,
      openDrawer: () => dispatch({ type: "OPEN_DRAWER" }),
      closeDrawer: () => dispatch({ type: "CLOSE_DRAWER" }),
      closeDrawerForNavigation: () => {
        skipUrlRestoreRef.current = true;
        dispatch({ type: "CLOSE_DRAWER" });
      },
    };
  }, [state]);

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
