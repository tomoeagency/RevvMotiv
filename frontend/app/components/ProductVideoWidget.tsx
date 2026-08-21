"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Play, X } from "lucide-react";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

// Floating product-video teaser, bottom-right of the product page — stacks
// above the WhatsApp/Consultant FABs (see their bottom-20/bottom-[88px]
// positions). Only renders when the admin has set a video for this product.
export function ProductVideoWidget({ videoUrl, title }: { videoUrl: string; title: string }) {
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") setExpanded(false);
    }
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [expanded]);

  if (dismissed) return null;

  return (
    <>
      <div className="fixed right-4 sm:right-6 bottom-36 sm:bottom-[160px] z-40">
        <button
          type="button"
          onClick={() => setExpanded(true)}
          aria-label={`Watch video: ${title}`}
          className="group relative block w-20 sm:w-24 aspect-[9/16] rounded-xl overflow-hidden bg-neutral-950 border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] cursor-pointer"
        >
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            muted
            loop
            autoPlay
            playsInline
          />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="w-8 h-8 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-lg">
              <Play className="w-3.5 h-3.5 fill-white ml-0.5" />
            </span>
          </span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setDismissed(true);
          }}
          aria-label="Dismiss product video"
          className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-black/80 text-white flex items-center justify-center border border-white/30 shadow-md hover:bg-red-600 transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <div
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[420px] aspect-[9/16] max-h-[88vh] bg-neutral-950 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
            >
              <video
                src={videoUrl}
                className="w-full h-full object-contain bg-black"
                controls
                autoPlay
                playsInline
              />
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Close video"
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors border border-white/20 cursor-pointer shadow-md"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
