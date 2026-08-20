"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { Film, MessageCircle, Wrench } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { useConsultant } from "@/lib/consultant-context";
import { getFeaturedReviewsClient, parseReviewComment, type Review } from "@/lib/api";
import { GARAGE_GALLERY } from "@/lib/garage-gallery";
import { StarRating } from "@/app/components/StarRating";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

type TrustCard =
  | { id: string; type: "review"; review: Review }
  | { id: "work"; type: "work" }
  | { id: "contact"; type: "contact" }
  | { id: "reel"; type: "reel" };

// New reviews rotate into the panel on this cadence — see the hover-pause
// logic below for why a card being actively read never gets swapped out
// from under the visitor mid-read.
const REVIEW_ROTATE_MS = 15_000;

// How many review cards show at once — balanced so cards don't overflow the viewport
const REVIEW_CARD_COUNT = 3;

// Upper bound on total cards (3 reviews + 3 action cards = 6 cards = exactly 2 per column)
const MAX_CARDS = 6;

// Which content leads depends on what the visitor is actually doing:
// evaluating products wants social proof first, general browsing wants the
// portfolio, checkout wants a direct line to a human before they commit,
// and the portfolio page itself obviously skips its own teaser. Unlike a
// rotation, this only decides slot/stagger order now — everything
// applicable is shown at once.
function getTypeOrder(pathname: string): Array<"review" | "work" | "contact" | "reel"> {
  if (pathname.startsWith("/checkout")) return ["review", "contact", "work", "reel"];
  if (pathname.startsWith("/work")) return ["review", "contact", "reel"];
  return ["review", "work", "reel", "contact"];
}

const WORK_SLIDES = [
  { img: "/images/projects/verna_cover.webp", title: "Hyundai Verna Stealth Build" },
  { img: "/images/projects/i20_blackout_cover.webp", title: "i20 N-Line Blackout Aero" },
  { img: "/images/projects/polo_track_cover.webp", title: "Polo GT TSI Track Spec" },
  { img: "/images/projects/swift_aero_cover.webp", title: "Swift Sport Widebody" },
  { img: "/images/projects/sonet_cover.webp", title: "Kia Sonet Custom Aero" },
  { img: "/images/projects/tiago_cover.webp", title: "Tiago Street Edition" },
];

