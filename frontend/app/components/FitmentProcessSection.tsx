"use client";

import { useState } from "react";
import Image from "next/image";
import { Cpu, ShieldCheck, Wind, Wrench } from "lucide-react";

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
  },
] as const;

export function FitmentProcessSection() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const current = STEPS[activeStep];
  const IconComponent = current.icon;

  return (
    <section className="border-t border-hairline bg-surface-alt py-24 relative overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Engineering Standard
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
              The 4-Step Precision Process
            </h2>
          </div>
          <p className="text-sm text-ink-muted max-w-md">
            From raw composite weave selection to final torque check on the lift, we enforce strict motorsport standards across every component.
          </p>
        </div>

        {/* Process Content Grid */}
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column — Step Selectors */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = idx === activeStep;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveStep(idx)}
                  className={`text-left p-5 rounded-lg border transition-all duration-300 ${
                    isActive
                      ? "bg-surface border-red-500 shadow-xl shadow-red-500/10"
                      : "bg-surface/50 border-hairline hover:border-hairline-strong hover:bg-surface"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-black px-2 py-0.5 rounded ${
                          isActive
                            ? "bg-red-500 text-white"
                            : "bg-surface-alt text-ink-muted"
                        }`}
                      >
                        {step.number}
                      </span>
                      <h3
                        className={`text-sm font-bold uppercase tracking-wider ${
                          isActive ? "text-ink" : "text-ink-muted"
                        }`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? "text-red-500" : "text-ink-subtle"
                      }`}
                    />
                  </div>
                  <p className="text-xs text-ink-muted line-clamp-2 pl-9">
                    {step.badge} • {step.stat}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right Column — Active Step Preview */}
          <div className="lg:col-span-7">
            <div className="border border-hairline bg-surface rounded-lg p-6 sm:p-8 shadow-2xl relative">
              <div className="relative aspect-[16/9] rounded overflow-hidden mb-6 border border-hairline">
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover object-center transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur border border-white/20 rounded text-[10px] font-bold text-red-500 uppercase tracking-widest">
                  {current.badge}
                </div>
                <div className="absolute bottom-4 right-4 px-3 py-1 bg-red-600 text-white rounded text-xs font-bold uppercase tracking-wider shadow">
                  {current.stat}
                </div>
              </div>

              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded bg-red-500/10 text-red-500 flex items-center justify-center">
                  <IconComponent className="w-4 h-4" />
                </div>
                <h3 className="text-xl font-black uppercase tracking-tight text-ink">
                  {current.title}
                </h3>
              </div>

              <p className="text-sm text-ink-muted leading-relaxed">
                {current.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
