"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { PRODUCT_IMAGE_BLUR_DATA_URL } from "@/lib/api";

export function ProductGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentImage = images[selectedIndex] || images[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Feature Display */}
      <div className="aspect-square bg-surface border border-hairline rounded-2xl relative overflow-hidden shadow-lg group">
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
      </div>

      {/* Thumbnails row if multiple images exist */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {images.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-20 h-20 flex-none rounded-xl overflow-hidden border-2 transition-all duration-200 cursor-pointer ${
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
