"use client";

import { useState } from "react";
import Image from "next/image";
import { Gauge, Sparkles, SlidersHorizontal, CheckCircle2 } from "lucide-react";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";

export function TransformationSection() {
  const [activeTab, setActiveTab] = useState<"tuned" | "stock">("tuned");

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
              Transform your vehicle from ordinary commuter spec to an aggressive, track-profiled street machine with 1:1 carbon fiber aero fitment and custom rubber tyre lettering.
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

          {/* Right Column — Interactive Comparison Card */}
          <div className="lg:col-span-6">
            <div className="border border-hairline bg-surface rounded-lg p-6 shadow-2xl relative">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-hairline">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-red-500" />
                  <span className="text-xs font-bold uppercase tracking-widest text-ink">
                    Visual Spec Comparison
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab("tuned")}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded transition-all ${
                      activeTab === "tuned"
                        ? "brand-gradient-flow text-white shadow"
                        : "bg-surface-alt border border-hairline text-ink-muted"
                    }`}
                  >
                    RevvMotiv Build
                  </button>
                  <button
                    onClick={() => setActiveTab("stock")}
                    className={`px-3 py-1 text-xs font-bold uppercase tracking-widest rounded transition-all ${
                      activeTab === "stock"
                        ? "brand-gradient-flow text-white shadow"
                        : "bg-surface-alt border border-hairline text-ink-muted"
                    }`}
                  >
                    Stock Factory
                  </button>
                </div>
              </div>

              <div className="relative aspect-[4/3] rounded overflow-hidden border border-hairline mb-4">
                <Image
                  src={
                    activeTab === "tuned"
                      ? "/images/hero/work_hero.png"
                      : "/images/about/hero.png"
                  }
                  alt={activeTab === "tuned" ? "RevvMotiv Tuned Build" : "Stock Factory Car"}
                  fill
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover object-center transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur border border-white/20 rounded text-[10px] font-bold text-red-500 uppercase tracking-widest">
                  {activeTab === "tuned" ? "RevvMotiv Track Spec" : "Stock OEM Commuter"}
                </div>
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur border border-white/10 rounded text-xs text-white">
                  {activeTab === "tuned" ? (
                    <span>
                      <strong className="text-red-500 block mb-0.5">Full Aero & Carbon Package Fitted</strong>
                      V-Style Front Lip + Carbon Side Skirts + 3D White Tyre Stickers + OLED Tails.
                    </span>
                  ) : (
                    <span>
                      <strong className="text-gray-400 block mb-0.5">Factory OEM Spec</strong>
                      Stock plastic bumper trim & factory ride height.
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
