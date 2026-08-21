"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryItem } from "@/lib/api";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";
import { useSwipeNavigation } from "@/lib/useSwipeNavigation";

export function GalleryLightbox({
  items,
  activeIndex,
  onClose,
  onNavigate,
}: {
  items: GalleryItem[];
  activeIndex: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}) {
  const isOpen = activeIndex !== null;
  const item = isOpen ? items[activeIndex] : null;

  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: () => activeIndex !== null && onNavigate((activeIndex + 1) % items.length),
    onSwipeRight: () => activeIndex !== null && onNavigate((activeIndex - 1 + items.length) % items.length),
    onSwipeDown: onClose,
  });

  // Body scroll lock + keyboard nav while open, same pattern CartDrawer
  // uses — without the lock the backdrop reads as decorative while the
  // page underneath visibly scrolls with it.
  useEffect(() => {
    if (!isOpen || activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((activeIndex! + 1) % items.length);
      if (e.key === "ArrowLeft") onNavigate((activeIndex! - 1 + items.length) % items.length);
    }
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen, activeIndex, items.length, onClose, onNavigate]);

  return (
    <AnimatePresence>
      {isOpen && item && activeIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
          onClick={onClose}
          onTouchStart={swipeHandlers.onTouchStart}
          onTouchEnd={swipeHandlers.onTouchEnd}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-10"
          >
            <X className="w-7 h-7" />
          </button>

          {items.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((activeIndex - 1 + items.length) % items.length);
                }}
                aria-label="Previous"
                className="absolute left-4 sm:left-6 text-white/70 hover:text-white transition-colors z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigate((activeIndex + 1) % items.length);
                }}
                aria-label="Next"
                className="absolute right-4 sm:right-6 text-white/70 hover:text-white transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            </>
          )}

          <motion.div
            key={item.id}
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
            className="max-w-4xl w-full max-h-[85vh] flex flex-col items-center"
          >
            {item.media_type === "video" ? (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                src={item.media_url.replace(/^https?:\/\/api\.revvmotiv\.com/, '')}
                controls
                autoPlay
                className="max-w-full max-h-[75vh] bg-black rounded-xl"
              />
            ) : (
              // Plain <img>, not next/image — the source aspect ratio isn't
              // known ahead of time (not stored on the model), so there's
              // no width/height to give next/image without either
              // distorting the media or adding a whole image-metadata
              // pipeline just for this.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.media_url.replace(/^https?:\/\/api\.revvmotiv\.com/, '')}
                alt={item.caption ?? ""}
                className="max-w-full max-h-[75vh] object-contain rounded-xl"
              />
            )}
            {item.caption && (
              <p className="mt-4 text-sm text-white/80 text-center max-w-xl">
                {item.caption}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
