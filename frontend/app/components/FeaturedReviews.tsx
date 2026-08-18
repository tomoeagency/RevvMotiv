"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Quote, Camera, Sparkles, X, ChevronRight } from "lucide-react";
import type { Review } from "@/lib/api";
import { StarRating } from "@/app/components/StarRating";

function ReviewCard({
  review,
  onImageClick,
  onReadMore,
}: {
  review: Review;
  onImageClick: (url: string, name: string) => void;
  onReadMore: (review: Review) => void;
}) {
  const photoUrl =
    review.media_urls && Array.isArray(review.media_urls) && review.media_urls.length > 0
      ? review.media_urls[0].replace(/^https?:\/\/api\.revvmotiv\.com/, "")
      : null;

  // Generate 2-letter avatar initials
  const initials = (review.customer_name || "Driver")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  const isLongReview = (review.comment || "").length > 130;

  return (
    <div 
      onClick={() => onReadMore(review)}
      className="group/card relative z-0 hover:z-20 flex-none w-[340px] h-[270px] bg-surface border border-hairline overflow-hidden rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-all duration-300 ease-out hover:scale-[1.03] hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-red-500/10 hover:border-red-500/40 cursor-pointer"
    >
      {/* Background ambient red glow on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-2xl pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />

      {/* 1. Header: Stars + Verified Badge + Quote Mark */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} />
          {review.verified_purchase && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500 border border-red-500/20">
              <ShieldCheck className="w-3 h-3" />
              Verified Driver
            </span>
          )}
        </div>
        <Quote className="w-6 h-6 text-hairline-strong group-hover/card:text-red-500/30 transition-colors" />
      </div>

      {/* 2. Review Comment Text */}
      <div className="my-auto py-1">
        <p className="text-xs sm:text-sm text-ink/90 leading-relaxed line-clamp-3 font-normal">
          &ldquo;{review.comment}&rdquo;
        </p>
        {isLongReview && (
          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-red-500 mt-1 opacity-80 group-hover/card:opacity-100 group-hover/card:translate-x-0.5 transition-all">
            Read full review <ChevronRight className="w-3 h-3" />
          </span>
        )}
      </div>

      {/* 3. Footer: Driver Info + Build Photo Pill (if present) */}
      <div className="pt-3.5 border-t border-hairline flex items-center justify-between gap-3">
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
              <span
                onClick={(e) => e.stopPropagation()}
                className="text-[10px] font-semibold text-red-500 truncate block"
              >
                <Link href={`/products/${review.product.slug}`} className="hover:text-red-400 transition-colors">
                  {review.product.title}
                </Link>
              </span>
            ) : (
              <span className="text-[10px] text-ink-muted block">RevvMotiv Community</span>
            )}
          </div>
        </div>

        {/* Build Photo Thumbnail Pill */}
        {photoUrl && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onImageClick(photoUrl, review.customer_name);
            }}
            title="Click to view build photo"
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
  const [activeReviewModal, setActiveReviewModal] = useState<Review | null>(null);

  useEffect(() => {
    fetch("/api/v1/reviews/featured")
      .then((res) => (res.ok ? res.json() : { data: [] }))
      .then((body) => {
        if (body.data && Array.isArray(body.data) && body.data.length > 0) {
          setReviews(body.data);
        }
      })
      .catch(() => {});
  }, []);

  if (!reviews || reviews.length === 0) return null;
  const canLoop = reviews.length >= 4;

  const handleImageClick = (url: string, name: string) => {
    setActivePhoto({ url, name });
  };

  const handleReadMore = (review: Review) => {
    setActiveReviewModal(review);
  };

  return (
    <section className="border-t border-hairline py-24 bg-surface-alt overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Verified Driver Feedback
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight">
              Top Customer Reviews
            </h2>
            <p className="text-sm text-ink-muted mt-1.5">
              Real builds, real fitment feedback from RevvMotiv drivers across India. Click any card to read full review.
            </p>
          </div>
          <div className="text-xs text-ink-muted font-medium">
            Over <span className="text-ink font-bold">100+</span> custom carbon & aero fitments delivered
          </div>
        </div>

        {canLoop ? (
          <div className="group/marquee overflow-hidden py-4 -my-4">
            <div
              className="flex items-center gap-6 w-max animate-marquee group-hover/marquee:[animation-play-state:paused]"
              style={{ animationDuration: `${reviews.length * 6}s` }}
            >
              {reviews.map((review) => (
                <ReviewCard
                  key={`orig-${review.id}`}
                  review={review}
                  onImageClick={handleImageClick}
                  onReadMore={handleReadMore}
                />
              ))}
              {reviews.map((review) => (
                <ReviewCard
                  key={`copy-${review.id}`}
                  review={review}
                  onImageClick={handleImageClick}
                  onReadMore={handleReadMore}
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
                  onReadMore={handleReadMore}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Review Modal Dialog */}
      {activeReviewModal && (
        <div
          onClick={() => setActiveReviewModal(null)}
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-lg w-full bg-surface rounded-2xl border border-hairline p-6 sm:p-8 shadow-2xl space-y-5 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-red-600 to-slate-900 flex items-center justify-center text-xs font-bold text-white shadow-sm flex-none">
                  {(activeReviewModal.customer_name || "Driver")
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-ink flex items-center gap-2">
                    {activeReviewModal.customer_name}
                    {activeReviewModal.verified_purchase && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-bold text-red-500 border border-red-500/20">
                        <ShieldCheck className="w-2.5 h-2.5" />
                        Verified Driver
                      </span>
                    )}
                  </h3>
                  {activeReviewModal.product ? (
                    <Link
                      href={`/products/${activeReviewModal.product.slug}`}
                      className="text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
                    >
                      {activeReviewModal.product.title}
                    </Link>
                  ) : (
                    <span className="text-xs text-ink-muted">RevvMotiv Community</span>
                  )}
                </div>
              </div>

              <button
                onClick={() => setActiveReviewModal(null)}
                className="text-ink-muted hover:text-ink transition-colors p-1.5 rounded-lg hover:bg-surface-alt cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-2">
              <StarRating rating={activeReviewModal.rating} />
              <span className="text-xs font-bold text-amber-500">{activeReviewModal.rating}.0 / 5.0</span>
            </div>

            {/* Complete Un-truncated Review Text */}
            <div className="max-h-60 overflow-y-auto pr-1">
              <p className="text-xs sm:text-sm text-ink leading-relaxed whitespace-pre-line font-normal">
                &ldquo;{activeReviewModal.comment}&rdquo;
              </p>
            </div>

            {/* Attached Photos in Modal */}
            {activeReviewModal.media_urls && activeReviewModal.media_urls.length > 0 && (
              <div className="pt-2 border-t border-hairline">
                <span className="text-[11px] font-bold uppercase tracking-wider text-ink-muted block mb-2">
                  Customer Build Photos:
                </span>
                <div className="flex gap-2.5 overflow-x-auto pb-1">
                  {activeReviewModal.media_urls.map((url, idx) => {
                    const normUrl = url.replace(/^https?:\/\/api\.revvmotiv\.com/, "");
                    return (
                      <div
                        key={idx}
                        onClick={() => {
                          setActivePhoto({ url: normUrl, name: activeReviewModal.customer_name });
                        }}
                        className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl border border-hairline overflow-hidden flex-none cursor-pointer hover:scale-105 hover:border-red-500 transition-all shadow-sm"
                      >
                        <Image
                          src={normUrl}
                          alt="Customer build photo"
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Photo Lightbox Popup */}
      {activePhoto && (
        <div
          onClick={() => setActivePhoto(null)}
          className="fixed inset-0 z-[110] bg-black/90 backdrop-blur-md flex items-center justify-center p-6"
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
