"use client";

import { useEffect, useState, useRef } from "react";
import { Play, Loader2 } from "lucide-react";
import { GALLERY_CATEGORIES, type GalleryItem } from "@/lib/api";
import { GalleryLightbox } from "@/app/components/GalleryLightbox";

export function normalizeMediaUrl(url: string): string {
  if (!url) return "";
  if (url.includes("api.revvmotiv.com/uploads/")) {
    return url.replace(/^https?:\/\/api\.revvmotiv\.com/, "");
  }
  return url;
}

// Without pagination, the whole gallery renders at once — a <video> tag
// starts fetching the moment it's in the DOM, so N videos would all start
// loading on page load with no pagination to cap that. This defers
// mounting the real <video> until it's within 800px of the viewport
// (generous enough that it's already loaded by the time a normal scroll
// speed reaches it), same effect pagination used to have for free.
function LazyGalleryVideo({ src, className }: { src: string; className: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || shouldLoad) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "800px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className={`${className} bg-surface-alt`}>
      {shouldLoad && (
        // eslint-disable-next-line jsx-a11y/media-has-caption
        <video
          src={src}
          className="w-full h-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
      )}
    </div>
  );
}

export function GalleryGrid({ items: propItems = [] }: { items?: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(propItems);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(propItems.length === 0);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/v1/gallery")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((body) => {
        if (body.data && Array.isArray(body.data)) {
          setItems(body.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredItems = activeCategory
    ? items.filter((item) => item.category === activeCategory)
    : items;

  const handleCategoryChange = (category: string | null) => {
    setActiveCategory(category);
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center py-20 text-ink-muted gap-2">
        <Loader2 className="w-5 h-5 animate-spin text-red-500" />
        <span className="text-sm font-medium">Loading workshop footage...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <p className="text-sm text-ink-muted py-12 text-center">
        No gallery items published yet — check back soon.
      </p>
    );
  }

  const categoriesPresent = new Set(items.map((item) => item.category).filter(Boolean));

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          type="button"
          onClick={() => handleCategoryChange(null)}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
            activeCategory === null
              ? "bg-red-600 text-white"
              : "bg-surface border border-hairline text-ink-muted hover:border-red-500/50 hover:text-ink"
          }`}
        >
          All
        </button>
        {Object.entries(GALLERY_CATEGORIES)
          .filter(([value]) => categoriesPresent.has(value))
          .map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => handleCategoryChange(value)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                activeCategory === value
                  ? "bg-red-600 text-white"
                  : "bg-surface border border-hairline text-ink-muted hover:border-red-500/50 hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
      </div>

      {filteredItems.length === 0 ? (
        <p className="text-sm text-ink-muted py-12 text-center">
          No items in this category yet — try another filter.
        </p>
      ) : (
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
        {filteredItems.map((item, i) => {
          const mediaSrc = normalizeMediaUrl(item.media_url);

          return (
            <button
              key={item.id}
              onClick={() => setActiveIndex(i)}
              aria-label={item.caption ? `Open: ${item.caption}` : "Open gallery item"}
              className="block w-full mb-4 break-inside-avoid relative group overflow-hidden bg-surface border border-hairline-strong text-left rounded-xl hover:border-red-500/50 transition-colors cursor-pointer shadow-sm"
            >
              {item.media_type === "video" ? (
                <>
                  {/* iOS Safari doesn't reliably paint a frame from
                      preload="metadata" alone (unlike Android/Chrome) —
                      the #t=0.1 fragment forces it to seek to that frame
                      and display it as a thumbnail. Loading is deferred
                      until near-viewport (see LazyGalleryVideo) since
                      there's no pagination capping how many mount at once. */}
                  <LazyGalleryVideo src={`${mediaSrc}#t=0.1`} className="w-full aspect-[3/4]" />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                    <span className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </span>
                  </span>
                </>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={mediaSrc}
                  alt={item.caption ?? ""}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-auto block group-hover:scale-105 transition-transform duration-700"
                />
              )}
              {item.caption && (
                <span className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-xs font-bold text-white drop-shadow">
                  {item.caption}
                </span>
              )}
            </button>
          );
        })}
      </div>
      )}

      <GalleryLightbox
        items={filteredItems}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