export function TrustPanelClient({
  whatsappDigits,
  workPhoto,
  initialReviews = [],
}: {
  whatsappDigits: string | null;
  workPhoto: string | null;
  initialReviews?: Review[];
}) {
  const rawPathname = usePathname();
  const { isDrawerOpen, closeDrawer } = useCart();
  const { open: openConsultant } = useConsultant();
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  // Auto-rotating slideshow index for Our Work portfolio card
  const [workIndex, setWorkIndex] = useState(0);

  useEffect(() => {
    if (!isDrawerOpen) return;
    const timer = setInterval(() => {
      setWorkIndex((prev) => (prev + 1) % WORK_SLIDES.length);
    }, 3200);
    return () => clearInterval(timer);
  }, [isDrawerOpen]);

  // Opening the cart now changes the URL to /cart (see cart-context.tsx),
  // which makes usePathname() report "/cart" instead of whatever page the
  // visitor is actually browsing.
  const lastRealPathRef = useRef(rawPathname);
  if (rawPathname !== "/cart") {
    lastRealPathRef.current = rawPathname;
  }
  const pathname = rawPathname === "/cart" ? lastRealPathRef.current : rawPathname;

  useEffect(() => {
    let cancelled = false;
    getFeaturedReviewsClient()
      .then((data) => {
        if (!cancelled && data && data.length > 0) {
          setReviews(data);
        }
      })
      .catch(() => {
        // Keep initialReviews if client fetch fails
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Which review(s) currently show rotates every REVIEW_ROTATE_MS so the
  // whole featured-reviews pool gets exposure over time, not just whichever
  // 3 happened to sort first. isReviewHoveredRef tracks whether a review
  // card is mid-read right now (via onMouseEnter/onMouseLeave below); if
  // the interval fires while that's true, the rotation is deferred
  // (reviewRotatePendingRef) rather than skipped outright, and fires the
  // instant the pointer leaves — so a card never gets swapped out from
  // under someone actually reading it, but the rotation isn't lost either.
  const [reviewCycle, setReviewCycle] = useState(0);
  const isReviewHoveredRef = useRef(false);
  const reviewRotatePendingRef = useRef(false);

  useEffect(() => {
    if (!isDrawerOpen || (reviews?.length ?? 0) <= REVIEW_CARD_COUNT) return;

    const timer = setInterval(() => {
      if (isReviewHoveredRef.current) {
        reviewRotatePendingRef.current = true;
      } else {
        setReviewCycle((c) => c + 1);
      }
    }, REVIEW_ROTATE_MS);

    return () => clearInterval(timer);
  }, [isDrawerOpen, reviews]);

  function handleReviewMouseEnter() {
    isReviewHoveredRef.current = true;
  }

  function handleReviewMouseLeave() {
    isReviewHoveredRef.current = false;
    if (reviewRotatePendingRef.current) {
      reviewRotatePendingRef.current = false;
      setReviewCycle((c) => c + 1);
    }
  }

  // Reviews resolve after work/contact are already showing — they get
  // appended as new boxes when ready, never swapped in over an existing
  // one, so nothing already on screen changes out from under the visitor.
  const cards = useMemo<TrustCard[]>(() => {
    const order = getTypeOrder(pathname);
    // Photo reviews are more persuasive than text-only ones, so they lead
    // the base ordering; reviewCycle then rotates the *starting point*
    // through that ordering over time, so which REVIEW_CARD_COUNT are
    // visible changes every rotation while photo reviews still surface
    // first initially.
    const sortedReviews = [...(reviews ?? [])].sort(
      (a, b) => (b.media_urls.length > 0 ? 1 : 0) - (a.media_urls.length > 0 ? 1 : 0)
    );
    const offset = sortedReviews.length > 0 ? reviewCycle % sortedReviews.length : 0;
    const pickedReviews = [...sortedReviews.slice(offset), ...sortedReviews.slice(0, offset)].slice(
      0,
      REVIEW_CARD_COUNT
    );

    const list: TrustCard[] = [];
    for (const type of order) {
      if (type === "review") {
        pickedReviews.forEach((r) => list.push({ id: `review-${r.id}`, type: "review", review: r }));
      } else if (type === "work") {
        list.push({ id: "work", type: "work" });
      } else if (type === "reel") {
        list.push({ id: "reel", type: "reel" });
      } else {
        list.push({ id: "contact", type: "contact" });
      }
    }
    return list.slice(0, MAX_CARDS);
  }, [pathname, reviews, reviewCycle]);

  if (!isDrawerOpen || cards.length === 0) return null;

  return (
    <div
      className="hidden md:block fixed inset-y-0 left-0 right-[420px] z-[58] pointer-events-auto overflow-y-auto overscroll-contain p-6 pb-28 scroll-smooth"
      data-lenis-prevent
      onClick={(e) => {
        if (e.target === e.currentTarget) closeDrawer();
      }}
      aria-live="polite"
    >
      {/* Masonry via CSS multi-column layout */}
      <AnimatePresence>
        <div className="columns-1 lg:columns-2 xl:columns-3 gap-5 pb-8">
          {cards.map((card, i) => {
          // Slightly different bob duration/delay per box so they float
          // out of sync with each other instead of bobbing in unison.
          const floatDuration = 4 + (i % 3) * 0.7;
          const floatDelay = i * 0.25;

          return (
            <motion.div
              key={card.id}
              // Whichever card the pointer is over rises above its
              // neighbors — otherwise a hover-expanded card (full review
              // text) can render underneath an adjacent box and get clipped.
              className="break-inside-avoid mb-5 pointer-events-auto relative z-10 hover:z-30"
              initial={{ opacity: 0, scale: 0.85, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.03 }}
              transition={{ duration: MOTION_DURATION.base, delay: i * 0.12, ease: MOTION_EASE_BRAND }}
              onMouseEnter={card.type === "review" ? handleReviewMouseEnter : undefined}
              onMouseLeave={card.type === "review" ? handleReviewMouseLeave : undefined}
            >
              <motion.div
                animate={{ y: [0, -8, 0], x: [0, 3, 0, -3, 0] }}
                transition={{
                  duration: floatDuration,
                  delay: floatDelay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                // Reviews keep the neutral "testimonial" look; the
                // work/reel/contact cards get a red-tinted border (and,
                // for contact, a brand-gradient top accent below) so
                // they read as distinct card *kinds* at a glance rather
                // than blending into the review pile.
                className={`group bg-surface overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] ${
                  card.type === "review"
                    ? "border border-hairline"
                    : "border border-[var(--brand-red)]/30"
                }`}
              >
                {card.type === "contact" && (
                  <div className="h-1 bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-black)]" />
                )}

                {card.type === "review" && (
                  <div className="p-5">
                    {card.review.media_urls[0] && (
                      <div className="relative w-full h-28 -mx-5 -mt-5 mb-3 bg-surface-alt">
                        <Image
                          src={card.review.media_urls[0]}
                          alt={`Photo from ${card.review.customer_name}'s review`}
                          fill
                          sizes="256px"
                          className="object-cover object-center"
                        />
                      </div>
                    )}
                    {(() => {
                      const { carModel, comment: cleanComment } = parseReviewComment(card.review.comment);
                      return (
                        <>
                          <div className="mb-2 flex items-center gap-2">
                            <StarRating rating={card.review.rating} size="w-3.5 h-3.5" />
                            {carModel && (
                              <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-[9px] font-black text-red-500 uppercase tracking-wider">
                                {carModel}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-ink leading-snug mb-3">
                            &ldquo;{cleanComment}&rdquo;
                          </p>
                          <p className="text-xs font-bold text-ink-muted uppercase tracking-widest">
                            {card.review.customer_name}
                          </p>
                        </>
                      );
                    })()}
                  </div>
                )}

                {card.type === "work" && (
                  <div>
                    <div className="relative w-full h-32 bg-surface-alt overflow-hidden">
                      <AnimatePresence initial={false}>
                        <motion.div
                          key={workIndex}
                          initial={{ opacity: 0, scale: 1.06 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.8, ease: "easeInOut" }}
                          className="absolute inset-0"
                        >
                          <Image
                            src={WORK_SLIDES[workIndex].img}
                            alt={WORK_SLIDES[workIndex].title}
                            fill
                            sizes="256px"
                            className="object-cover object-center"
                          />
                        </motion.div>
                      </AnimatePresence>
                      <span className="absolute top-2 left-2 z-10 bg-[var(--brand-red)] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 shadow-md">
                        Portfolio
                      </span>
                      {/* Mini indicator dots at bottom right */}
                      <div className="absolute bottom-2 right-2 z-10 flex gap-1 bg-black/60 px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                        {WORK_SLIDES.map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                              idx === workIndex ? "bg-red-500 w-3" : "bg-white/40"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="p-5">
                      <Wrench className="w-5 h-5 text-[var(--brand-red)] mb-2.5" />
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <p className="text-sm text-ink font-bold">See Our Work</p>
                        <span className="text-[10px] font-mono text-ink-muted">
                          {workIndex + 1}/{WORK_SLIDES.length}
                        </span>
                      </div>
                      <p className="text-xs text-ink-muted mb-3 leading-relaxed">
                        Real installs on real cars — browse builds from the RevvMotiv community.
                      </p>
                      <Link
                        href="/work"
                        onClick={closeDrawer}
                        className="text-xs font-bold text-ink uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors border-b border-[var(--brand-red)] pb-0.5 inline-block"
                      >
                        View Projects →
                      </Link>
                    </div>
                  </div>
                )}

                {card.type === "reel" && (
                  <div>
                    <div className="relative w-full h-28 bg-surface-alt">
                      <Image
                        src={GARAGE_GALLERY[0].img}
                        alt={GARAGE_GALLERY[0].title}
                        fill
                        sizes="256px"
                        className="object-cover object-center"
                      />
                      <span className="absolute top-2 left-2 bg-[var(--brand-red)] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5">
                        Video
                      </span>
                    </div>
                    <div className="p-5">
                      <Film className="w-5 h-5 text-[var(--brand-red)] mb-3" />
                      <p className="text-sm text-ink font-bold mb-1">From Our Garage</p>
                      <p className="text-xs text-ink-muted mb-3 leading-relaxed">
                        Real builds, real performance — a look inside the shop.
                      </p>
                      <Link
                        href="/#from-our-garage"
                        className="text-xs font-bold text-ink uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors border-b border-[var(--brand-red)] pb-0.5"
                      >
                        Watch
                      </Link>
                    </div>
                  </div>
                )}

                {card.type === "contact" && (
                  <div className="p-5">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-r from-[var(--brand-red)] to-[var(--brand-black)] mb-3">
                      <MessageCircle className="w-4.5 h-4.5 text-white" />
                    </span>
                    <p className="text-sm text-ink font-bold mb-1">Not sure what fits?</p>
                    <p className="text-xs text-ink-muted mb-3 leading-relaxed">
                      Talk to a consultant before you check out — fitment, compatibility, anything.
                    </p>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={openConsultant}
                        className="text-xs font-bold text-ink uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors border-b border-[var(--brand-red)] pb-0.5"
                      >
                        Talk to Us
                      </button>
                      {whatsappDigits && (
                        <a
                          href={`https://wa.me/${whatsappDigits}?text=${encodeURIComponent("Hi RevvMotiv, I'm looking for styling & aero parts for my car. Can you assist me?")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-ink-muted hover:text-[var(--brand-red)] transition-colors"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          );
          })}
        </div>
      </AnimatePresence>
    </div>
  );
}
