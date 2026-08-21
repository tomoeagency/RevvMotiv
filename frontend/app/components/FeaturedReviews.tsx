"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Quote, Camera, X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Review } from "@/lib/api";
import { parseReviewComment } from "@/lib/api";
import { StarRating } from "@/app/components/StarRating";

function ReviewCard({
  review,
  onImageClick,
}: {
  review: Review;
  onImageClick: (url: string, name: string) => void;
}) {
  const photoUrl =
    review.media_urls && Array.isArray(review.media_urls) && review.media_urls.length > 0
      ? review.media_urls[0].replace(/^https?:\/\/api\.revvmotiv\.com/, "")
      : null;

  const { carModel, comment: cleanComment } = parseReviewComment(review.comment);

  // Generate 2-letter avatar initials
  const initials = (review.customer_name || "Driver")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="group/card relative z-0 hover:z-30 flex-none w-[82vw] max-w-[340px] sm:w-[400px] h-[290px] sm:h-[330px] bg-surface border border-hairline rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-lg transition-all duration-300 ease-[var(--ease-brand)] hover:shadow-2xl hover:shadow-red-500/20 hover:border-red-500/50">
      {/* Background ambient red glow on hover */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-red-500/10 rounded-full blur-2xl pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

      {/* 1. Header: Stars + Car Badge + Quote Mark */}
      <div className="flex items-center justify-between flex-none mb-2 sm:mb-3 gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <StarRating rating={review.rating} />
          {carModel && (
            <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-[10px] font-black text-red-500 uppercase tracking-wider">
              {carModel}
            </span>
          )}
        </div>
        <Quote className="w-5 h-5 sm:w-6 sm:h-6 text-hairline-strong group-hover/card:text-red-500/40 transition-colors flex-none" />
      </div>

      {/* 2. Full Review Comment Text (Cleaned without [Car: ...] technical brackets) */}
      <div className="flex-1 flex items-start py-1">
        <p className="text-xs sm:text-sm text-ink-muted group-hover/card:text-ink leading-relaxed font-normal transition-colors duration-200 line-clamp-4 sm:line-clamp-none">
          &ldquo;{cleanComment}&rdquo;
        </p>
      </div>

      {/* 3. Footer: Driver Info + Build Photo Pill */}
      <div className="pt-3.5 border-t border-hairline flex items-center justify-between gap-3 flex-none">
        {/* Driver Avatar & Name */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-red-600 to-slate-900 flex items-center justify-center text-[11px] font-bold text-white shadow-sm flex-none">
            {initials}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-ink truncate block">
              {review.customer_name}
            </span>
            {review.product ? (
              <span className="text-[10px] font-semibold text-red-500 truncate block">
                <Link href={`/products/${review.product.slug}`} className="hover:text-red-400 transition-colors">
                  {review.product.title}
                </Link>
              </span>
            ) : carModel ? (
              <span className="text-[10px] font-medium text-ink-muted block">{carModel} Build</span>
            ) : (
              <span className="text-[10px] text-ink-muted block">Verified Buyer</span>
            )}
          </div>
        </div>

        {/* Build Photo Thumbnail Pill */}
        {photoUrl && (
          <button
            type="button"
            onClick={() => onImageClick(photoUrl, review.customer_name)}
            title="Click to view full build photo"
            className="group/thumb relative flex-none h-10 w-10 rounded-lg border border-hairline-strong overflow-hidden bg-surface-alt shadow-sm hover:scale-110 hover:border-red-500 transition-all cursor-pointer"
          >
            <Image
              src={photoUrl}
              alt={`Photo by ${review.customer_name}`}
              fill
              sizes="40px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity">
              <Camera className="w-3.5 h-3.5 text-white" />
            </div>
          </button>
        )}
      </div>
    </div>
  );
}

export function FeaturedReviews({ reviews: initialReviews = [] }: { reviews?: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews || []);
  const [activePhoto, setActivePhoto] = useState<{ url: string; name: string } | null>(null);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  useEffect(() => {
    if (initialReviews && initialReviews.length > 0) {
      setReviews(initialReviews);
      return;
    }

    fetch("/api/v1/reviews/featured")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((body) => {
        if (body.data && Array.isArray(body.data)) {
          setReviews(body.data);
        }
      })
      .catch(() => {});
  }, [initialReviews]);

  const checkMobileScroll = () => {
    if (!mobileScrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = mobileScrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    const cardWidth = mobileScrollRef.current.firstElementChild?.clientWidth || 300;
    const newIdx = Math.round(scrollLeft / (cardWidth + 16));
    setActiveMobileIndex(Math.min(Math.max(newIdx, 0), reviews.length - 1));
  };

  const scrollMobile = (direction: "left" | "right") => {
    if (!mobileScrollRef.current) return;
    const cardWidth = mobileScrollRef.current.firstElementChild?.clientWidth || 300;
    const amount = direction === "left" ? -(cardWidth + 16) : cardWidth + 16;
    mobileScrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  const scrollMobileToIndex = (index: number) => {
    if (!mobileScrollRef.current) return;
    const cardWidth = mobileScrollRef.current.firstElementChild?.clientWidth || 300;
    mobileScrollRef.current.scrollTo({
      left: index * (cardWidth + 16),
      behavior: "smooth",
    });
  };

  if (!reviews || reviews.length === 0) return null;
  const canLoop = reviews.length >= 4;

  const handleImageClick = (url: string, name: string) => {
    setActivePhoto({ url, name });
  };

  return (
    <section className="border-t border-hairline py-12 sm:py-20 md:py-24 bg-surface-alt overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-6 sm:mb-12 flex flex-row items-end justify-between gap-3 sm:gap-4">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1.5 sm:mb-2">
              Customer Feedback
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-ink uppercase tracking-tight">
              What Drivers Are Saying
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mt-1 sm:mt-1.5">
              Real feedback and installation photos from car owners across India.
            </p>
          </div>

          {/* Mobile Navigation Buttons (< md) */}
          <div className="flex md:hidden items-center gap-1.5 flex-none">
            <button
              type="button"
              onClick={() => scrollMobile("left")}
              disabled={!canScrollLeft}
              className="w-9 h-9 rounded-xl border border-hairline bg-surface hover:bg-hover hover:border-red-500 disabled:opacity-30 text-ink transition-all flex items-center justify-center cursor-pointer shadow-2xs"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scrollMobile("right")}
              disabled={!canScrollRight}
              className="w-9 h-9 rounded-xl border border-hairline bg-surface hover:bg-hover hover:border-red-500 disabled:opacity-30 text-ink transition-all flex items-center justify-center cursor-pointer shadow-2xs"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-ink-muted font-medium hidden md:block">
            Tested &amp; delivered to drivers across India
          </div>
        </div>

        {/* 1. MOBILE TRACK: Manual Swipeable Track (NO AUTOSCROLL) */}
        <div className="md:hidden">
          <div
            ref={mobileScrollRef}
            onScroll={checkMobileScroll}
            className="flex items-center gap-4 overflow-x-auto hide-scrollbar pb-4 pt-1 snap-x snap-mandatory touch-pan-x touch-pan-y -mx-4 px-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none", WebkitOverflowScrolling: "touch" }}
          >
            {reviews.map((review) => (
              <div key={`mobile-${review.id}`} className="snap-start flex-none">
                <ReviewCard
                  review={review}
                  onImageClick={handleImageClick}
                />
              </div>
            ))}
          </div>

          {/* Mobile Slide Dots */}
          <div className="flex items-center justify-center gap-1 mt-4">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => scrollMobileToIndex(i)}
                className="p-2 flex items-center justify-center focus:outline-hidden touch-manipulation cursor-pointer"
                aria-label={`Go to review ${i + 1}`}
              >
                <span
                  className={`h-1.5 rounded-full transition-[width,background-color] duration-300 block ${
                    i === activeMobileIndex
                      ? "w-6 bg-red-600"
                      : "w-2 bg-surface border border-hairline hover:bg-hover"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* 2. DESKTOP TRACK: Smooth Continuous Marquee (hidden on mobile) */}
        <div className="hidden md:block">
          {canLoop ? (
            <div className="group/marquee overflow-hidden py-8 -my-8">
              <div
                className="flex items-center gap-6 w-max animate-marquee group-hover/marquee:[animation-play-state:paused]"
                style={{ animationDuration: `${reviews.length * 6}s` }}
              >
                {reviews.map((review) => (
                  <ReviewCard
                    key={`orig-${review.id}`}
                    review={review}
                    onImageClick={handleImageClick}
                  />
                ))}
                {reviews.map((review) => (
                  <ReviewCard
                    key={`copy-${review.id}`}
                    review={review}
                    onImageClick={handleImageClick}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar pb-6 pt-2 snap-x snap-mandatory">
              {reviews.map((review) => (
                <div key={review.id} className="snap-center">
                  <ReviewCard
                    review={review}
                    onImageClick={handleImageClick}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Photo Lightbox Popup */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 animate-scaleIn"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full max-h-[85vh] bg-surface rounded-2xl border border-hairline overflow-hidden flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-4 border-b border-hairline bg-surface">
              <span className="text-xs font-bold text-ink">
                Build Photo by {activePhoto.name}
              </span>
              <button
                onClick={() => setActivePhoto(null)}
                className="text-ink-muted hover:text-ink transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-video sm:aspect-[4/3] w-full bg-black">
              <Image
                src={activePhoto.url}
                alt={`Customer build by ${activePhoto.name}`}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
