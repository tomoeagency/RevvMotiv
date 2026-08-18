"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "motion/react";
import { Cpu, ShieldCheck, Wind, Wrench, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    id: "scan",
    number: "01",
    icon: Cpu,
    title: "1:1 3D Laser Chassis Scan",
    badge: "Millimeter Precision",
    description:
      "Every splitter, diffuser, and spoiler begins with a high-density 3D laser scan of the original factory chassis. We capture exact bolt holes and bumper contours so there is zero guesswork during mounting.",
    image: "/images/about/workshop.png",
    stat: "0.1mm Tolerance",
    subStat: "Factory Points Matched",
  },
  {
    id: "material",
    number: "02",
    icon: ShieldCheck,
    title: "Pre-Preg Carbon Autoclave",
    badge: "Vacuum Baked Rigidity",
    description:
      "Formed using high-modulus 2x2 twill and forged carbon composite weave, vacuum-pressurized in autoclaves to eliminate micro-voids, and clear-coated for deep UV protection.",
    image: "/images/about/hero.png",
    stat: "40% Lighter Than ABS",
    subStat: "Aerospace Resin Matrix",
  },
  {
    id: "aero",
    number: "03",
    icon: Wind,
    title: "Downforce & Aero Profiling",
    badge: "Track Tested",
    description:
      "Aero profiles are CFD simulated to generate functional downforce and direct smooth underbody airflow without creating excessive drag on daily Indian highways.",
    image: "/images/hero/work_hero.png",
    stat: "+45kg Downforce @ 120km/h",
    subStat: "CFD Wind-Tunnel Mapped",
  },
  {
    id: "fit",
    number: "04",
    icon: Wrench,
    title: "White-Light Studio Fitting",
    badge: "Master Technicians",
    description:
      "Installed directly inside our clean studio workshop. Certified master technicians perform final alignment checks, torque-spec fastening, and multi-angle photo documentation.",
    image: "/images/about/facility.png",
    stat: "100% OEM Fit Guarantee",
    subStat: "Torque-Spec Fastened",
  },
] as const;

export function FitmentProcessSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [stepProgress, setStepProgress] = useState<number>(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const totalSteps = STEPS.length;
    // Calculate current step index (0, 1, 2, 3)
    const rawStep = latest * totalSteps;
    const clampedIndex = Math.min(Math.floor(rawStep), totalSteps - 1);
    setActiveStep(clampedIndex);

    // Calculate progress within the active step (0 to 1)
    const localProgress = (rawStep - clampedIndex);
    setStepProgress(Math.min(Math.max(localProgress, 0), 1));
  });

  const scrollToStep = (idx: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const containerTop = rect.top + scrollTop;
    const totalHeight = containerRef.current.offsetHeight - window.innerHeight;
    const targetScroll = containerTop + (idx / (STEPS.length - 1)) * totalHeight;

    window.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  const current = STEPS[activeStep];
  const IconComponent = current.icon;

  return (
    <div ref={containerRef} className="relative h-[260vh] bg-surface-alt">
      {/* Sticky Fullscreen Frame */}
      <div className="sticky top-0 h-screen w-full flex flex-col justify-center overflow-hidden border-y border-hairline z-10 px-6 lg:px-12 py-6">
        {/* Background Grid Pattern & Ambient Glow */}
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:80px_80px] opacity-20 pointer-events-none" />
        <div className="absolute -top-40 right-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-screen-2xl mx-auto w-full relative z-10">
          {/* Header Row with Global Scroll Indicator */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 lg:mb-12 gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest mb-3">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                Scroll Driven Precision Architecture
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight text-ink">
                The 4-Step Fitment Process
              </h2>
            </div>

            {/* Step Counter Indicator */}
            <div className="flex items-center gap-4 bg-surface/80 backdrop-blur border border-hairline px-4 py-2 rounded-full">
              <span className="text-xs font-bold text-ink-muted uppercase tracking-wider">
                Phase <span className="text-red-500 font-mono text-sm">{current.number}</span> / 04
              </span>
              <div className="w-24 h-1.5 bg-surface-alt rounded-full overflow-hidden border border-hairline">
                <div
                  className="h-full bg-red-600 transition-all duration-150 ease-out"
                  style={{
                    width: `${((activeStep + stepProgress) / STEPS.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Process Content Grid */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column — Interactive Step Selectors */}
            <div className="lg:col-span-5 flex flex-col gap-3">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = idx === activeStep;
                const isPassed = idx < activeStep;

                return (
                  <button
                    key={step.id}
                    onClick={() => scrollToStep(idx)}
                    className={`relative text-left p-4 sm:p-5 rounded-xl border transition-all duration-300 overflow-hidden ${
                      isActive
                        ? "bg-surface border-red-500/80 shadow-2xl shadow-red-500/15 scale-[1.02]"
                        : isPassed
                        ? "bg-surface/60 border-hairline text-ink-muted opacity-85 hover:opacity-100"
                        : "bg-surface/30 border-hairline/60 opacity-60 hover:opacity-100 hover:bg-surface/50"
                    }`}
                  >
                    {/* Active Step Progress Fill Line */}
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-red-600 via-red-500 to-red-400 transition-all duration-75"
                        style={{ width: `${stepProgress * 100}%` }}
                      />
                    )}

                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[11px] font-mono font-black px-2 py-0.5 rounded transition-colors ${
                            isActive
                              ? "bg-red-600 text-white shadow-sm"
                              : isPassed
                              ? "bg-red-500/20 text-red-400"
                              : "bg-surface-alt text-ink-muted"
                          }`}
                        >
                          {step.number}
                        </span>
                        <h3
                          className={`text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors ${
                            isActive ? "text-ink" : "text-ink-muted"
                          }`}
                        >
                          {step.title}
                        </h3>
                      </div>

                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-red-500 flex-none" />
                      ) : (
                        <Icon
                          className={`w-4 h-4 transition-colors flex-none ${
                            isActive ? "text-red-500" : "text-ink-subtle"
                          }`}
                        />
                      )}
                    </div>

                    <p className="text-[11px] text-ink-muted pl-8 flex items-center gap-2">
                      <span className="text-red-500/90 font-medium">{step.badge}</span>
                      <span>•</span>
                      <span>{step.stat}</span>
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Right Column — Animated Active Step Cinematic Preview */}
            <div className="lg:col-span-7">
              <div className="border border-hairline bg-surface/90 backdrop-blur-md rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.98 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                  >
                    {/* Image Container with Telemetry Badges */}
                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-5 border border-hairline shadow-inner bg-black">
                      <Image
                        src={current.image}
                        alt={current.title}
                        fill
                        sizes="(min-width: 1024px) 50vw, 100vw"
                        className="object-cover object-center scale-105 hover:scale-100 transition-transform duration-700"
                        priority
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 sm:top-4 left-3 sm:left-4 flex items-center gap-2">
                        <div className="px-3 py-1 bg-black/75 backdrop-blur-md border border-white/20 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest">
                          {current.badge}
                        </div>
                      </div>

                      {/* Bottom Stat Overlays */}
                      <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 flex items-end justify-between gap-2">
                        <div className="bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-white">
                          <span className="text-[9px] font-bold text-ink-subtle uppercase block">
                            Telemetry Benchmark
                          </span>
                          <span className="text-xs font-bold text-red-400">
                            {current.subStat}
                          </span>
                        </div>
                        <div className="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-lg shadow-red-600/30">
                          {current.stat}
                        </div>
                      </div>
                    </div>

                    {/* Step Title & Detailed Description */}
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center flex-none">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-ink">
                        {current.title}
                      </h3>
                    </div>

                    <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                      {current.description}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
