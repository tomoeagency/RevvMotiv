"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight, Crosshair, Sparkles } from "lucide-react";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";

const HERO_SLIDES = [
  {
    image: "/hero-1-ai.jpg",
    caption: "Custom Street Styling",
    badge: "PRECISION CRAFTSMANSHIP",
    headline: ["Crafted for the Street.", "Designed to Stand Out."],
  },
  {
    image: "/hero-2-ai.jpg",
    caption: "Track-Tested Durability",
    badge: "EXTREME ENDURANCE",
    headline: ["Built Tough.", "Engineered to Endure."],
  },
  {
    image: "/hero-3-ai.jpg",
    caption: "Guaranteed 1:1 Fitment",
    badge: "DIRECT OEM BOLT-ON",
    headline: ["Precision Molded.", "Direct Factory Fit."],
  },
  {
    image: "/hero-4-ai.jpg",
    caption: "Aerodynamic Performance",
    badge: "TRACK-GRADE AERO",
    headline: ["Sculpted for Downforce.", "Uncompromised Speed."],
  },
  {
    image: "/hero-5-ai.jpg",
    caption: "Bespoke Workshop Builds",
    badge: "CUSTOM FABRICATION",
    headline: ["Aggressive Stance.", "Precision Engineered."],
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scan, setScan] = useState({ x: 50, y: 50, active: false });

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[88dvh] border-b border-hairline overflow-hidden bg-canvas flex flex-col justify-between select-none">
      {/* 1. Full-Bleed Background Photo Layer with Smooth Crossfade & Ken Burns Zoom */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{
              opacity: { duration: 1.2, ease: [0.16, 1, 0.3, 1] },
              scale: { duration: 6, ease: "easeOut" },
            }}
            className="absolute inset-0"
          >
            <Image
              src={HERO_SLIDES[currentSlide].image}
              alt={HERO_SLIDES[currentSlide].caption}
              fill
              priority
              fetchPriority="high"
              sizes="100vw"
              className="object-cover object-center"
            />
          </motion.div>
        </AnimatePresence>

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

            {/* Staggered Text Transition */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
                  },
                  exit: {
                    opacity: 0,
                    transition: { staggerChildren: 0.05, staggerDirection: -1 },
                  },
                }}
                className="space-y-3"
              >
                {/* Dynamic Category/Feature Badge */}
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                    },
                    exit: { opacity: 0, y: -6, transition: { duration: 0.25 } },
                  }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest backdrop-blur-sm"
                >
                  <Sparkles className="w-3 h-3 text-red-500" />
                  <span>{HERO_SLIDES[currentSlide].badge}</span>
                </motion.div>

                {/* Main Headline */}
                <motion.h1
                  variants={{
                    hidden: { opacity: 0, y: 12 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
                    },
                    exit: { opacity: 0, y: -10, transition: { duration: 0.3 } },
                  }}
                  className="text-3xl sm:text-5xl md:text-7xl lg:text-[84px] font-black uppercase tracking-tight sm:tracking-tighter leading-[0.96] sm:leading-[0.88] text-ink drop-shadow-2xl break-words"
                >
                  {HERO_SLIDES[currentSlide].headline[0]}
                  <br />
                  <span className="text-chrome">
                    {HERO_SLIDES[currentSlide].headline[1]}
                  </span>
                </motion.h1>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-ink-muted text-base sm:text-lg max-w-xl font-medium leading-relaxed mb-10 drop-shadow-md"
          >
            Carbon fiber styling and aerodynamic components, engineered to
            the same tolerances as the cars they&apos;re built for.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto"
          >
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
          </motion.div>
        </div>
      </div>

      {/* 3. Slide Indicator Bar with Smooth Active Bar Transition */}
      <div className="relative z-20 max-w-screen-2xl mx-auto w-full px-6 pb-6 pt-4 flex items-center justify-between gap-4 border-t border-hairline">
        <AnimatePresence mode="wait">
          <motion.span
            key={currentSlide}
            initial={{ opacity: 0, y: 6, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(4px)" }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="text-[11px] font-mono font-bold uppercase tracking-widest text-ink-muted"
          >
            0{currentSlide + 1} / 0{HERO_SLIDES.length} — {HERO_SLIDES[currentSlide].caption}
          </motion.span>
        </AnimatePresence>

        <div className="flex gap-1.5 sm:gap-2 flex-none">
          {HERO_SLIDES.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className="p-2 sm:py-2 flex items-center justify-center cursor-pointer min-w-[32px] min-h-[32px]"
            >
              <motion.div
                animate={{
                  width: idx === currentSlide ? 40 : 10,
                  opacity: idx === currentSlide ? 1 : 0.4,
                }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={`h-1.5 rounded-full ${
                  idx === currentSlide ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]" : "bg-white/40 hover:bg-white/80"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
