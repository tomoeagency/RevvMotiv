"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCT_IMAGE_BLUR_DATA_URL } from "@/lib/api";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const currentImage = images[selectedIndex] || images[0];

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    const isSwipe = Math.abs(distance) > 40;

    if (isSwipe) {
      if (distance > 0 && selectedIndex < images.length - 1) {
        // Swipe Left -> Next
        setSelectedIndex((prev) => prev + 1);
      } else if (distance < 0 && selectedIndex > 0) {
        // Swipe Right -> Prev
        setSelectedIndex((prev) => prev - 1);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const showNext = () => {
    if (selectedIndex < images.length - 1) setSelectedIndex((prev) => prev + 1);
  };

  const showPrev = () => {
    if (selectedIndex > 0) setSelectedIndex((prev) => prev - 1);
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Feature Display with Touch Swipe Support */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="aspect-square bg-surface border border-hairline rounded-2xl relative overflow-hidden shadow-lg group select-none touch-pan-y"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={currentImage}
              alt={title}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={PRODUCT_IMAGE_BLUR_DATA_URL}
              className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>

        {/* Mobile / Tablet Next & Prev Chevron Overlays */}
        {images.length > 1 && (
          <>
            {selectedIndex > 0 && (
              <button
                type="button"
                onClick={showPrev}
                aria-label="Previous image"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 backdrop-blur border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer z-10"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {selectedIndex < images.length - 1 && (
              <button
                type="button"
                onClick={showNext}
                aria-label="Next image"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 backdrop-blur border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer z-10"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}

            {/* Mobile Image Index Dot / Badge */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur border border-white/20 text-[10px] font-black text-white font-mono z-10">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails row if multiple images exist */}
      {images.length > 1 && (
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory touch-pan-x" data-lenis-prevent>
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View photo ${idx + 1} of ${title}`}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-none snap-start rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "border-red-500 shadow-md scale-105"
                    : "border-hairline hover:border-red-500/50 opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover object-center"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
