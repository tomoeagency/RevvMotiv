import { Star } from "lucide-react";

export function StarRating({
  rating,
  size = "w-4 h-4",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`${size} ${
            n <= Math.round(rating)
              ? "fill-[var(--color-star-fill)] text-[var(--color-star-fill)]"
              : "fill-transparent text-hairline-strong"
          }`}
        />
      ))}
    </div>
  );
}
