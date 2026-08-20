"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ChevronLeft, ChevronRight, X, Maximize2, ZoomIn } from "lucide-react";
import { PRODUCT_IMAGE_BLUR_DATA_URL } from "@/lib/api";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const containerRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const safeImages = images && images.length > 0 ? images : ["/images/logo.png"];
  const currentImage = safeImages[selectedIndex] || safeImages[0];

  // Amazon-style Mouse Move Lens Zoom Handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setZoomPos({ x: 50, y: 50 });
  };

  // Keyboard navigation & ESC listener for full-screen lightbox
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev < safeImages.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : safeImages.length - 1));
      }
    },
    [isLightboxOpen, safeImages.length]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    if (isLightboxOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isLightboxOpen, handleKeyDown]);

  // Touch Swipe handlers
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
      if (distance > 0 && selectedIndex < safeImages.length - 1) {
        setSelectedIndex((prev) => prev + 1);
      } else if (distance < 0 && selectedIndex > 0) {
        setSelectedIndex((prev) => prev - 1);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const showNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev < safeImages.length - 1 ? prev + 1 : 0));
  };

  const showPrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setSelectedIndex((prev) => (prev > 0 ? prev - 1 : safeImages.length - 1));
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Main Feature Display with Hover Magnify & Fullscreen Click */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsLightboxOpen(true)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="aspect-square bg-surface border border-hairline rounded-2xl relative overflow-hidden shadow-lg group select-none touch-pan-y cursor-zoom-in"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 p-3 sm:p-5 flex items-center justify-center"
          >
            <div
              className="relative w-full h-full transition-transform duration-100 ease-out"
              style={{
                transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                transform: isHovering ? "scale(2.2)" : "scale(1)",
              }}
            >
              <Image
                src={currentImage}
                alt={title}
                fill
                priority
                sizes="(min-width: 768px) 50vw, 100vw"
                placeholder="blur"
                blurDataURL={PRODUCT_IMAGE_BLUR_DATA_URL}
                className="object-contain object-center"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Hover Zoom Hint Badge on Desktop */}
        <div className="hidden md:flex items-center gap-1.5 absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur border border-white/10 text-[10px] font-bold text-white/90 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <ZoomIn className="w-3 h-3 text-red-400" />
          <span>Hover to zoom · Click to expand</span>
        </div>

        {/* Fullscreen Expand Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
          }}
          aria-label="Open full screen image"
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/70 backdrop-blur border border-white/20 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Previous & Next Chevron Overlays */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={showPrev}
              aria-label="Previous image"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 backdrop-blur border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 opacity-80 hover:opacity-100 cursor-pointer z-10"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={showNext}
              aria-label="Next image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/70 backdrop-blur border border-white/20 text-white flex items-center justify-center shadow-lg transition-all active:scale-90 opacity-80 hover:opacity-100 cursor-pointer z-10"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {/* Mobile Image Index Dot / Badge */}
            <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur border border-white/20 text-[10px] font-black text-white font-mono z-10">
              {selectedIndex + 1} / {safeImages.length}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails row if multiple images exist */}
      {safeImages.length > 1 && (
        <div className="flex gap-2.5 sm:gap-3 overflow-x-auto pb-2 hide-scrollbar snap-x snap-mandatory touch-pan-x" data-lenis-prevent>
          {safeImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                aria-label={`View photo ${idx + 1} of ${title}`}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-none snap-start rounded-xl overflow-hidden border-2 bg-surface p-1 transition-all duration-200 cursor-pointer ${
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
                  className="object-contain object-center"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Full-Screen Amazon-Style Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-8"
            onClick={() => setIsLightboxOpen(false)}
          >
            {/* Top Bar with Title & Close Button */}
            <div className="w-full max-w-7xl flex items-center justify-between z-20">
              <div className="flex items-center gap-3">
                <span className="text-xs sm:text-sm font-bold text-white/90 truncate max-w-xs sm:max-w-md">
                  {title}
                </span>
                {safeImages.length > 1 && (
                  <span className="text-xs font-mono text-white/60 bg-white/10 px-2 py-0.5 rounded-full">
                    {selectedIndex + 1} / {safeImages.length}
                  </span>
                )}
              </div>

              {/* Amazon Style Close Button */}
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition-colors cursor-pointer group"
                aria-label="Close full screen view"
              >
                <span className="hidden sm:inline text-white/70 group-hover:text-white">ESC</span>
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Centered High-Res Image Display */}
            <div
              className="relative w-full max-w-5xl h-[70vh] sm:h-[78vh] flex items-center justify-center my-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImage}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full h-full flex items-center justify-center"
                >
                  <Image
                    src={currentImage}
                    alt={title}
                    fill
                    sizes="100vw"
                    priority
                    className="object-contain object-center"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Lightbox Prev & Next Navigation */}
              {safeImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={showPrev}
                    aria-label="Previous image"
                    className="absolute -left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center shadow-2xl hover:bg-red-600 transition-colors cursor-pointer z-30"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Next image"
                    className="absolute -right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/80 border border-white/20 text-white flex items-center justify-center shadow-2xl hover:bg-red-600 transition-colors cursor-pointer z-30"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Bottom Lightbox Thumbnails Strip */}
            {safeImages.length > 1 && (
              <div
                className="w-full max-w-xl flex items-center justify-center gap-2 overflow-x-auto py-2 z-20"
                onClick={(e) => e.stopPropagation()}
              >
                {safeImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative w-12 h-12 sm:w-14 sm:h-14 flex-none rounded-lg overflow-hidden border-2 bg-neutral-900 transition-all cursor-pointer ${
                      idx === selectedIndex
                        ? "border-red-500 scale-105"
                        : "border-white/20 hover:border-white/50 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="60px"
                      className="object-contain object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
