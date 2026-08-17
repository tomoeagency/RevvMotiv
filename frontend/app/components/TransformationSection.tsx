"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import { Gauge, Sparkles, SlidersHorizontal, CheckCircle2, MoveHorizontal } from "lucide-react";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";

export function TransformationSection() {
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  }, []);

  const handleTouchMove = (e: React.TouchEvent) => {
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  return (
    <section className="border-t border-hairline bg-surface-alt py-24 relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left Column — Copy & Spec Highlights */}
          <div className="lg:col-span-6">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-3">
              The RevvMotiv Difference
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight leading-[0.95] mb-6">
              Stock Factory vs. <br />
              <span className="text-red-500">RevvMotiv Tuned.</span>
            </h2>
            <p className="text-ink-muted text-base leading-relaxed mb-8">
              Slide to compare the transformation from stock commuter OEM spec to a track-profiled aggressive street build with 1:1 carbon fiber aero fitment and race-stance lowering.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 rounded border border-hairline bg-surface">
                <Gauge className="w-5 h-5 text-red-500 flex-none mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-ink uppercase tracking-wider mb-1">
                    Functional Aerodynamic Downforce
                  </div>
                  <div className="text-xs text-ink-muted leading-relaxed">
                    CFD-tested front lips and rear diffusers add up to 45kg of high-speed downforce.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded border border-hairline bg-surface">
                <Sparkles className="w-5 h-5 text-red-500 flex-none mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-ink uppercase tracking-wider mb-1">
                    Pre-Preg Autoclaved Carbon Weave
                  </div>
                  <div className="text-xs text-ink-muted leading-relaxed">
                    Ultra-lightweight 2x2 twill carbon fiber with deep high-gloss UV coat finish.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded border border-hairline bg-surface">
                <CheckCircle2 className="w-5 h-5 text-red-500 flex-none mt-0.5" />
                <div>
                  <div className="text-sm font-bold text-ink uppercase tracking-wider mb-1">
                    Zero-Gap OEM Fitment Guarantee
                  </div>
                  <div className="text-xs text-ink-muted leading-relaxed">
                    Direct bolt-on mounting to original factory bumper and fender clip points.
                  </div>
                </div>
              </div>
            </div>

            <PrimaryCtaLink href="/work" className="px-8 py-3.5 text-xs inline-flex items-center gap-2">
              <span>Explore Real Customer Builds</span>
            </PrimaryCtaLink>
          </div>

          {/* Right Column — Interactive Before/After Comparison Slider */}
          <div className="lg:col-span-6">
            <div className="border border-hairline bg-surface rounded-xl p-5 sm:p-6 shadow-2xl relative">
              {/* Header Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-hairline">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-ink">
                    Interactive Spec Comparison
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-surface-alt border border-hairline rounded-lg p-1">
                  <button
                    type="button"
                    onClick={() => setSliderPos(0)}
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded transition-all ${
                      sliderPos <= 10
                        ? "bg-neutral-800 text-white shadow-sm"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    Stock
                  </button>
                  <button
                    type="button"
                    onClick={() => setSliderPos(50)}
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded transition-all ${
                      sliderPos > 35 && sliderPos < 65
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    50 / 50
                  </button>
                  <button
                    type="button"
                    onClick={() => setSliderPos(100)}
                    className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded transition-all ${
                      sliderPos >= 90
                        ? "bg-red-600 text-white shadow-sm"
                        : "text-ink-muted hover:text-ink"
                    }`}
                  >
                    Tuned
                  </button>
                </div>
              </div>

              {/* Slider Image Canvas */}
              <div
                ref={containerRef}
                onMouseDown={() => setIsDragging(true)}
                onMouseUp={() => setIsDragging(false)}
                onMouseLeave={() => setIsDragging(false)}
                onMouseMove={handleMouseMove}
                onTouchMove={handleTouchMove}
                className="relative aspect-[4/3] rounded-lg overflow-hidden border border-hairline select-none cursor-ew-resize bg-neutral-900"
              >
                {/* AFTER IMAGE (RevvMotiv Tuned - Base Layer) */}
                <Image
                  src="/images/transformation_tuned_after.png"
                  alt="RevvMotiv Tuned Build — After"
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-center pointer-events-none"
                  priority
                />

                {/* BEFORE IMAGE (Stock Factory — Clipped Overlay Layer) */}
                <div
                  className="absolute inset-0 overflow-hidden pointer-events-none"
                  style={{
                    clipPath: `polygon(0 0, ${sliderPos}% 0, ${sliderPos}% 100%, 0 100%)`,
                  }}
                >
                  <Image
                    src="/images/transformation_stock_before.png"
                    alt="Stock Factory OEM Car — Before"
                    fill
                    sizes="(min-width: 1024px) 45vw, 100vw"
                    className="object-cover object-center"
                    priority
                  />
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* SLIDER VERTICAL LINE & DRAGGABLE HANDLE */}
                <div
                  className="absolute top-0 bottom-0 z-20 pointer-events-none transition-transform duration-75"
                  style={{ left: `${sliderPos}%` }}
                >
                  {/* Line */}
                  <div className="absolute top-0 bottom-0 -left-[1.5px] w-[3px] bg-white shadow-[0_0_10px_rgba(0,0,0,0.8)]" />

                  {/* Handle Knob */}
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-neutral-950 border-2 border-white shadow-[0_0_15px_rgba(220,38,38,0.6)] flex items-center justify-center text-white">
                    <MoveHorizontal className="w-5 h-5 text-red-500 animate-pulse" />
                  </div>
                </div>

                {/* BADGES: STOCK VS TUNED */}
                <div className="absolute top-3.5 left-3.5 z-10 px-2.5 py-1 bg-black/80 backdrop-blur border border-white/20 rounded text-[10px] font-black text-neutral-300 uppercase tracking-wider pointer-events-none">
                  Stock Factory OEM
                </div>
                <div className="absolute top-3.5 right-3.5 z-10 px-2.5 py-1 bg-red-600/90 backdrop-blur border border-white/20 rounded text-[10px] font-black text-white uppercase tracking-wider pointer-events-none">
                  RevvMotiv Tuned
                </div>

                {/* BOTTOM FLOATING SPEC SUMMARY */}
                <div className="absolute bottom-3 left-3 right-3 z-10 p-3 bg-black/75 backdrop-blur border border-white/10 rounded-lg text-xs text-white pointer-events-none">
                  {sliderPos > 50 ? (
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-red-500 block text-[11px] uppercase tracking-wider mb-0.5">
                          RevvMotiv Aero & Performance Spec
                        </strong>
                        <span className="text-[11px] text-neutral-300">
                          Carbon Splitter + Lowered Stance + Forged Rims + White Tyre Decals.
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-red-400 font-bold ml-2">
                        {Math.round(sliderPos)}% TUNED
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <strong className="text-neutral-400 block text-[11px] uppercase tracking-wider mb-0.5">
                          Factory OEM Commuter Spec
                        </strong>
                        <span className="text-[11px] text-neutral-400">
                          Stock ride height, plastic bumper trim & factory standard wheels.
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400 font-bold ml-2">
                        {100 - Math.round(sliderPos)}% STOCK
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Accessible Range Input for Mobile & Smooth Scrubbing */}
              <div className="mt-3 flex items-center gap-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-ink-muted">Stock</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPos}
                  onChange={(e) => setSliderPos(Number(e.target.value))}
                  className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                  aria-label="Before / After comparison slider"
                />
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">Tuned</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
