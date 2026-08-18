"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronRight, ChevronLeft, Sparkles } from "lucide-react";

const PLATFORMS = [
  {
    id: "verna",
    name: "Hyundai Verna",
    tagline: "Stealth Blackout Styling Kit",
    image: "/images/projects/verna_cover.webp",
    badge: "Sedan Styling",
    parts: [
      "Front Carbon Lip Splitter",
      "De-Chromed Front Grille",
      "Quad-Fin Rear Diffuser",
      "Satin Black Alloy Styling",
    ],
    link: "/work/2019-hyundai-verna-stealth-aero-edition",
  },
  {
    id: "sonet",
    name: "Kia Sonet",
    tagline: "GT-Line Aero Styling Kit",
    image: "/images/projects/sonet_cover.webp",
    badge: "Compact SUV",
    parts: [
      "Front Splitter with Winglets",
      "Dual-Tone Roof Styling",
      "Rally Roof Wing Spoiler",
      "Deep-Fin Rear Diffuser",
    ],
    link: "/work/2025-kia-sonet-gt-line-aero-package",
  },
  {
    id: "tiago",
    name: "Tata Tiago",
    tagline: "Street Sport Aero Package",
    image: "/images/projects/tiago_cover.webp",
    badge: "Hatchback",
    parts: [
      "Front Lip Splitter + Tie Rods",
      "Sport Roof Spoiler Wing",
      "Dual-Exit Rear Diffuser",
      "Custom White Tyre Lettering",
    ],
    link: "/work/2023-tata-tiago-jtp-track-look-build",
  },
  {
    id: "swift",
    name: "Maruti Suzuki Swift",
    tagline: "Full Street Aero Kit",
    image: "/images/projects/swift_cover.png",
    badge: "Hatchback",
    parts: [
      "V-Style Front Bumper Lip",
      "Side Skirt Extensions",
      "Quad-Fin Rear Diffuser",
      "Raised Tyre Lettering",
    ],
    link: "/work/2023-maruti-swift-full-aero-kit",
  },
  {
    id: "i20",
    name: "Hyundai i20 / N Line",
    tagline: "Blackout Performance Styling",
    image: "/images/projects/i20_cover.png",
    badge: "Hot Hatch",
    parts: [
      "Gloss Black Grille Trim",
      "Carbon Finish Mirror Covers",
      "Sequential LED Tail Lights",
      "Roof Blackout Styling",
    ],
    link: "/work/hyundai-i20-n-line-blackout-package",
  },
  {
    id: "polo",
    name: "Volkswagen Polo GT",
    tagline: "GT Street Styling Build",
    image: "/images/projects/polo_cover.png",
    badge: "Euro Hatch",
    parts: [
      "GT Rear Wing Spoiler",
      "Front Chin Lip Splitter",
      "Permanent Tyre Stickers",
      "Upgraded Audio Stage",
    ],
    link: "/work/volkswagen-polo-gt-track-look-build",
  },
] as const;

export function PlatformSelectorSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate active card index
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 380;
    const newIndex = Math.round(scrollLeft / (cardWidth + 24));
    setActiveIndex(Math.min(Math.max(newIndex, 0), PLATFORMS.length - 1));
  };

  useEffect(() => {
    checkScroll();
    const current = scrollRef.current;
    if (current) {
      current.addEventListener("scroll", checkScroll, { passive: true });
      window.addEventListener("resize", checkScroll);
      return () => {
        current.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, []);

  const scrollByAmount = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 380;
    const amount = direction === "left" ? -(cardWidth + 24) : cardWidth + 24;
    scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = scrollRef.current.firstElementChild?.clientWidth || 380;
    scrollRef.current.scrollTo({
      left: index * (cardWidth + 24),
      behavior: "smooth",
    });
  };

  return (
    <section
      id="platforms"
      className="py-24 max-w-screen-2xl mx-auto px-6 scroll-mt-12 relative overflow-hidden"
    >
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header Row with Arrows */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6 relative z-10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-black uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Popular Indian Cars
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-ink">
            Choose Your Car
          </h2>
          <p className="text-sm text-ink-muted max-w-lg mt-2 font-medium">
            Explore custom aerodynamic and styling packages made for popular Indian hatchbacks, sedans, and SUVs.
          </p>
        </div>

        {/* Carousel Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
              onClick={() => scrollByAmount("left")}
              disabled={!canScrollLeft}
              className="w-12 h-12 rounded-xl border border-hairline bg-surface hover:bg-hover hover:border-red-500 disabled:opacity-30 disabled:hover:border-hairline disabled:hover:bg-surface text-ink transition-all flex items-center justify-center shadow-lg cursor-pointer"
              aria-label="Previous platform"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scrollByAmount("right")}
              disabled={!canScrollRight}
              className="w-12 h-12 rounded-xl border border-hairline bg-surface hover:bg-hover hover:border-red-500 disabled:opacity-30 disabled:hover:border-hairline disabled:hover:bg-surface text-ink transition-all flex items-center justify-center shadow-lg cursor-pointer"
              aria-label="Next platform"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

      {/* Horizontal Carousel Track */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto pb-6 hide-scrollbar relative z-10 -mx-6 px-6 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none", touchAction: "pan-y" }}
      >
        {PLATFORMS.map((platform) => (
          <div
            key={platform.id}
            className="flex-none w-[85vw] sm:w-[380px] md:w-[420px] group border border-hairline bg-surface rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-500 flex flex-col justify-between shadow-xl hover:shadow-2xl hover:shadow-red-500/10"
          >
            <div>
              {/* Image Preview with Badges */}
              <div className="relative aspect-[16/10] bg-black overflow-hidden">
                <Image
                  src={platform.image}
                  alt={platform.name}
                  fill
                  sizes="(min-width: 768px) 420px, 85vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                {/* Top Category Badge */}
                <div className="absolute top-4 left-4 px-3 py-1 bg-black/70 backdrop-blur border border-white/20 rounded-full text-[10px] font-black text-red-500 uppercase tracking-widest">
                  {platform.badge}
                </div>

                {/* Bottom Car Header */}
                <div className="absolute bottom-4 left-5 right-5">
                  <div className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1 drop-shadow">
                    {platform.tagline}
                  </div>
                  <h3 className="text-xl font-black text-white uppercase tracking-tight drop-shadow-md">
                    {platform.name}
                  </h3>
                </div>
              </div>

              {/* Upgrades Included List */}
              <div className="p-6">
                <div className="text-[11px] font-bold text-ink-subtle uppercase tracking-widest mb-3.5">
                  Featured Upgrades Included:
                </div>
                <ul className="space-y-2.5 mb-6">
                  {platform.parts.map((part) => (
                    <li
                      key={part}
                      className="flex items-center gap-2.5 text-xs font-medium text-ink-muted group-hover:text-ink transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 text-red-500 flex-none" />
                      <span>{part}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action CTA Button */}
            <div className="px-6 pb-6 pt-0">
              <Link
                href={platform.link}
                className="w-full py-3.5 bg-surface-alt hover:bg-gradient-to-r hover:from-red-600 hover:to-red-700 border border-hairline text-ink hover:text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 group/btn shadow-md"
              >
                <span>View Full Build Details</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Slide Navigation Indicator Dots */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {PLATFORMS.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === activeIndex
                ? "w-8 bg-red-600"
                : "w-2 bg-surface-alt border border-hairline hover:bg-hover"
            }`}
            aria-label={`Jump to platform ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
