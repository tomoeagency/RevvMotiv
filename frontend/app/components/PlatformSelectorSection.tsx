import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

const PLATFORMS = [
  {
    id: "swift",
    name: "Maruti Suzuki Swift",
    tagline: "Track Look Aero & Interior Package",
    image: "/images/projects/swift_cover.png",
    parts: ["V-Style Carbon Front Lip", "Side Skirt Extensions", "Quad-Fin Diffuser", "Tyre Stickers"],
    link: "/work/2023-maruti-swift-full-aero-kit",
  },
  {
    id: "i20",
    name: "Hyundai i20 / N Line",
    tagline: "Fiery Blackout Aero Package",
    image: "/images/projects/i20_cover.png",
    parts: ["Gloss Black Grille", "Forged Carbon Mirrors", "OLED Tail Lights", "Roof Extension"],
    link: "/work/hyundai-i20-n-line-blackout-package",
  },
  {
    id: "polo",
    name: "Volkswagen Polo / Virtus",
    tagline: "GT Track Performance Build",
    image: "/images/projects/polo_cover.png",
    parts: ["GT Rear Wing Spoiler", "ABS Chin Splitter", "Component Audio", "High-Flow Exhaust"],
    link: "/work/volkswagen-polo-gt-track-look-build",
  },
] as const;

export function PlatformSelectorSection() {
  return (
    <section className="py-24 max-w-screen-2xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
        <div>
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
            Vehicle Platforms
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight">
            Select Your Platform
          </h2>
        </div>
        <p className="text-sm text-ink-muted max-w-md">
          Explore complete custom aero packages designed specifically for popular Indian tuner platforms.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {PLATFORMS.map((platform) => (
          <div
            key={platform.id}
            className="group border border-hairline bg-surface rounded-lg overflow-hidden hover:border-red-500/40 transition-all duration-500 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[4/3] bg-carbon overflow-hidden">
                <Image
                  src={platform.image}
                  alt={platform.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-6 right-6">
                  <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-1">
                    {platform.tagline}
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">
                    {platform.name}
                  </h3>
                </div>
              </div>

              <div className="p-6">
                <div className="text-xs font-bold text-ink-subtle uppercase tracking-widest mb-3">
                  Featured Upgrades Included:
                </div>
                <ul className="space-y-2 mb-6">
                  {platform.parts.map((part) => (
                    <li key={part} className="flex items-center gap-2 text-xs font-medium text-ink-muted">
                      <ChevronRight className="w-3.5 h-3.5 text-red-500 flex-none" />
                      <span>{part}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="px-6 pb-6 pt-0">
              <Link
                href={platform.link}
                className="w-full py-3 bg-surface-alt hover:bg-gradient-to-r hover:from-[var(--brand-red)] hover:to-[var(--brand-black)] border border-hairline text-ink hover:text-white font-bold text-xs uppercase tracking-widest rounded transition-all flex items-center justify-center gap-2 group/btn"
              >
                <span>View Full Build</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
