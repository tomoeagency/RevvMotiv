"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ImageOff, ImageIcon, ChevronRight } from "lucide-react";
import {
  PROJECT_VIEW_TYPES,
  type ProjectDetail,
  type ProjectView,
} from "@/lib/api";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

const VIEW_LABELS: Record<string, string> = {
  front: "Front",
  rear: "Rear",
  left: "Left Side",
  right: "Right Side",
  top: "Top",
  bottom: "Underside",
  interior: "Interior",
};

function toBullets(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function ProjectAngleSelector({ project }: { project: ProjectDetail }) {
  const orderedViews = PROJECT_VIEW_TYPES.map((type) =>
    project.views.find((v) => v.view_type === type)
  ).filter((v): v is ProjectView => Boolean(v));

  const [activeType, setActiveType] = useState(orderedViews[0]?.view_type);
  const [activeImage, setActiveImage] = useState(0);
  const [loadedUrls, setLoadedUrls] = useState<Set<string>>(new Set());

  const active = orderedViews.find((v) => v.view_type === activeType);
  const currentUrl = active?.images[activeImage];
  const isLoaded = currentUrl ? loadedUrls.has(currentUrl) : false;

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-8 lg:gap-10 items-start">
      {/* Left — angle tabs + image */}
      <div>
        <div className="flex flex-wrap gap-2 mb-4">
          {orderedViews.map((view) => (
            <button
              key={view.view_type}
              onClick={() => {
                setActiveType(view.view_type);
                setActiveImage(0);
              }}
              className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border rounded transition-all ${
                view.view_type === activeType
                  ? "brand-gradient-flow border-red-500 text-white shadow-md shadow-red-500/20"
                  : "border-hairline-strong text-ink-muted hover:text-ink hover:border-ink-faint"
              }`}
            >
              {VIEW_LABELS[view.view_type] ?? view.view_type}
            </button>
          ))}
        </div>

        {active && (
          <>
            <div className="aspect-video bg-surface border border-hairline relative overflow-hidden rounded mb-3">
              {active.images.length === 0 ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-subtle">
                  <ImageOff className="w-6 h-6" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    No photos for this angle yet
                  </span>
                </div>
              ) : (
                <>
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-surface-alt animate-pulse flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-ink-faint" />
                    </div>
                  )}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${active.view_type}-${activeImage}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: isLoaded ? 1 : 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={active.images[activeImage]}
                        alt={`${VIEW_LABELS[active.view_type] ?? active.view_type} view`}
                        fill
                        sizes="(min-width: 1024px) 60vw, 100vw"
                        className="object-cover object-center"
                        onLoad={() =>
                          setLoadedUrls((prev) => new Set(prev).add(active.images[activeImage]))
                        }
                      />
                    </motion.div>
                  </AnimatePresence>
                </>
              )}
            </div>

            {active.images.length > 1 && (
              <div className="flex gap-2">
                {active.images.map((img, idx) => (
                  <button
                    key={img}
                    onClick={() => setActiveImage(idx)}
                    className={`relative w-16 h-16 border rounded overflow-hidden ${
                      idx === activeImage
                        ? "border-red-500 shadow-sm shadow-red-500/40"
                        : "border-hairline-strong opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover object-center"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Right — heading + per-angle pointers */}
      <div className="lg:sticky lg:top-28">
        <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-2">
          {project.car_make} {project.car_model}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight mb-4">
          {project.title}
        </h1>
        <p className="text-sm text-ink-muted leading-relaxed mb-8">
          {project.description}
        </p>

        {active && (
          <div>
            <div className="text-xs font-bold text-red-500 uppercase tracking-widest mb-3">
              What We Did — {VIEW_LABELS[active.view_type] ?? active.view_type}
            </div>
            {active.work_description ? (
              <ul className="space-y-2.5">
                {toBullets(active.work_description).map((line, i) => (
                  <li key={i} className="flex gap-2 text-sm text-ink-muted leading-relaxed">
                    <ChevronRight className="w-4 h-4 text-red-500 flex-none mt-0.5" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-ink-subtle">
                No write-up for this angle yet.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
