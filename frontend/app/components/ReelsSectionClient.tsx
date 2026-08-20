"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { 
  Play, 
  Eye, 
  Heart, 
  MessageCircle, 
  Volume2, 
  VolumeX, 
  X, 
  Music2, 
  Sparkles, 
  ArrowRight,
  Flame,
  Film
} from "lucide-react";
import { GARAGE_GALLERY, type GarageReel } from "@/lib/garage-gallery";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";
import { InstagramReelsRow } from "@/app/components/InstagramReelsRow";
import type { InstagramEmbed } from "@/lib/instagram";

export function ReelsSectionClient({ embeds }: { embeds: InstagramEmbed[] }) {
  const [activeReel, setActiveReel] = useState<GarageReel | null>(null);
  const [isLiked, setIsLiked] = useState<Record<number, boolean>>({});
  const [isMuted, setIsMuted] = useState(false);

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section id="from-our-garage" className="border-t border-hairline py-12 sm:py-20 md:py-24 bg-surface-alt relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header with Live Badge & Instagram Handle */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: MOTION_DURATION.page, ease: MOTION_EASE_BRAND }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/25 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-black text-red-500 uppercase tracking-widest">
                Live From The Tuning Bay
              </span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-ink uppercase tracking-tight leading-[0.95]">
              From Our Garage <span className="text-red-500">•</span> Reels
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-2 sm:mt-3 max-w-xl leading-relaxed">
              Watch real installations, acoustic exhaust sound checks, and aerodynamic test runs straight from our workshop floor.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
          >
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full bg-surface border border-hairline hover:border-red-500/50 hover:bg-neutral-900 transition-all text-xs font-bold text-ink shadow-sm group"
            >
              <svg className="w-4 h-4 text-red-500 group-hover:scale-110 transition-transform fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>Follow @revvmotiv</span>
            </a>
          </motion.div>
        </div>

        {/* If live embeds exist, show them; else render interactive Reel Cards with horizontal swipe on mobile */}
        {embeds.length > 0 ? (
          <InstagramReelsRow embeds={embeds} />
        ) : (
          <div data-lenis-prevent className="flex overflow-x-auto pb-4 pt-1 gap-4 snap-x snap-mandatory hide-scrollbar touch-pan-x overscroll-x-contain sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6 -mx-4 px-4 sm:mx-0 sm:px-0">
            {GARAGE_GALLERY.map((reel, i) => (
              <motion.div
                key={reel.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
                whileHover={{ y: -8 }}
                onClick={() => setActiveReel(reel)}
                className="flex-none w-[72vw] max-w-[260px] sm:w-auto snap-start group relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-950 border border-hairline hover:border-red-500/60 shadow-xl hover:shadow-2xl hover:shadow-red-600/20 transition-all duration-500 cursor-pointer flex flex-col justify-between p-4"
              >
                {/* Background Thumbnail Image */}
                <Image
                  src={reel.img}
                  alt={reel.title}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/60 z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors duration-500 z-10 pointer-events-none" />

                {/* TOP BAR: Tag, Duration & Views */}
                <div className="relative z-20 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-black uppercase tracking-wider text-white">
                    {reel.tag}
                  </span>
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-bold text-neutral-200">
                    <Eye className="w-3 h-3 text-red-400" />
                    <span>{reel.views}</span>
                  </div>
                </div>

                {/* CENTER: Floating Play Icon Button */}
                <div className="relative z-20 self-center my-auto">
                  <div className="w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-600/40 group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/30">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* BOTTOM INFO: Title, Car Model, Audio & Engagement */}
                <div className="relative z-20 space-y-2">
                  {/* Category Pill */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-red-400 uppercase tracking-wide">
                    <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    <span>{reel.category}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-black text-white leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
                    {reel.title}
                  </h3>

                  {/* Car Platform */}
                  <p className="text-xs text-neutral-300 font-medium">
                    {reel.car}
                  </p>

                  {/* Audio Track marquee look */}
                  <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 pt-1 border-t border-white/10">
                    <Music2 className="w-3 h-3 text-neutral-400 flex-none" />
                    <span className="truncate">{reel.audio}</span>
                  </div>

                  {/* Quick Action Counters */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-300">
                    <button
                      type="button"
                      onClick={(e) => toggleLike(reel.id, e)}
                      className="flex items-center gap-1 hover:text-red-400 transition-colors"
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked[reel.id] ? "fill-red-500 text-red-500" : ""}`} />
                      <span>{isLiked[reel.id] ? "Liked" : reel.likes}</span>
                    </button>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{reel.comments}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* REEL FULLSCREEN / MODAL PLAYER */}
      <AnimatePresence>
        {activeReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm aspect-[9/16] max-h-[90vh] bg-neutral-950 rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between p-5"
            >
              {/* Modal Background */}
              <Image
                src={activeReel.img}
                alt={activeReel.title}
                fill
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/80 z-10" />

              {/* TOP HEADER: Profile, Close & Mute */}
              <div className="relative z-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs border border-white/40">
                    RM
                  </div>
                  <div>
                    <span className="text-xs font-black text-white block leading-none">
                      revvmotiv
                    </span>
                    <span className="text-[10px] text-neutral-300">
                      {activeReel.category}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMuted(!isMuted)}
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveReel(null)}
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/20"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* BOTTOM DETAILS & CTA */}
              <div className="relative z-20 space-y-3">
                {/* Simulated playback bar */}
                <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full w-2/3 animate-pulse" />
                </div>

                <h4 className="text-lg font-black text-white leading-tight">
                  {activeReel.title}
                </h4>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {activeReel.description}
                </p>

                <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                  <Sparkles className="w-3.5 h-3.5 text-red-400" />
                  <span>Platform: {activeReel.car}</span>
                </div>

                <div className="pt-2 flex gap-2">
                  <Link
                    href="/shop"
                    onClick={() => setActiveReel(null)}
                    className="flex-1 py-3 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider text-center flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition-all"
                  >
                    <span>Shop This Setup</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={(e) => toggleLike(activeReel.id, e)}
                    className={`px-4 py-3 rounded-xl border border-white/20 flex items-center justify-center transition-colors ${
                      isLiked[activeReel.id] ? "bg-red-600 text-white" : "bg-black/60 text-white hover:bg-black/80"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isLiked[activeReel.id] ? "fill-white" : ""}`} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
