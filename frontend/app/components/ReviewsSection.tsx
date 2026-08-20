"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  ShieldCheck,
  MessageSquareOff,
  Star,
  Camera,
  X,
  CheckCircle2,
  AlertCircle,
  PenLine,
  Loader2,
  Share2,
  Check,
} from "lucide-react";
import type { ProductReviewsResponse, Review } from "@/lib/api";
import { parseReviewComment } from "@/lib/api";
import { StarRating } from "@/app/components/StarRating";
import { PrimaryCtaButton } from "@/app/components/PrimaryCtaButton";
import { motion, AnimatePresence } from "motion/react";

function formatReviewDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function ReviewsSection({
  productId,
  productTitle,
  reviews,
}: {
  productId?: number;
  productTitle?: string;
  reviews: ProductReviewsResponse;
}) {
  const [reviewList, setReviewList] = useState<Review[]>(reviews?.data || []);
  const [reviewMeta, setReviewMeta] = useState(
    reviews?.meta || {
      current_page: 1,
      last_page: 1,
      per_page: 10,
      total: 0,
      average_rating: 5,
      rating_breakdown: {},
    }
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Auto-open review modal if direct review link is opened
  useEffect(() => {
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      if (
        url.searchParams.get("review") === "true" ||
        window.location.hash === "#write-review" ||
        window.location.hash === "#review"
      ) {
        setIsModalOpen(true);
      }
    }
  }, []);

  const handleCopyDirectReviewLink = () => {
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("review", "true");
    navigator.clipboard.writeText(url.toString());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Form State
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [comment, setComment] = useState("");
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 5 - mediaFiles.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newPreviews = filesToAdd.map((file) => URL.createObjectURL(file));

    setMediaFiles((prev) => [...prev, ...filesToAdd]);
    setMediaPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index: number) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerEmail.trim() || !comment.trim()) {
      setSubmitError("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const formData = new FormData();
      if (productId) formData.append("product_id", String(productId));
      formData.append("customer_name", customerName.trim());
      formData.append("customer_email", customerEmail.trim());
      formData.append("rating", String(rating));
      formData.append("comment", comment.trim());

      mediaFiles.forEach((file) => {
        formData.append("media[]", file);
      });

      const response = await fetch("/api/v1/reviews", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to submit review. Please check the inputs.");
      }

      // Prepend newly submitted review into reviewList and recalculate average rating live
      const newReview: Review = {
        id: result.data?.id || Date.now(),
        product_id: productId ?? null,
        customer_name: customerName.trim(),
        rating: Number(rating),
        comment: comment.trim(),
        media_urls: mediaPreviews,
        verified_purchase: false,
        created_at: new Date().toISOString(),
      };

      const updatedList = [newReview, ...reviewList];
      const newTotal = updatedList.length;
      const sumRating = updatedList.reduce((acc, curr) => acc + curr.rating, 0);
      const newAvg = Number((sumRating / newTotal).toFixed(1));
      const newBreakdown: Record<string, number> = {};
      updatedList.forEach((r) => {
        newBreakdown[String(r.rating)] = (newBreakdown[String(r.rating)] || 0) + 1;
      });

      setReviewList(updatedList);
      setReviewMeta({
        ...reviewMeta,
        total: newTotal,
        average_rating: newAvg,
        rating_breakdown: newBreakdown,
      });

      setSubmitSuccess(true);
      setCustomerName("");
      setCustomerEmail("");
      setComment("");
      setMediaFiles([]);
      setMediaPreviews([]);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const breakdown = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviewMeta.rating_breakdown?.[String(star)] ?? 0,
  }));

  return (
    <section id="reviews" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-hairline scroll-mt-20">
      {/* Header with Title & Write Review Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
        <div>
          <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block mb-1">
            Real Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-ink uppercase tracking-tight">
            Customer Reviews
          </h2>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleCopyDirectReviewLink}
            title="Copy direct link to share with client on WhatsApp, SMS or Email"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-surface border border-hairline hover:border-red-500/50 hover:bg-surface-alt transition-all text-xs font-bold text-ink-muted hover:text-ink cursor-pointer shadow-sm"
          >
            {copiedLink ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Direct Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-red-500" />
                <span>Share Review Link</span>
              </>
            )}
          </button>

          <PrimaryCtaButton
            type="button"
            onClick={() => {
              setIsModalOpen(true);
              setSubmitSuccess(false);
              setSubmitError(null);
            }}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs w-fit cursor-pointer"
          >
            <PenLine className="w-4 h-4" />
            <span>Write a Review</span>
          </PrimaryCtaButton>
        </div>
      </div>

      {reviewMeta.total === 0 ? (
        <div className="border border-hairline bg-surface p-12 rounded-xl flex flex-col items-center text-center gap-4">
          <MessageSquareOff className="w-10 h-10 text-ink-subtle" />
          <div className="max-w-md">
            <h3 className="text-base font-bold text-ink mb-1">No reviews yet for this product</h3>
            <p className="text-xs text-ink-muted leading-relaxed">
              Have you installed this part on your build? Share your feedback and photos to help fellow automotive enthusiasts.
            </p>
          </div>
          <PrimaryCtaButton
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2.5 text-xs cursor-pointer"
          >
            Be the First to Review
          </PrimaryCtaButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-10 lg:gap-14">
          {/* Left: Product Rating Breakdown & Summary */}
          <div className="flex flex-col gap-6 h-fit lg:sticky lg:top-28 bg-surface/40 p-6 rounded-2xl border border-hairline">
            <div>
              <span className="text-5xl font-black text-ink block leading-none mb-2 font-mono">
                {reviewMeta.average_rating.toFixed(1)}
              </span>
              <div className="flex items-center gap-2 mb-1.5">
                <StarRating rating={reviewMeta.average_rating} size="w-5 h-5" />
                <span className="text-xs font-bold text-ink">out of 5</span>
              </div>
              <p className="text-xs text-ink-muted">
                Based on {reviewMeta.total} verified {reviewMeta.total === 1 ? "review" : "reviews"}
              </p>
            </div>

            <div className="flex flex-col gap-2.5 pt-4 border-t border-hairline">
              {breakdown.map(({ star, count }) => {
                const pct = reviewMeta.total > 0 ? Math.round((count / reviewMeta.total) * 100) : 0;
                return (
                  <div key={star} className="flex items-center gap-3 text-xs">
                    <span className="w-4 text-ink font-bold flex items-center gap-0.5">
                      {star} <Star className="w-3 h-3 text-amber-400 fill-amber-400 inline" />
                    </span>
                    <div className="flex-1 h-2 bg-surface-alt rounded-full overflow-hidden border border-hairline/50">
                      <div
                        className="h-full bg-red-600 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-[11px] font-mono text-ink-muted">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Customer Reviews List */}
          <div className="flex flex-col gap-6">
            {reviewList.map((review) => (
              <div
                key={review.id}
                className="p-6 bg-surface border border-hairline rounded-2xl space-y-3"
              >
                {(() => {
                  const { carModel, comment: cleanComment } = parseReviewComment(review.comment);
                  return (
                    <>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                            <span className="text-sm font-bold text-ink">
                              {review.customer_name}
                            </span>
                            {carModel && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-500 uppercase tracking-wider bg-red-500/10 px-2 py-0.5 rounded-full border border-red-500/25">
                                {carModel}
                              </span>
                            )}
                            {review.verified_purchase && (
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                <ShieldCheck className="w-3 h-3" /> Verified Purchase
                              </span>
                            )}
                          </div>
                          <StarRating rating={review.rating} size="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-mono text-ink-subtle flex-none">
                          {formatReviewDate(review.created_at)}
                        </span>
                      </div>

                      <p className="text-sm text-ink-muted leading-relaxed">
                        {cleanComment}
                      </p>
                    </>
                  );
                })()}

                {review.media_urls && review.media_urls.length > 0 && (
                  <div className="flex gap-2.5 flex-wrap pt-2">
                    {review.media_urls.map((url, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 bg-surface-alt border border-hairline rounded-xl overflow-hidden shadow-sm"
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
      )}

      {/* Interactive Review Submission Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-surface border border-hairline rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-surface-alt border border-hairline hover:border-red-500 flex items-center justify-center text-ink-muted hover:text-ink transition-colors cursor-pointer"
                aria-label="Close review modal"
              >
                <X className="w-4 h-4" />
              </button>

              {submitSuccess ? (
                <div className="py-8 text-center space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-ink">Review Submitted!</h3>
                  <p className="text-xs text-ink-muted leading-relaxed max-w-xs mx-auto">
                    Thank you for sharing your feedback! Your review and photos have been successfully submitted.
                  </p>
                  <PrimaryCtaButton
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-2.5 text-xs cursor-pointer"
                  >
                    Close Window
                  </PrimaryCtaButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block mb-1">
                      Rate & Review Part
                    </span>
                    <h3 className="text-xl font-bold text-ink truncate max-w-sm">
                      {productTitle || "Product Review"}
                    </h3>
                  </div>

                  {submitError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-none" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  {/* Interactive Star Rating Selector */}
                  <div>
                    <label className="text-xs font-bold text-ink uppercase tracking-wider block mb-2">
                      Overall Rating *
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((starVal) => {
                        const isFilled = (hoverRating || rating) >= starVal;
                        return (
                          <button
                            key={starVal}
                            type="button"
                            onClick={() => setRating(starVal)}
                            onMouseEnter={() => setHoverRating(starVal)}
                            onMouseLeave={() => setHoverRating(0)}
                            aria-label={`Rate ${starVal} out of 5 stars`}
                            className="p-1 text-ink transition-transform hover:scale-125 cursor-pointer"
                          >
                            <Star
                              className={`w-7 h-7 transition-colors ${
                                isFilled
                                  ? "text-amber-400 fill-amber-400"
                                  : "text-ink-subtle/40 hover:text-amber-400"
                              }`}
                            />
                          </button>
                        );
                      })}
                      <span className="text-xs font-mono text-ink-muted ml-2">
                        {rating} / 5 Stars
                      </span>
                    </div>
                  </div>

                  {/* Name & Email Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full h-11 px-3.5 rounded-xl border border-hairline bg-surface-alt text-ink text-xs focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-ink block mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={customerEmail}
                        onChange={(e) => setCustomerEmail(e.target.value)}
                        placeholder="your@email.com"
                        className="w-full h-11 px-3.5 rounded-xl border border-hairline bg-surface-alt text-ink text-xs focus:border-red-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Review Text */}
                  <div>
                    <label className="text-xs font-bold text-ink block mb-1.5">
                      Your Feedback / Review *
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="How was the build quality, fitment, and install process? Share your honest experience..."
                      className="w-full p-3.5 rounded-xl border border-hairline bg-surface-alt text-ink text-xs focus:border-red-500 focus:outline-none transition-colors resize-none leading-relaxed"
                    />
                  </div>

                  {/* Photo Upload with Preview */}
                  <div>
                    <label className="text-xs font-bold text-ink flex items-center justify-between mb-2">
                      <span>Add Photos (Optional)</span>
                      <span className="text-[10px] text-ink-subtle font-mono">
                        {mediaFiles.length} / 5 photos
                      </span>
                    </label>

                    <div className="flex flex-wrap gap-2.5 items-center">
                      {mediaPreviews.map((preview, idx) => (
                        <div
                          key={idx}
                          className="relative w-16 h-16 rounded-xl overflow-hidden border border-hairline bg-surface-alt group"
                        >
                          <Image
                            src={preview}
                            alt={`Preview ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            aria-label="Remove image"
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}

                      {mediaFiles.length < 5 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="w-16 h-16 rounded-xl border-2 border-dashed border-hairline hover:border-red-500/50 bg-surface-alt flex flex-col items-center justify-center text-ink-subtle hover:text-ink transition-colors cursor-pointer"
                        >
                          <Camera className="w-5 h-5 mb-0.5" />
                          <span className="text-[9px] font-bold">+ Photo</span>
                        </button>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/png,image/jpeg,image/webp"
                      multiple
                      className="hidden"
                    />
                  </div>

                  {/* Submit Button */}
                  <PrimaryCtaButton
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-11 text-xs flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Submitting Review...</span>
                      </>
                    ) : (
                      <span>Submit Review</span>
                    )}
                  </PrimaryCtaButton>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
