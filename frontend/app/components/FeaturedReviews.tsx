"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Quote, Camera, Sparkles, X } from "lucide-react";
import type { Review } from "@/lib/api";
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

  // Generate 2-letter avatar initials
  const initials = (review.customer_name || "Driver")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="group/card relative z-0 hover:z-30 flex-none w-[340px] h-[270px] hover:h-[310px] bg-surface border border-hairline overflow-hidden rounded-2xl p-6 flex flex-col justify-between shadow-lg transition-all duration-300 ease-[var(--ease-brand)] hover:scale-[1.04] hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/15 hover:border-red-500/50">
      {/* Background ambient red glow on hover */}
      <div className="absolute top-0 right-0 w-36 h-36 bg-red-500/10 rounded-full blur-2xl pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />

      {/* 1. Header: Stars + Verified Badge + Quote Mark */}
      <div className="flex items-center justify-between flex-none">
        <div className="flex items-center gap-2">
          <StarRating rating={review.rating} />
          {review.verified_purchase && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold text-red-500 border border-red-500/20">
              <ShieldCheck className="w-3 h-3" />
              Verified Driver
            </span>
          )}
        </div>
        <Quote className="w-6 h-6 text-hairline-strong group-hover/card:text-red-500/40 transition-colors" />
      </div>

      {/* 2. Review Comment Text (Expands smoothly on Hover with no click required) */}
      <div className="my-auto py-1 overflow-hidden">
        <p className="text-xs sm:text-sm text-ink/90 leading-relaxed font-normal line-clamp-3 group-hover/card:line-clamp-none max-h-20 group-hover/card:max-h-36 overflow-y-auto pr-1 hide-scrollbar transition-all duration-300">
          &ldquo;{review.comment}&rdquo;
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
            ) : (
              <span className="text-[10px] text-ink-muted block">RevvMotiv Community</span>
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

  return (
    <section className="border-t border-hairline py-24 bg-surface-alt overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Customer Feedback
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight">
              What Drivers Are Saying
            </h2>
            <p className="text-sm text-ink-muted mt-1.5">
              Real feedback and installation photos from car owners across India.
            </p>
          </div>
          <div className="text-xs text-ink-muted font-medium">
            Tested & delivered to drivers across India
          </div>
        </div>

        {canLoop ? (
          <div className="group/marquee overflow-hidden py-6 -my-6">
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
