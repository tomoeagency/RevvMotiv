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
import { getProduct } from "@/lib/api";

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
  | { type: "HYDRATE"; items: CartItem[] }
  | { type: "PRUNE_ITEMS"; keys: string[] };

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

    case "PRUNE_ITEMS": {
      const keep = new Set(action.keys);
      return {
        ...state,
        items: state.items.filter((i) => keep.has(getItemKey(i))),
      };
    }

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
  // Items sessionStorage remembered but that no longer exist/are no longer
  // active (deleted or drafted since being added) — pruned from the real
  // cart automatically so checkout never hits a cryptic "product_id is
  // invalid" error at the final step; exposed here so a page can tell the
  // visitor why their cart changed, if it wants to.
  removedStaleItems: CartItem[];
  dismissRemovedStaleItems: () => void;
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
  const [removedStaleItems, setRemovedStaleItems] = useState<CartItem[]>([]);

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

  // Validate remembered cart items against the live catalog once, right
  // after hydration — a product can be deleted or drafted while sitting in
  // someone's cart between visits. Without this, that surfaces for the
  // first time as a generic "items.0.product_id is invalid" error at the
  // very last step of checkout; here it's caught upfront and the item is
  // quietly dropped with a reason the UI can show if it wants to.
  useEffect(() => {
    if (!isHydrated || state.items.length === 0) return;

    let cancelled = false;
    (async () => {
      const uniqueIds = Array.from(new Set(state.items.map((i) => i.productId)));
      const results = await Promise.all(
        uniqueIds.map(async (id) => [id, await getProduct(String(id))] as const)
      );
      if (cancelled) return;

      const invalidIds = new Set(results.filter(([, product]) => !product).map(([id]) => id));
      if (invalidIds.size === 0) return;

      const stale = state.items.filter((i) => invalidIds.has(i.productId));
      const keep = state.items.filter((i) => !invalidIds.has(i.productId)).map(getItemKey);

      setRemovedStaleItems(stale);
      dispatch({ type: "PRUNE_ITEMS", keys: keep });
    })();

    return () => {
      cancelled = true;
    };
    // Only re-check when hydration completes — re-running on every items
    // change would re-validate items we just added ourselves.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHydrated]);

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
      removedStaleItems,
      dismissRemovedStaleItems: () => setRemovedStaleItems([]),
    };
  }, [state, removedStaleItems]);

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
