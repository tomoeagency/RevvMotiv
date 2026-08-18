import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Wrench, ShieldCheck, Cpu, Gauge } from "lucide-react";
import { getProjects } from "@/lib/api";
import { ProjectCard } from "@/app/components/ProjectCard";
import { ClosingCta } from "@/app/components/ClosingCta";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";

export const metadata: Metadata = {
  title: "About Us — RevvMotiv | Custom Car Styling & Aero Workshop",
  description:
    "Learn about RevvMotiv — an Indian automotive styling workshop dedicated to precision-fit carbon fiber parts, aerodynamic splitters, and custom exterior upgrades.",
};

const PILLARS = [
  {
    number: "01",
    icon: Cpu,
    title: "1:1 Vehicle Fitment",
    body: "Every splitter, diffuser, and spoiler is designed around factory bumper lines so that parts mount cleanly on OEM points without cutting.",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Durable Materials",
    body: "High-grade real carbon weave and impact-resistant ABS polymers, finished with deep UV-protective clear coats that withstand Indian heat and road dust.",
  },
  {
    number: "03",
    icon: Wrench,
    title: "In-House Quality Check",
    body: "We inspect every part for finish and alignment before it is packaged and dispatched, ensuring you get exactly what you ordered.",
  },
  {
    number: "04",
    icon: Gauge,
    title: "Safe Pan-India Shipping",
    body: "Every order is packaged with heavy-duty corner protection and dispatched via trusted courier partners with live tracking updates.",
  },
] as const;

const METRICS = [
  { value: "100%", label: "Fitment Guarantee" },
  { value: "Direct", label: "Bolt-On Mounting" },
  { value: "Pan-India", label: "Tracked Delivery" },
  { value: "Expert", label: "WhatsApp Support" },
] as const;

const WORKSHOP_HIGHLIGHTS = [
  {
    title: "The Workshop Build Team",
    role: "Crafting & Assembly",
    bio: "Our hands-on workshop team specializes in exterior styling, composite finishing, and custom car transformations for popular Indian platforms.",
    image: "/images/about/workshop.png",
  },
  {
    title: "Technical Fitment Desk",
    role: "Consultation & Support",
    bio: "Got questions on bumper compatibility, ground clearance, or installation? Our technicians guide you one-on-one before you place an order.",
    image: "/images/about/fitting.png",
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
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-3">
                Our Garage Story
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-6">
                Built for enthusiasts. <br />
                <span className="text-red-500">Made for Indian streets.</span>
              </h1>
              <p className="text-ink-muted text-base md:text-lg max-w-2xl leading-relaxed mb-8">
                RevvMotiv was founded by passionate car enthusiasts to bring clean styling, precision-fit aerodynamic splitters, and quality carbon accessories to India&apos;s tuning community — without the guesswork or poor fitment.
              </p>
              <div className="flex flex-wrap gap-4">
                <PrimaryCtaLink
                  href="/shop"
                  className="px-8 py-3.5 text-xs inline-flex items-center justify-center"
                >
                  Browse Catalog
                </PrimaryCtaLink>
                <Link
                  href="/work"
                  className="px-8 py-3.5 bg-surface hover:bg-surface-alt border border-hairline text-ink font-bold text-xs uppercase tracking-widest rounded transition-colors inline-flex items-center justify-center"
                >
                  View Builds
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-lg border border-hairline bg-surface overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/hero.png"
                  alt="RevvMotiv workshop tuning bay"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur border border-white/10 rounded text-xs text-white">
                  <span className="font-bold text-red-500 uppercase tracking-wider block mb-0.5">
                    RevvMotiv Workshop
                  </span>
                  Custom styling, fitment checks, and quality inspections.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Standards Band */}
      <section className="border-b border-hairline bg-surface-alt py-12">
        <div className="max-w-screen-2xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {METRICS.map((metric) => (
            <div key={metric.label} className="p-4">
              <div className="text-2xl md:text-4xl font-black text-ink tracking-tight mb-1">
                {metric.value}
              </div>
              <div className="text-xs font-bold text-ink-muted uppercase tracking-widest">
                {metric.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Our Craftsmanship */}
      <section className="max-w-screen-2xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/3] rounded-lg border border-hairline bg-surface overflow-hidden">
            <Image
              src="/images/about/workshop.png"
              alt="Quality check on carbon splitter"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-center"
            />
          </div>
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Our Craft & Approach
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6">
              Tested fitment. <br /> Zero guesswork.
            </h2>
            <p className="text-ink-muted text-base md:text-lg leading-relaxed mb-6">
              We design and curate exterior styling parts — splitters, diffusers, spoilers, and lighting — for drivers who want their cars to look sharper and stand out. Every part in our store is checked against factory bumper dimensions for proper mounting.
            </p>
            <p className="text-ink-muted text-base md:text-lg leading-relaxed mb-8">
              We believe in honest craftsmanship. What you see documented on our website represents real customer builds, photographed and fitted directly on Indian cars.
            </p>
            <div className="flex items-center gap-6 border-t border-hairline pt-6">
              <div>
                <div className="text-sm font-bold text-ink uppercase">Pan-India Delivery</div>
                <div className="text-xs text-ink-muted">Carefully packed & tracked to your door</div>
              </div>
              <div className="h-8 w-px bg-hairline" />
              <div>
                <div className="text-sm font-bold text-ink uppercase">WhatsApp Advice</div>
                <div className="text-xs text-ink-muted">Confirm compatibility before you order</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Workshop Team */}
      <section className="border-t border-hairline bg-surface-alt py-24">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Behind The Scenes
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              The RevvMotiv Team
            </h2>
            <p className="text-ink-muted text-sm md:text-base">
              Dedicated car enthusiasts and technicians focused on bringing clean automotive styling to your driveway.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {WORKSHOP_HIGHLIGHTS.map((team) => (
              <div
                key={team.title}
                className="group border border-hairline bg-surface rounded-lg overflow-hidden hover:border-red-500/40 transition-all duration-500"
              >
                <div className="relative aspect-[4/3] bg-carbon overflow-hidden">
                  <Image
                    src={team.image}
                    alt={team.title}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">
                      {team.title}
                    </h3>
                    <div className="text-xs font-bold text-red-500 uppercase tracking-widest">
                      {team.role}
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-ink-muted leading-relaxed">
                    {team.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. The 4 Quality Standards */}
      <section className="border-t border-b border-hairline bg-canvas py-24">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">
              Our 4 Quality Standards
            </h2>
            <p className="text-ink-muted text-sm md:text-base">
              From material selection to packaging and fitment checks, we maintain strict standards for every product.
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
