"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Volume2,
  VolumeX,
  X,
  Music2,
  ArrowRight,
  Flame,
  ExternalLink,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  ShoppingBag
} from "lucide-react";
import { GARAGE_GALLERY } from "@/lib/garage-gallery";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";
import { useSwipeNavigation } from "@/lib/useSwipeNavigation";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";

export interface CustomReelProduct {
  id: number;
  title: string;
  slug: string;
  price: string | number;
  compare_at_price?: string | number | null;
  primary_image_url?: string | null;
}

export interface CustomReelItem {
  id: string | number;
  title: string;
  car?: string;
  category?: string;
  tag?: string;
  video_url: string;
  thumbnail_url?: string | null;
  caption?: string | null;
  instagram_url?: string | null;
  product?: CustomReelProduct | null;
}

export interface UnifiedReel {
  id: string | number;
  title: string;
  category: string;
  car: string;
  image: string;
  videoUrl: string;
  caption?: string;
  instagramUrl?: string;
  tag: string;
  audio?: string;
  product?: CustomReelProduct | null;
}

export function ReelsSectionClient() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [customReels, setCustomReels] = useState<CustomReelItem[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Convert admin-uploaded reels into unified cards; fall back to the
  // static garage gallery showcase when no reels have been added yet.
  // Memoized on customReels — without this, a fresh array (with fresh
  // object references) was built on every render, including the ones
  // triggered by the playback progress bar's onTimeUpdate (~4x/sec). That
  // gave activeReel a new reference each time, which retriggered the
  // "reset video to 0 and play" effect below constantly — the video never
  // got past its first couple of frames before being restarted.
  const unifiedReels: UnifiedReel[] = useMemo(
    () =>
      customReels.length > 0
        ? customReels.map((r, i) => ({
            id: r.id,
            title: r.title,
            category: r.category || "Live Workshop Reel",
            car: r.car || "Bespoke Workshop Build",
            image: r.thumbnail_url || `/hero-${(i % 5) + 1}-ai.jpg`,
            videoUrl: r.video_url,
            caption: r.caption || r.title,
            instagramUrl: r.instagram_url || undefined,
            tag: r.tag || "#REVVMOTIV",
            audio: "@revvmotiv • Original Audio",
            product: r.product,
          }))
        : GARAGE_GALLERY.map((g) => ({
            id: g.id,
            title: g.title,
            category: g.category,
            car: g.car,
            image: g.img,
            videoUrl: "",
            caption: g.description,
            tag: g.tag,
            audio: g.audio,
          })),
    [customReels]
  );

  const activeReel = activeIndex !== null ? unifiedReels[activeIndex] ?? null : null;

  const closeReel = () => setActiveIndex(null);
  const goToNext = () =>
    setActiveIndex((i) => (i === null ? null : (i + 1) % unifiedReels.length));
  const goToPrev = () =>
    setActiveIndex((i) => (i === null ? null : (i - 1 + unifiedReels.length) % unifiedReels.length));

  const swipeHandlers = useSwipeNavigation({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
    onSwipeDown: closeReel,
  });

  // Fetch admin-uploaded reels from the Laravel API — the only source of
  // reel content now (no live Instagram fetch fallback).
  useEffect(() => {
    fetch("/api/v1/reels")
      .then((r) => r.json())
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setCustomReels(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Handle active video playback on modal open
  useEffect(() => {
    if (activeReel) {
      setIsPlaying(true);
      setProgress(0);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [activeReel]);

  // Escape to close, arrow keys to navigate, body scroll lock while open —
  // same pattern GalleryLightbox uses.
  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Escape") closeReel();
      if (e.key === "ArrowRight") goToNext();
      if (e.key === "ArrowLeft") goToPrev();
    }
    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeydown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

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

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(current);
    }
  };

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

        <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-6 pt-1 gap-5 snap-x snap-mandatory hide-scrollbar touch-pan-x touch-pan-y scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            {unifiedReels.map((reel, index) => (
              <div
                key={reel.id}
                onClick={() => setActiveIndex(index)}
                className="flex-none w-[75vw] max-w-[280px] sm:w-[calc(50%-12px)] sm:max-w-none md:w-[calc(33.333%-14px)] lg:w-[calc(25%-15px)] snap-start group relative aspect-[9/16] rounded-2xl overflow-hidden bg-neutral-950 border border-white/10 hover:border-red-500/70 shadow-[0_8px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_12px_40px_rgba(220,38,38,0.25)] transition-all duration-500 cursor-pointer flex flex-col justify-between p-4"
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

                {/* Gradient Overlays — deeper at the bottom for stronger
                    text contrast, subtle brand tint on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20 z-10 pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors duration-500 z-10 pointer-events-none" />

                {/* TOP BAR: Tag */}
                <div className="relative z-20 flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-black uppercase tracking-wider text-white">
                    {reel.tag}
                  </span>
                </div>

                {/* CENTER: Floating Play Icon Button with ambient pulse ring */}
                <div className="relative z-20 self-center my-auto flex items-center justify-center">
                  <span className="absolute w-14 h-14 rounded-full bg-red-600/40 animate-ping motion-reduce:animate-none [animation-duration:2.2s]" />
                  <div className="relative w-14 h-14 rounded-full bg-red-600/90 group-hover:bg-red-600 text-white flex items-center justify-center shadow-[0_0_25px_rgba(220,38,38,0.5)] group-hover:scale-110 transition-all duration-300 backdrop-blur-sm border border-white/30">
                    <Play className="w-6 h-6 fill-white ml-0.5" />
                  </div>
                </div>

                {/* BOTTOM INFO: Title & Category */}
                <div className="relative z-20 space-y-2">
                  {/* Category */}
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 uppercase tracking-widest">
                    <Flame className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                    <span>{reel.category}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-black text-white leading-snug group-hover:text-red-400 transition-colors line-clamp-2">
                    {reel.title}
                  </h3>

                  {/* Audio Track */}
                  {reel.audio && (
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 pt-1.5 border-t border-white/10">
                      <Music2 className="w-3 h-3 text-neutral-400 flex-none" />
                      <span className="truncate">{reel.audio}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
      </div>

      {/* IN-PAGE REAL VIDEO MODAL / LIGHTBOX VIEWER */}
      <AnimatePresence>
        {activeReel && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md"
            onClick={closeReel}
            onTouchStart={swipeHandlers.onTouchStart}
            onTouchEnd={swipeHandlers.onTouchEnd}
          >
            {unifiedReels.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrev();
                  }}
                  aria-label="Previous reel"
                  className="hidden sm:flex absolute left-4 lg:left-10 text-white/70 hover:text-white transition-colors z-10"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNext();
                  }}
                  aria-label="Next reel"
                  className="hidden sm:flex absolute right-4 lg:right-10 text-white/70 hover:text-white transition-colors z-10"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-[360px] sm:max-w-[420px] aspect-[9/16] max-h-[88vh] bg-neutral-950 rounded-2xl overflow-hidden border border-white/20 shadow-2xl flex flex-col justify-between"
            >
              {/* REAL HTML5 VIDEO PLAYER (IF VIDEO URL EXISTS) OR AUTHENTIC COVER */}
              <div 
                className="absolute inset-0 w-full h-full bg-neutral-950 cursor-pointer group"
                onClick={activeReel.videoUrl ? togglePlayPause : undefined}
              >
                {activeReel.videoUrl ? (
                  <video
                    ref={videoRef}
                    src={activeReel.videoUrl}
                    autoPlay
                    loop
                    muted={isMuted}
                    playsInline
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-cover object-center"
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={activeReel.image}
                    alt={activeReel.title}
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                
                {/* Dark Gradient Overlay for legible text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-black/70 pointer-events-none" />

                {/* Pause/Play Center Overlay Icon if video */}
                {activeReel.videoUrl && !isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-16 h-16 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-2xl backdrop-blur-sm border border-white/40 animate-scale">
                      <Play className="w-8 h-8 fill-white ml-1" />
                    </div>
                  </div>
                )}
              </div>

              {/* TOP FLOATING HEADER: Profile, Sound Toggle & Close */}
              <div className="relative z-30 flex items-center justify-between p-3 sm:p-4 pointer-events-none">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-black text-xs border border-white/40 shadow-sm">
                    RM
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-white block leading-none">
                      @revvmotiv
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  </div>
                </div>

                <div className="flex items-center gap-2 pointer-events-auto">
                  {activeReel.videoUrl && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsMuted(!isMuted);
                      }}
                      className="p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors border border-white/20 cursor-pointer shadow-md"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-white" />}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeReel();
                    }}
                    className="p-2 rounded-full bg-black/60 text-white hover:bg-red-600 transition-colors border border-white/20 cursor-pointer shadow-md"
                    title="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* BOTTOM FLOATING CONTROLS & SHOP CTAS */}
              <div className="relative z-30 p-4 space-y-3 bg-gradient-to-t from-black via-black/90 to-transparent">
                {/* Live Progress Bar (if video) */}
                {activeReel.videoUrl && (
                  <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                    <div 
                      className="bg-red-500 h-full transition-all duration-100 ease-linear"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}

                {/* Caption / Title — only show caption as a second line when it
                    actually adds something beyond the title (avoids the
                    same text appearing twice, which read as cluttered) */}
                <div className="max-h-20 overflow-y-auto hide-scrollbar space-y-1">
                  <h4 className="text-sm font-black text-white leading-snug">
                    {activeReel.title}
                  </h4>
                  {activeReel.caption && activeReel.caption !== activeReel.title && (
                    <p className="text-xs text-neutral-300 leading-relaxed line-clamp-2">
                      {activeReel.caption}
                    </p>
                  )}
                </div>

                {/* Action CTAs */}
                <div className="pt-1 flex flex-col gap-2">
                  <div className="flex gap-2">
                    {activeReel.product ? (
                      <PrimaryCtaLink
                        href={`/products/${activeReel.product.slug}`}
                        onClick={closeReel}
                        className="flex-1 py-2.5 px-3 text-xs text-center flex items-center justify-center gap-1.5 shadow-lg"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Shop This Product</span>
                        <ArrowRight className="w-4 h-4" />
                      </PrimaryCtaLink>
                    ) : (
                      <PrimaryCtaLink
                        href="/shop"
                        onClick={closeReel}
                        className="flex-1 py-2.5 px-3 text-xs text-center flex items-center justify-center gap-1.5 shadow-lg"
                      >
                        <span>Shop Custom Parts</span>
                        <ArrowRight className="w-4 h-4" />
                      </PrimaryCtaLink>
                    )}
                    
                    <a
                      href={`https://wa.me/918368343232?text=${encodeURIComponent(`Hi RevvMotiv! I want to order/enquire about this setup: ${activeReel.title}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3.5 py-2.5 rounded bg-neutral-900 hover:bg-neutral-800 border border-white/20 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Enquire on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-red-400" />
                      <span>WhatsApp</span>
                    </a>
                  </div>

                  {activeReel.instagramUrl && (
                    <div className="text-center pt-0.5">
                      <a
                        href={activeReel.instagramUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] text-neutral-400 hover:text-red-400 transition-colors"
                      >
                        <span>View on Instagram</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
