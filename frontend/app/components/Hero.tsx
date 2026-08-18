"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, Crosshair } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

const HERO_SLIDES = [
  {
    image: "/hero-1-ai.png",
    caption: "Custom Street Styling",
    headline: ["Crafted for the Street.", "Designed to Stand Out."],
  },
  {
    image: "/hero-2-ai.png",
    caption: "Durable & Road-Ready",
    headline: ["Built Tough.", "Engineered for Indian Roads."],
  },
  {
    image: "/hero-3-ai.png",
    caption: "Guaranteed 1:1 Fitment",
    headline: ["Precision Molded.", "Direct Factory Bolt-On."],
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scan, setScan] = useState({ x: 50, y: 50, active: false });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[85vh] border-b border-hairline overflow-hidden bg-canvas flex flex-col justify-between">
      {/* 1. Full-Bleed Background Photo Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {HERO_SLIDES.map((slide, idx) => (
          <Image
            key={slide.image}
            src={slide.image}
            alt={slide.caption}
            fill
            priority={idx === 0}
            unoptimized
            className={`object-cover object-center transition-[opacity,transform] duration-1000 ease-out ${
              idx === currentSlide ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        ))}

        {/* Gradient Overlay — Targeted behind left text, keeping car photo crisp on right */}
        <div className="absolute inset-y-0 left-0 w-full md:w-3/5 bg-gradient-to-r from-canvas via-canvas/70 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-canvas/40 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-canvas/50 to-transparent z-10 pointer-events-none" />
        {/* Structural Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:100px_100px] opacity-30 z-10 pointer-events-none" />
        {/* Red Laser Accent */}
        <div className="absolute top-0 left-1/4 w-[1px] h-[150%] bg-red-500 shadow-[0_0_25px_rgba(201,24,43,0.9)] rotate-[35deg] origin-top-left animate-glow-pulse z-10 pointer-events-none" />
      </div>

      {/* 3. Text & Content Layer (Directly Over Image) */}
      <div className="relative z-20 max-w-screen-2xl mx-auto w-full px-6 py-20 md:py-28 flex-1 flex flex-col justify-center">
        <div className="max-w-4xl relative">
          {/* Engineering Crosshairs */}
          <Crosshair className="absolute -top-10 -left-6 text-red-500/50 w-5 h-5" />
          <Crosshair className="absolute -bottom-10 -left-6 text-red-500/50 w-5 h-5" />

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
            {/* Removed Chrome glint to fix sharp edges / weird block */}
            {/* Caliper tick */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 z-10 w-px bg-red-500 transition-opacity duration-200"
              style={{ opacity: scan.active ? 0.9 : 0, left: `${scan.x}%` }}
            >
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 border-t border-l border-red-500" />
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 border-b border-l border-red-500" />
            </div>

            <AnimatePresence mode="wait">
              <motion.h1
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{
                  duration: MOTION_DURATION.page,
                  ease: MOTION_EASE_BRAND,
                  delay: currentSlide === 0 ? 0.2 : 0,
                }}
                className="text-5xl sm:text-7xl lg:text-[90px] font-black uppercase tracking-tighter leading-[0.88] text-ink drop-shadow-2xl"
              >
                {HERO_SLIDES[currentSlide].headline[0]}
                <br />
                <span className="text-chrome">
                  {HERO_SLIDES[currentSlide].headline[1]}
                </span>
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: MOTION_DURATION.page, ease: MOTION_EASE_BRAND }}
            className="text-ink-muted text-base sm:text-lg max-w-xl font-medium leading-relaxed mb-10 drop-shadow-md"
          >
            Carbon fiber styling and aerodynamic components, engineered to
            the same tolerances as the cars they&apos;re built for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: MOTION_DURATION.page, ease: MOTION_EASE_BRAND }}
            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
          >
            <PrimaryCtaLink href="/shop" className="group relative overflow-hidden w-full sm:w-auto px-12 py-4 text-sm flex items-center justify-center gap-3 rounded shadow-2xl">
              <span className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-500 ease-out group-hover:translate-x-full">
                <span className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-white/80 shadow-[0_0_12px_rgba(255,255,255,0.8)]" />
              </span>
              <span className="relative z-10 flex items-center gap-3">
                Shop Catalog{" "}
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </PrimaryCtaLink>

            <Link
              href="/work"
              className="text-xs font-bold text-ink uppercase tracking-widest hover:text-red-400 transition-colors border-b border-white/40 hover:border-red-500 pb-1"
            >
              View Workshop Builds
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 4. Slide Indicator Bar */}
      <div className="relative z-20 max-w-screen-2xl mx-auto w-full px-6 pb-6 pt-4 flex items-center justify-between gap-4 border-t border-hairline">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentSlide}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE_BRAND }}
            className="text-[10px] font-bold uppercase tracking-widest text-ink-muted"
          >
            0{currentSlide + 1} — {HERO_SLIDES[currentSlide].caption}
          </motion.span>
        </AnimatePresence>

        <div className="flex gap-2 flex-none">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="py-2 flex items-center"
            >
              <motion.div
                animate={{ width: idx === currentSlide ? 36 : 10 }}
                className={`h-1.5 rounded-full transition-colors duration-500 ${
                  idx === currentSlide ? "bg-red-500 shadow-sm shadow-red-500/80" : "bg-white/30 hover:bg-white/60"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
