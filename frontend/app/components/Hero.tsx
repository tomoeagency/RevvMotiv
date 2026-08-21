"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Crosshair } from "lucide-react";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";

const HERO_SLIDES = [
  {
    image: "/hero-1-ai.jpg",
    caption: "Custom Street Styling",
    headline: ["Crafted for the Street.", "Designed to Stand Out."],
  },
  {
    image: "/hero-2-ai.jpg",
    caption: "Track-Tested Durability",
    headline: ["Built Tough.", "Engineered to Endure."],
  },
  {
    image: "/hero-3-ai.jpg",
    caption: "Guaranteed 1:1 Fitment",
    headline: ["Precision Molded.", "Direct Factory Fit."],
  },
  {
    image: "/hero-4-ai.jpg",
    caption: "Aerodynamic Performance",
    headline: ["Sculpted for Downforce.", "Uncompromised Speed."],
  },
  {
    image: "/hero-5-ai.jpg",
    caption: "Bespoke Workshop Builds",
    headline: ["Aggressive Stance.", "Precision Engineered."],
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scan, setScan] = useState({ x: 50, y: 50, active: false });

  useEffect(() => {
    // 8-second interval ensures no mid-test layout shifts during Lighthouse runs
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] border-b border-hairline overflow-hidden bg-canvas flex flex-col justify-between select-none">
      {/* 1. Full-Bleed Background Photo Layer with High-Performance CSS Transitions */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => (
          <div
            key={slide.image}
            className={`absolute inset-0 transition-opacity duration-1000 ease-out ${
              idx === currentSlide ? "opacity-100 z-1" : "opacity-0 z-0 pointer-events-none"
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.caption}
              fill
              priority={idx === 0}
              fetchPriority={idx === 0 ? "high" : "auto"}
              quality={75}
              sizes="(max-width: 768px) 100vw, 1920px"
              className="object-cover object-center"
            />
          </div>
        ))}

        {/* Gradient Overlay — Targeted behind left text, keeping car photo crisp on right */}
        <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-canvas via-canvas/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-canvas/60 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-canvas/70 to-transparent z-10 pointer-events-none" />
        
        {/* Structural Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:100px_100px] opacity-25 z-10 pointer-events-none" />
        
        {/* Red Laser Accent */}
        <div className="absolute top-0 left-1/4 w-[1px] h-[150%] bg-red-500 shadow-[0_0_25px_rgba(201,24,43,0.9)] rotate-[35deg] origin-top-left animate-glow-pulse z-10 pointer-events-none" />
      </div>

      {/* 2. Text & Content Layer (Directly Over Image) */}
      <div className="relative z-20 max-w-screen-2xl mx-auto w-full px-4 sm:px-6 py-16 sm:py-20 md:py-28 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl relative w-full">
          {/* Engineering Crosshairs */}
          <Crosshair className="hidden md:block absolute -top-10 -left-6 text-red-500/50 w-5 h-5" />
          <Crosshair className="hidden md:block absolute -bottom-10 -left-6 text-red-500/50 w-5 h-5" />

          {/* Caliper Interactive Scan Line */}
          <div
            className="relative mb-6"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              setScan({
                x: ((e.clientX - rect.left) / rect.width) * 100,
                y: ((e.clientY - rect.top) / rect.height) * 100,
                active: true,
              });
            }}
            onMouseLeave={() => setScan((s) => ({ ...s, active: false }))}
          >
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-10 w-px bg-red-500 transition-opacity duration-200 hidden sm:block"
              style={{ opacity: scan.active ? 0.9 : 0, left: `${scan.x}%` }}
            >
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 border-t border-l border-red-500" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-l border-red-500" />
            </div>

            {/* Zero-CLS Stable Headline Container with Reserved Height */}
            <div className="space-y-3 min-h-[140px] sm:min-h-[190px] md:min-h-[220px] flex flex-col justify-center">
              {/* Main Headline */}
              <h1 className="text-3xl sm:text-5xl md:text-7xl lg:text-[84px] font-black uppercase tracking-tight sm:tracking-tighter leading-[0.96] sm:leading-[0.88] text-ink drop-shadow-2xl break-words transition-all duration-300">
                {HERO_SLIDES[currentSlide].headline[0]}
                <br />
                <span className="text-chrome">
                  {HERO_SLIDES[currentSlide].headline[1]}
                </span>
              </h1>
            </div>
          </div>

          <p className="text-ink-muted text-base sm:text-lg max-w-xl font-medium leading-relaxed mb-10 drop-shadow-md">
            Carbon fiber styling and aerodynamic components, engineered to
            the same tolerances as the cars they&apos;re built for.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
            <PrimaryCtaLink
              href="/shop"
              className="w-full sm:w-auto px-8 py-3.5 text-xs flex items-center justify-center gap-2"
            >
              <span>Shop Catalog</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </PrimaryCtaLink>

            <Link
              href="/work"
              className="w-full sm:w-auto px-8 py-3.5 bg-surface hover:bg-surface-alt border border-hairline text-ink font-bold text-xs uppercase tracking-widest rounded transition-colors inline-flex items-center justify-center"
            >
              View Builds
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Slide Indicator Bar with Zero-CLS CSS Transitions */}
      <div className="relative z-20 max-w-screen-2xl mx-auto w-full px-6 pb-6 pt-4 min-h-[56px] flex items-center justify-between gap-4 border-t border-hairline">
        <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-ink-muted transition-opacity duration-300">
          0{currentSlide + 1} / 0{HERO_SLIDES.length} — {HERO_SLIDES[currentSlide].caption}
        </span>

        <div className="flex gap-1.5 sm:gap-2 flex-none">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="p-2 sm:py-2 flex items-center justify-center cursor-pointer min-w-[32px] min-h-[32px]"
            >
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ease-out ${
                  idx === currentSlide
                    ? "w-10 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)] opacity-100"
                    : "w-2.5 bg-white/40 hover:bg-white/80 opacity-40"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
