import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Wrench, ShieldCheck, Cpu, Gauge } from "lucide-react";
import { getProjects } from "@/lib/api";
import { ProjectCard } from "@/app/components/ProjectCard";
import { ClosingCta } from "@/app/components/ClosingCta";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";

export const metadata: Metadata = {
  title: "About Us — RevvMotiv | Precision Automotive Aero & Carbon Fiber",
  description:
    "RevvMotiv designs, sources, and installs carbon fiber styling and aerodynamic components for drivers across India who expect more than stock.",
};

const PILLARS = [
  {
    number: "01",
    icon: Cpu,
    title: "3D Laser Scan Fitment",
    body: "Every splitter, diffuser, and spoiler is molded from 1:1 3D laser chassis scans of original vehicles to guarantee exact OEM mounting alignment.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Pre-Preg Carbon Fiber",
    body: "Vacuum autoclaved 2x2 twill and forged carbon composite weave engineered for ultra-lightweight rigidity and deep UV clear-coat protection.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "In-House Master Fitting",
    body: "We don't drop-ship. Every build component is inspected, pre-fitted, and installed inside our own clean studio workshop by certified technicians.",
  },
  {
    number: "04",
    icon: Gauge,
    title: "Track & Street Tested",
    body: "Aerodynamically profiled for genuine high-speed downforce and built tough enough to withstand daily Indian road conditions.",
  },
] as const;

const METRICS = [
  { value: "1,500+", label: "Custom Builds Fitted" },
  { value: "100%", label: "OEM Fitment Guarantee" },
  { value: "45+", label: "Cities Served Nationwide" },
  { value: "4.9/5", label: "Driver Rating" },
] as const;

const LEADERSHIP = [
  {
    name: "Vikramaditya Roy",
    role: "Chief Aerodynamicist & Lead Architect",
    bio: "Former motorsport vehicle dynamics engineer with 10+ years specializing in carbon fiber composite airflow modeling and downforce optimization.",
    image: "/images/about/founder_vikram.png",
  },
  {
    name: "Kabir Sharma",
    role: "Head of Composite Engineering & 3D Fitment",
    bio: "Pioneer in 1:1 3D chassis laser scanning and autoclaved pre-preg carbon manufacturing, ensuring zero-gap OEM mounting on every customer build.",
    image: "/images/about/founder_kabir.png",
  },
] as const;

