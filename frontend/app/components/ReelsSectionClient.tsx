"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { 
  Play, 
  Eye, 
  Heart, 
  MessageCircle, 
  Volume2, 
  VolumeX, 
  X, 
  Music2, 
  Car, 
  ArrowRight,
  Flame,
  ExternalLink,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { GARAGE_GALLERY, type GarageReel } from "@/lib/garage-gallery";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";
import { InstagramReelsRow } from "@/app/components/InstagramReelsRow";
import type { InstagramEmbed, InstagramMediaItem } from "@/lib/instagram";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

export interface UnifiedReel {
  id: string | number;
  title: string;
  category: string;
  car: string;
  image: string;
  videoUrl?: string;
  views: string;
  likes: string;
  comments: string;
  caption?: string;
  permalink?: string;
  tag: string;
  audio?: string;
  isLiveInstagram?: boolean;
}

export function ReelsSectionClient({
  embeds,
  liveMedia = [],
}: {
  embeds: InstagramEmbed[];
  liveMedia?: InstagramMediaItem[];
}) {
  const [activeReel, setActiveReel] = useState<UnifiedReel | null>(null);
  const [isLiked, setIsLiked] = useState<Record<string | number, boolean>>({});
  const [isMuted, setIsMuted] = useState(false);
  const [mediaItems, setMediaItems] = useState<InstagramMediaItem[]>(liveMedia);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mediaItems.length === 0) {
      fetch("/api/instagram")
        .then((r) => r.json())
        .then((res) => {
          if (res?.data && res.data.length > 0) {
            setMediaItems(res.data);
          }
        })
        .catch(() => {});
    }
  }, [mediaItems.length]);

  useEffect(() => {
    if (activeReel) {
      const timer = setTimeout(() => {
        window.instgrm?.Embeds?.process();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [activeReel]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const scrollAmount = container.clientWidth * 0.85;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const toggleLike = (id: string | number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Convert live Instagram media or static gallery into unified reel cards
  const unifiedReels: UnifiedReel[] = mediaItems.length > 0
    ? mediaItems.map((item) => {
        const rawImage = item.proxy_image || (item.thumbnail_url 
          ? `/api/instagram/image?url=${encodeURIComponent(item.thumbnail_url)}` 
          : item.media_url 
            ? `/api/instagram/image?url=${encodeURIComponent(item.media_url)}` 
            : "/hero-1-ai.jpg");

        const firstLine = item.caption ? item.caption.split("\n")[0] : "Workshop Custom Build";
        const hashtagMatch = item.caption?.match(/#([a-zA-Z0-9_-]+)/);
        const tag = item.tag || (hashtagMatch ? `#${hashtagMatch[1].toUpperCase()}` : "#REVVMOTIV");

        return {
          id: item.id,
          title: firstLine,
          category: item.media_type === "VIDEO" ? "Reel Video" : "Build Post",
          car: "Bespoke Workshop Build",
          image: rawImage,
          videoUrl: item.media_type === "VIDEO" ? item.media_url : undefined,
          views: item.views || "24.5k",
          likes: item.likes || "1.4k",
          comments: item.comments || "48",
          caption: item.caption || firstLine,
          permalink: item.permalink,
          tag,
          audio: "@revvmotiv • Original Audio",
          isLiveInstagram: true,
        };
      })
    : GARAGE_GALLERY.map((g) => ({
        id: g.id,
        title: g.title,
        category: g.category,
        car: g.car,
        image: g.img,
        views: g.views,
        likes: g.likes,
        comments: g.comments,
        caption: g.description,
        tag: g.tag,
        audio: g.audio,
        isLiveInstagram: false,
      }));

  return (
    <section id="from-our-garage" className="border-t border-hairline py-12 sm:py-20 md:py-24 bg-surface-alt relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/5 blur-[140px] pointer-events-none rounded-full" />

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header with Live Badge & Instagram Handle & Scroll Arrows */}
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
            className="flex items-center gap-3"
          >
            {/* Horizontal Scroll Arrows on Desktop & Tablet */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleScroll("left")}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface border border-hairline hover:border-red-500/60 hover:bg-neutral-900 text-ink flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                title="Previous Reels"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScroll("right")}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-surface border border-hairline hover:border-red-500/60 hover:bg-neutral-900 text-ink flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105"
                title="Next Reels"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            <a
              href="https://instagram.com/revvmotiv"
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

        {/* If live embeds exist, show them; else render single-line side-scrolling cards */}
        {embeds.length > 0 ? (
          <InstagramReelsRow embeds={embeds} />
        ) : (
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 pt-1 gap-5 snap-x snap-mandatory hide-scrollbar touch-pan-x touch-pan-y scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {unifiedReels.map((reel) => (
              <div
                key={reel.id}
                onClick={() => setActiveReel(reel)}
                className="flex-none w-[75vw] max-w-[280px] sm:w-[calc(50%-12px)] sm:max-w-none md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] snap-start group relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-950 border border-hairline hover:border-red-500/60 shadow-xl hover:shadow-2xl hover:shadow-red-600/20 transition-all duration-500 cursor-pointer flex flex-col justify-between p-4"
              >
                {/* Background Thumbnail Image with Direct Fallback & No-Referrer */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={reel.image}
                  alt={reel.title}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/60 z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors duration-500 z-10 pointer-events-none" />

                {/* TOP BAR: Tag & Live Views */}
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

                {/* BOTTOM INFO: Title, Category, Engagement */}
                <div className="relative z-20 space-y-2">
                  {/* Category */}
                  <div className="flex items-center gap-1 text-[11px] font-bold text-red-400 uppercase tracking-wide">
                    <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    <span>{reel.isLiveInstagram ? "@revvmotiv" : reel.category}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-black text-white leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
                    {reel.title}
                  </h3>

                  {/* Audio Track */}
                  {reel.audio && (
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 pt-1 border-t border-white/10">
                      <Music2 className="w-3 h-3 text-neutral-400 flex-none" />
                      <span className="truncate">{reel.audio}</span>
                    </div>
                  )}

                  {/* Quick Action Counters */}
                  <div className="flex items-center justify-between pt-1 text-[11px] text-neutral-300">
                    <button
                      type="button"
                      onClick={(e) => toggleLike(reel.id, e)}
                      className="flex items-center gap-1 hover:text-red-400 transition-colors cursor-pointer"
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
              </div>
            ))}
          </div>
        )}
      </div>

      {/* IN-PAGE REEL MODAL / LIGHTBOX VIEWER */}
      <AnimatePresence>
        {activeReel && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md"
            onClick={() => setActiveReel(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[360px] sm:max-w-[420px] h-[82vh] sm:h-[86vh] max-h-[760px] bg-black rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between"
            >
              {/* TOP FLOATING CLOSE BAR */}
              <div className="relative z-30 flex items-center justify-between p-3 bg-gradient-to-b from-black/90 via-black/50 to-transparent">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs border border-white/40 shadow-sm">
                    RM
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-black text-white leading-none">
                        @revvmotiv
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                    </div>
                    <span className="text-[10px] text-neutral-300 font-mono">
                      {activeReel.tag}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveReel(null)}
                    className="p-1.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors border border-white/20 cursor-pointer shadow-md"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* CENTER: PLAYABLE INSTAGRAM BLOCKQUOTE EMBED */}
              <div className="relative flex-1 w-full h-full bg-black overflow-y-auto hide-scrollbar flex flex-col items-center justify-start p-2">
                <Script
                  src="https://www.instagram.com/embed.js"
                  strategy="lazyOnload"
                  onLoad={() => window.instgrm?.Embeds?.process()}
                />

                {activeReel.permalink ? (
                  <div key={activeReel.id} className="w-full flex flex-col items-center justify-center my-auto">
                    <blockquote
                      className="instagram-media"
                      data-instgrm-permalink={activeReel.permalink}
                      data-instgrm-version="14"
                      style={{
                        background: "#000",
                        border: 0,
                        borderRadius: "12px",
                        boxShadow: "none",
                        margin: "0 auto",
                        maxWidth: "380px",
                        minWidth: "280px",
                        padding: 0,
                        width: "100%",
                      }}
                    >
                      <div className="p-4 text-center text-white flex flex-col items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={activeReel.image}
                          alt={activeReel.title}
                          referrerPolicy="no-referrer"
                          crossOrigin="anonymous"
                          className="w-full aspect-[9/16] max-h-[420px] object-cover rounded-xl border border-white/10"
                        />
                        <a
                          href={activeReel.permalink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-colors inline-flex items-center gap-2 shadow-lg"
                        >
                          <Play className="w-4 h-4 fill-white" />
                          <span>Watch Reel on Instagram</span>
                        </a>
                      </div>
                    </blockquote>
                  </div>
                ) : (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeReel.image}
                      alt={activeReel.title}
                      referrerPolicy="no-referrer"
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover object-center pointer-events-none rounded-xl"
                    />
                  </>
                )}
              </div>

              {/* BOTTOM FLOATING ACTION BAR: Shop & WhatsApp */}
              <div className="relative z-30 p-3.5 bg-neutral-950 border-t border-white/10 flex flex-col gap-2 shadow-2xl">
                <div className="flex gap-2">
                  <PrimaryCtaLink
                    href="/shop"
                    onClick={() => setActiveReel(null)}
                    className="flex-1 py-2.5 px-3 text-xs text-center flex items-center justify-center gap-1.5 shadow-lg"
                  >
                    <span>Shop Custom Parts</span>
                    <ArrowRight className="w-4 h-4" />
                  </PrimaryCtaLink>
                  
                  <a
                    href={`https://wa.me/919999999999?text=${encodeURIComponent(`Hi RevvMotiv! I want to order/enquire about this setup: ${activeReel.title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    title="Enquire on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-red-400" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
