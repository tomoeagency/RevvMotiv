"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import type { GalleryItem } from "@/lib/api";
import { GalleryLightbox } from "@/app/components/GalleryLightbox";

export function GalleryGrid({ items }: { items: GalleryItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      {/* CSS-columns masonry, same technique as the homepage's "From Our
          Garage" bento fix — thumbnails only change via transform (scale)
          on hover, never height, so there's no risk of the column
          -rebalance/hover-thrash bug that hit the trust panel. */}
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
