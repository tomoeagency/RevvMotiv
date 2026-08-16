import Image from "next/image";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import type { Review } from "@/lib/api";
import { StarRating } from "@/app/components/StarRating";

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="group/card relative z-0 hover:z-20 flex-none w-[300px] bg-surface border border-hairline overflow-hidden rounded-2xl flex flex-col shadow-lg transition-all duration-500 ease-[var(--ease-brand)] hover:scale-[1.04] hover:-translate-y-2 hover:shadow-2xl hover:shadow-red-500/15 hover:border-red-500/40">
      {review.media_urls[0] && (
        <div className="relative w-full h-[280px] bg-surface-alt overflow-hidden">
          <Image
            src={review.media_urls[0]}
            alt={`Photo from ${review.customer_name}'s review`}
            fill
            sizes="300px"
            className="object-cover object-center group-hover/card:scale-105 transition-transform duration-700 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
        </div>
      )}

      <div className="p-6 flex flex-col gap-3 flex-1">
        <StarRating rating={review.rating} />
        <p className="text-sm text-ink leading-relaxed line-clamp-3 group-hover/card:line-clamp-none transition-all duration-300">
          {review.comment}
        </p>

        <div className="mt-auto pt-4 border-t border-hairline flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-bold text-ink-muted truncate">{review.customer_name}</span>
            {review.verified_purchase && <ShieldCheck className="w-4 h-4 text-red-500 flex-none" />}
          </div>
          {review.product && (
            <Link
              href={`/products/${review.product.slug}`}
              className="text-[10px] font-bold text-red-500 uppercase tracking-widest hover:text-red-400 transition-colors flex-none"
            >
              View Part
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export function FeaturedReviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  const canLoop = reviews.length >= 4;

  return (
    <section className="border-t border-hairline py-24 bg-surface-alt overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6">
        <div className="mb-14">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
            Verified Driver Feedback
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight">
            Top Customer Reviews
          </h2>
          <p className="text-sm text-ink-muted mt-2">
            Real builds, real fitment feedback from RevvMotiv drivers across India.
          </p>
        </div>

        {canLoop ? (
          <div className="group/marquee overflow-hidden py-4 -my-4">
            <div
              className="flex items-center gap-8 w-max animate-marquee group-hover/marquee:[animation-play-state:paused]"
              style={{ animationDuration: `${reviews.length * 7}s` }}
            >
              {reviews.map((review) => (
                <ReviewCard key={`orig-${review.id}`} review={review} />
              ))}
              {reviews.map((review) => (
                <ReviewCard key={`copy-${review.id}`} review={review} />
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-8 overflow-x-auto hide-scrollbar pb-8 pt-4 snap-x snap-mandatory">
            {reviews.map((review) => (
              <div key={review.id} className="snap-center">
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
