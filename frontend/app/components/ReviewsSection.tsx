import Image from "next/image";
import { ShieldCheck, MessageSquareOff } from "lucide-react";
import type { ProductReviewsResponse } from "@/lib/api";
import { StarRating } from "@/app/components/StarRating";

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ReviewsSection({ reviews }: { reviews: ProductReviewsResponse }) {
  const { data, meta } = reviews;

  if (meta.total === 0) {
    return (
      <section className="py-24 px-6 max-w-screen-2xl mx-auto w-full border-t border-hairline">
        <h2 className="text-2xl md:text-3xl font-black text-ink uppercase tracking-tight mb-8">
          Customer Reviews
        </h2>
        <div className="border border-hairline bg-surface p-10 flex flex-col items-center text-center gap-3">
          <MessageSquareOff className="w-8 h-8 text-ink-subtle" />
          <p className="text-sm text-ink-muted">
            No reviews yet — be the first to review this product.
          </p>
        </div>
      </section>
    );
  }

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: meta.rating_breakdown[String(star)] ?? 0,
  }));

  return (
    <section className="py-24 px-6 max-w-screen-2xl mx-auto w-full border-t border-hairline">
      <h2 className="text-2xl md:text-3xl font-black text-ink uppercase tracking-tight mb-12">
        Customer Reviews
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">
        {/* Summary */}
        <div className="flex flex-col gap-6 h-fit md:sticky md:top-28">
          <div>
            <span className="text-5xl font-black text-ink block leading-none mb-2">
              {meta.average_rating.toFixed(1)}
            </span>
            <StarRating rating={meta.average_rating} size="w-5 h-5" />
            <p className="text-xs text-ink-muted mt-2">
              Based on {meta.total} {meta.total === 1 ? "review" : "reviews"}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {breakdown.map(({ star, count }) => {
              const pct = meta.total > 0 ? Math.round((count / meta.total) * 100) : 0;
              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <span className="w-3 text-ink-muted font-bold">{star}</span>
                  <div className="flex-1 h-1.5 bg-surface-alt rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[var(--brand-red)] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-6 text-right text-ink-subtle">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Review list */}
        <div className="flex flex-col gap-8">
          {data.map((review) => (
            <div
              key={review.id}
              className="border-b border-hairline pb-8 last:border-b-0"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-ink">
                      {review.customer_name}
                    </span>
                    {review.verified_purchase && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[var(--brand-red)] uppercase tracking-widest">
                        <ShieldCheck className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  <StarRating rating={review.rating} />
                </div>
                <span className="text-xs text-ink-subtle flex-none">
                  {formatReviewDate(review.created_at)}
                </span>
              </div>

              <p className="text-sm text-ink-muted leading-relaxed mb-3">
                {review.comment}
              </p>

              {review.media_urls.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {review.media_urls.map((url) => (
                    <div
                      key={url}
                      className="relative w-20 h-20 bg-surface-alt border border-hairline overflow-hidden"
                    >
                      <Image
                        src={url}
                        alt={`Photo from ${review.customer_name}'s review`}
                        fill
                        sizes="80px"
                        className="object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
