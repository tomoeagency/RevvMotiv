"use client";

import { useEffect, useState } from "react";
import { Play, Loader2 } from "lucide-react";
import type { GalleryItem } from "@/lib/api";
import { GalleryLightbox } from "@/app/components/GalleryLightbox";

export function GalleryGrid({ items: propItems = [] }: { items?: GalleryItem[] }) {
  const [items, setItems] = useState<GalleryItem[]>(propItems);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(propItems.length === 0);

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

  return (
    <>
      <div className="columns-2 sm:columns-3 lg:columns-4 gap-4">
        {items.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(i)}
            aria-label={item.caption ? `Open: ${item.caption}` : "Open gallery item"}
            className="block w-full mb-4 break-inside-avoid relative group overflow-hidden bg-surface border border-hairline-strong text-left rounded-xl"
          >
            {item.media_type === "video" ? (
              <>
                {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                <video
                  src={item.media_url}
                  className="w-full h-auto block"
                  muted
                  playsInline
                  preload="metadata"
                />
                <span className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                  <span className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                  </span>
                </span>
              </>
            ) : (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.media_url}
                alt={item.caption ?? ""}
                className="w-full h-auto block group-hover:scale-105 transition-transform duration-700"
              />
            )}
            {item.caption && (
              <span className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent text-xs font-bold text-white">
                {item.caption}
              </span>
            )}
          </button>
        ))}
      </div>

      <GalleryLightbox
        items={items}
        activeIndex={activeIndex}
        onClose={() => setActiveIndex(null)}
        onNavigate={setActiveIndex}
      />
    </>
  );
}
