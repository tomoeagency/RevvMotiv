"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

const DEBOUNCE_MS = 400;

// Client component so typing can update the URL's ?search= param without a
// full page reload — search/category/page all live in the URL (not local
// state) so the product grid stays server-rendered and the filters stay
// shareable/bookmarkable, matching how ?category= already works here.
export function ShopSearchBar({ autoFocus }: { autoFocus?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("search") ?? "");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
    // Only on mount — this is a one-time "arrived here from the navbar
    // search shortcut" affordance, not something that should refocus on
    // every param change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function updateSearch(next: string) {
    setValue(next);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.trim()) {
        params.set("search", next.trim());
      } else {
        params.delete("search");
      }
      // A fresh search invalidates whatever page you were on, and
      // "focus" was only ever meant for the initial arrival from the
      // navbar shortcut — once the visitor's typed something, drop it so
      // it doesn't linger in the URL.
      params.delete("page");
      params.delete("focus");
      router.push(`/shop?${params.toString()}`, { scroll: false });
    }, DEBOUNCE_MS);
  }

  function clear() {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    params.delete("page");
    params.delete("focus");
    router.push(`/shop?${params.toString()}`, { scroll: false });
    inputRef.current?.focus();
  }

  return (
    <div className="relative mb-8">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle pointer-events-none" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => updateSearch(e.target.value)}
        placeholder="Search products…"
        className="w-full bg-surface border border-hairline focus:border-[var(--brand-red)] outline-none pl-11 pr-11 py-3 text-sm text-ink placeholder:text-ink-subtle transition-colors rounded"
      />
      {value && (
        <button
          onClick={clear}
          aria-label="Clear search"
          className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
