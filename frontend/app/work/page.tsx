import type { Metadata } from "next";
import Image from "next/image";
import { Wrench, ShieldCheck, Camera, Cpu } from "lucide-react";
import { getProjects } from "@/lib/api";
import { ProjectCard } from "@/app/components/ProjectCard";
import { WorkClientGrid } from "@/app/work/WorkClientGrid";
import { ClosingCta } from "@/app/components/ClosingCta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Our Work — Customer Builds & Workshop Fitting | RevvMotiv",
  description:
    "Real customer builds styled by RevvMotiv — carbon splitters, custom aero kits, and finish work documented across popular Indian cars.",
};

const STANDARDS = [
  {
    icon: Cpu,
    title: "Direct Vehicle Fitment",
    body: "Chassis and factory bumper mounting points verified before installation.",
  },
  {
    icon: Wrench,
    title: "Workshop Quality Check",
    body: "Every part is inspected, test-fitted, and carefully prepared before dispatch.",
  },
  {
    icon: Camera,
    title: "Multi-Angle Documentation",
    body: "Builds photographed from multiple exterior and interior angles to show real fitment.",
  },
] as const;

export default async function WorkPage() {
  const { data: projects } = await getProjects();

  return (
    <div className="w-full bg-carbon text-ink">
      {/* 1. Hero Section */}
      <section className="relative border-b border-hairline bg-canvas overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40" />
        <div className="relative max-w-screen-2xl mx-auto px-6 py-6 sm:py-8 md:py-14">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-3">
                Customer Build Showcase
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-6">
                Customer Builds. <br />
                <span className="text-red-500">Real Street Styling.</span>
              </h1>
              <p className="text-ink-muted text-base md:text-lg leading-relaxed max-w-2xl">
                Explore customer cars fitted with our custom aerodynamic splitters, diffusers, and carbon styling packages across Maruti Suzuki, Hyundai, and Volkswagen platforms.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-lg border border-hairline bg-surface overflow-hidden shadow-2xl">
                <Image
                  src="/images/hero/work_hero.png"
                  alt="RevvMotiv customer build in studio tuning bay"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur border border-white/10 rounded text-xs text-white">
                  <span className="font-bold text-red-500 uppercase tracking-wider block mb-0.5">
                    Customer Aero Fitment
                  </span>
                  White-light studio alignment & downforce verification.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Build Metrics Highlights Bar */}
      <section className="border-b border-hairline bg-surface-alt py-10">
        <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-black text-ink mb-1">
              {projects && projects.length > 0 ? projects.length : 6}
            </div>
            <div className="text-xs font-bold text-ink-muted uppercase tracking-widest">
              Featured Builds
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-ink mb-1">14+</div>
            <div className="text-xs font-bold text-ink-muted uppercase tracking-widest">
              Angle Views Documented
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-ink mb-1">100%</div>
            <div className="text-xs font-bold text-ink-muted uppercase tracking-widest">
              Pre-Preg Carbon Fiber
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-ink mb-1">0%</div>
            <div className="text-xs font-bold text-ink-muted uppercase tracking-widest">
              Drop-Shipping / 100% Fitted
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Projects Grid */}
      <section className="max-w-screen-2xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
              Workshop Gallery
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              Featured Customer Projects
            </h2>
          </div>
          <p className="text-xs text-ink-muted">
            Click any project to view angle-by-angle exterior & interior breakdowns.
          </p>
        </div>

        <WorkClientGrid initialProjects={projects} />
      </section>

      {/* 4. Fitting Standards Callout */}
      <section className="border-t border-b border-hairline bg-surface-alt py-20">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-14">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Our Guarantee
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-3">
              Workshop Fitting Standards
            </h2>
            <p className="text-sm text-ink-muted">
              We hold every single customer build to the same rigorous fitting criteria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {STANDARDS.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="p-6 rounded border border-hairline bg-surface hover:border-red-500/40 transition-all"
              >
                <Icon className="w-6 h-6 text-red-500 mb-4" />
                <h3 className="text-base font-bold text-ink uppercase tracking-wider mb-2">
                  {title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Closing CTA */}
      <ClosingCta
        heading="Want This For Your Car?"
        body="Tell us about your car and what styling or aero upgrade you're after — our master technicians will help you plan the right build."
      />
    </div>
  );
}