export default async function AboutPage() {
  const { data: projects } = await getProjects();
  const featuredProjects = projects.slice(0, 3);

  return (
    <div className="w-full bg-carbon text-ink">
      {/* 1. Hero Section — Realistic White-Light Tuning Studio */}
      <section className="relative border-b border-hairline bg-canvas overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40" />
        <div className="relative max-w-screen-2xl mx-auto px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-6">
                Born for the track. <br />
                <span className="text-red-500">Engineered for the street.</span>
              </h1>
              <p className="text-ink-muted text-base md:text-lg max-w-2xl leading-relaxed mb-8">
                RevvMotiv was founded by motorsport enthusiasts to bring true precision aero, carbon fiber styling, and track-tested performance components to India&apos;s tuning culture — designed, sourced, and fitted in-house.
              </p>
              <div className="flex flex-wrap gap-4">
                <PrimaryCtaLink
                  href="/work"
                  className="px-8 py-3.5 text-xs inline-flex items-center justify-center"
                >
                  Explore Our Work
                </PrimaryCtaLink>
                <Link
                  href="/products"
                  className="px-8 py-3.5 bg-surface hover:bg-surface-alt border border-hairline text-ink font-bold text-xs uppercase tracking-widest rounded transition-colors inline-flex items-center justify-center"
                >
                  Shop Catalog
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-lg border border-hairline bg-surface overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/hero.png"
                  alt="RevvMotiv clean white studio workshop"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur border border-white/10 rounded text-xs text-white">
                  <span className="font-bold text-red-500 uppercase tracking-wider block mb-0.5">
                    RevvMotiv HQ Workshop
                  </span>
                  Clean white-light studio tuning bay & fitting center.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Impact Metrics Band */}
      <section className="border-b border-hairline bg-surface-alt py-12">
        <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {METRICS.map((metric) => (
            <div key={metric.label} className="p-4">
              <div className="text-3xl md:text-5xl font-black text-ink tracking-tight mb-1">
                {metric.value}
              </div>
              <div className="text-xs font-bold text-ink-muted uppercase tracking-widest">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Our Story & Engineering Craftsmanship */}
      <section className="max-w-screen-2xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-lg border border-hairline bg-surface overflow-hidden">
            <Image
              src="/images/about/workshop.png"
              alt="Master technician inspecting carbon splitter with 3D scanner"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Engineering Craftsmanship
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
              No stock renders. <br /> No guesswork fitment.
            </h2>
            <p className="text-ink-muted text-base md:text-lg leading-relaxed mb-6">
              We build and fit performance-styling parts — splitters, diffusers, spoilers, lighting, and interior tech — for drivers across India who want their car to look and sound as sharp as it drives. Every product on this site comes through our own hands before it ships or gets installed.
            </p>
            <p className="text-ink-muted text-base md:text-lg leading-relaxed mb-8">
              Unlike generic drop-shippers who use stock renders, everything documented on our site represents real customer builds fitted directly inside our workshop with millimeter precision.
            </p>
            <div className="flex items-center gap-6 border-t border-hairline pt-6">
              <div>
                <div className="text-sm font-bold text-ink uppercase">Nationwide Express</div>
                <div className="text-xs text-ink-muted">Inspected & tracked from garage to door</div>
              </div>
              <div className="h-8 w-px bg-hairline" />
              <div>
                <div className="text-sm font-bold text-ink uppercase">Master Technicians</div>
                <div className="text-xs text-ink-muted">Fitted by experienced automotive builders</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Leadership & Master Architects Section */}
      <section className="border-t border-hairline bg-surface-alt py-24">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Leadership & Master Architects
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              The Engineering Minds
            </h2>
            <p className="text-ink-muted text-sm md:text-base">
              Combining motorsport aerodynamics with 3D laser precision to set a new benchmark for Indian automotive tuning.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {LEADERSHIP.map((person) => (
              <div
                key={person.name}
                className="group border border-hairline bg-surface rounded-lg overflow-hidden hover:border-red-500/40 transition-all duration-500"
              >
                <div className="relative aspect-[4/3] bg-carbon overflow-hidden">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                      {person.name}
                    </h3>
                    <div className="text-xs font-bold text-red-500 uppercase tracking-widest">
                      {person.role}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {person.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The 4 Pillars of Excellence */}
      <section className="border-t border-b border-hairline bg-canvas py-24">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Why Drivers Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              The 4 Pillars of Excellence
            </h2>
            <p className="text-ink-muted text-sm md:text-base">
              From raw carbon weave selection to final torque check on the lift, we enforce strict standards across every component.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PILLARS.map(({ number, icon: Icon, title, body }) => (
              <div
                key={title}
                className="p-6 rounded border border-hairline bg-surface hover:border-red-500/40 transition-all group"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black text-red-500">{number}</span>
                  <Icon className="w-6 h-6 text-ink-muted group-hover:text-red-400 transition-colors" />
                </div>
                <h3 className="text-base font-bold text-ink uppercase tracking-wider mb-3">
                  {title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Inside Our Master Fitting Facility (Studio Showcase) */}
      <section className="max-w-screen-2xl mx-auto px-6 py-24">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Behind The Scenes
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              Inside Our Facility
            </h2>
          </div>
          <p className="text-sm text-ink-muted max-w-md">
            Our clean white-light studio workshop is equipped with digital alignment rigs, lift bays, and carbon finishing stations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="relative aspect-[4/3] rounded border border-hairline overflow-hidden group">
            <Image
              src="/images/about/facility.png"
              alt="Spacious clean white studio tuning workshop"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-xs font-bold text-white uppercase tracking-wider">
              Main Tuning & Detail Bay
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded border border-hairline overflow-hidden group">
            <Image
              src="/images/about/fitting.png"
              alt="Master technician aligning carbon fiber diffuser"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-xs font-bold text-white uppercase tracking-wider">
              Precision Aero Alignment
            </div>
          </div>

          <div className="relative aspect-[4/3] rounded border border-hairline overflow-hidden group">
            <Image
              src="/images/about/workshop.png"
              alt="3D laser scanning and quality check"
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-xs font-bold text-white uppercase tracking-wider">
              Quality Inspection & Laser Scan
            </div>
          </div>
        </div>
      </section>

      {/* 7. Recent Real Builds Section */}
      {featuredProjects.length > 0 && (
        <section className="border-t border-hairline bg-surface-alt py-24">
          <div className="max-w-screen-2xl mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
              <div>
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
                  Real Customer Builds
                </span>
                <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
                  Recent Workshop Builds
                </h2>
              </div>
              <Link
                href="/work"
                className="text-xs font-bold text-ink uppercase tracking-widest hover:text-red-400 transition-colors border-b border-red-500 pb-1"
              >
                View All Builds
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8. Closing CTA */}
      <ClosingCta
        heading="Have a Custom Build in Mind?"
        body="Tell us about your car and what styling or aero upgrade you're after — our master technicians will help you get the exact fitment right."
      />
    </div>
  );
}
