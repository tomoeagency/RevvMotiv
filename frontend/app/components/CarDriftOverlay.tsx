"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { CAR_PATH_D, CAR_NATIVE_WIDTH, CAR_NATIVE_HEIGHT } from "@/lib/car-path-data";

export type DriftDirection = "forward" | "back" | "lateral";

// Everything below is derived from ONE svg path per mode: the car's
// position/rotation, both tire tracks, and the trail's fade-out all read
// off the same centerline (or its perpendicular offsets), driven by a
// single `progress` value. That's the whole fix for the old three bugs
// (car off-path, marks ahead of the car, smoke from a fixed origin) — they
// were symptoms of the car and the trail being two unsynchronized systems.
const VIEWBOX_W = 200;
const VIEWBOX_H = 120;
const CAR_WIDTH = 20;
const CAR_HEIGHT = CAR_WIDTH * (CAR_NATIVE_HEIGHT / CAR_NATIVE_WIDTH); // native 1024x1536 aspect
const TRACK_OFFSET = 6.5; // half the distance between the two tire tracks
const TREAD_STROKE_WIDTH = 3.2;
const HALO_STROKE_WIDTH = TREAD_STROKE_WIDTH + 2;

// Deliberately not lib/motion-tokens.ts: those tokens (150/300/600ms) are
// sized for UI chrome — hovers, drawers, section reveals. This is a
// full-screen route-transition hero moment on its own budget, gated by
// RouteLoader's own tiering (car only plays past 1s) and capped well under
// its HERO_VISIBLE_MS (1800ms) so the fade-out never clips it. Reusing the
// 600ms "page" tier would visibly truncate the drift.
const DURATION_MS = 1500;

const MAX_SMOKE_PARTICLES = 30;
const SMOKE_SPAWN_INTERVAL_MS = 26;
const SMOKE_BURST_COUNT = 6;

interface Point {
  x: number;
  y: number;
}

interface ModeGeometry {
  centerlineD: string;
  trackAD: string;
  trackBD: string;
  start: Point;
  end: Point;
}

function polarPoint(cx: number, cy: number, r: number, angleDeg: number): Point {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// A single SVG arc command can't reliably sweep more than ~180deg, so a
// >180deg loop (the "lateral" drift) is built from two half-sweep arcs.
function buildArcD(cx: number, cy: number, r: number, startDeg: number, sweepDeg: number): string {
  const start = polarPoint(cx, cy, r, startDeg);
  const mid = polarPoint(cx, cy, r, startDeg + sweepDeg / 2);
  const end = polarPoint(cx, cy, r, startDeg + sweepDeg);
  const sweepFlag = sweepDeg > 0 ? 1 : 0;
  return `M ${start.x} ${start.y} A ${r} ${r} 0 0 ${sweepFlag} ${mid.x} ${mid.y} A ${r} ${r} 0 0 ${sweepFlag} ${end.x} ${end.y}`;
}

function cubicPoint(p0: Point, p1: Point, p2: Point, p3: Point, t: number): Point {
  const mt = 1 - t;
  return {
    x: mt * mt * mt * p0.x + 3 * mt * mt * t * p1.x + 3 * mt * t * t * p2.x + t * t * t * p3.x,
    y: mt * mt * mt * p0.y + 3 * mt * mt * t * p1.y + 3 * mt * t * t * p2.y + t * t * t * p3.y,
  };
}

// A cubic bezier's true offset curve isn't itself a bezier, so the U-turn's
// parallel tire tracks are approximated: sample the centerline densely,
// nudge each sample perpendicular to its local tangent, and connect with
// line segments. This is only for the decorative offset tracks — the car's
// own position/rotation always reads off the real centerline `<path>` via
// getPointAtLength, never off this approximation.
function offsetCubicBezierD(p0: Point, p1: Point, p2: Point, p3: Point, offset: number, samples = 32): string {
  const parts: string[] = [];
  const dt = 0.0015;
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const p = cubicPoint(p0, p1, p2, p3, t);
    const pNext = cubicPoint(p0, p1, p2, p3, Math.min(1, t + dt));
    const angle = Math.atan2(pNext.y - p.y, pNext.x - p.x);
    const nx = -Math.sin(angle);
    const ny = Math.cos(angle);
    parts.push(`${i === 0 ? "M" : "L"} ${p.x + nx * offset} ${p.y + ny * offset}`);
  }
  return parts.join(" ");
}

// --- forward: a straight linear drift across the viewport ---
const FORWARD_START: Point = { x: 14, y: 60 };
const FORWARD_END: Point = { x: 186, y: 60 };

// --- back: a U-turn. Starts heading right (into the loop), bulges right,
// and finishes heading LEFT — its final, on-screen motion reads as
// "retreating," which is what should sell the "back" navigation. (Swapping
// which end is the start is exactly the fix for the old wrong-direction
// U-turn: it needs to *end* facing away, not end facing further in.) ---
const UTURN_P0: Point = { x: 40, y: 40 };
const UTURN_P1: Point = { x: 120, y: 40 };
const UTURN_P2: Point = { x: 120, y: 90 };
const UTURN_P3: Point = { x: 40, y: 90 };

// --- lateral: a proper arc (not an approximated circle) for any other
// transition ---
const LATERAL_CX = 100;
const LATERAL_CY = 60;
const LATERAL_R = 38;
const LATERAL_START_DEG = -90;
const LATERAL_SWEEP_DEG = 300;

const GEOMETRY: Record<DriftDirection, ModeGeometry> = {
  forward: {
    centerlineD: `M ${FORWARD_START.x} ${FORWARD_START.y} L ${FORWARD_END.x} ${FORWARD_END.y}`,
    trackAD: `M ${FORWARD_START.x} ${FORWARD_START.y - TRACK_OFFSET} L ${FORWARD_END.x} ${FORWARD_END.y - TRACK_OFFSET}`,
    trackBD: `M ${FORWARD_START.x} ${FORWARD_START.y + TRACK_OFFSET} L ${FORWARD_END.x} ${FORWARD_END.y + TRACK_OFFSET}`,
    start: FORWARD_START,
    end: FORWARD_END,
  },
  back: {
    centerlineD: `M ${UTURN_P0.x} ${UTURN_P0.y} C ${UTURN_P1.x} ${UTURN_P1.y}, ${UTURN_P2.x} ${UTURN_P2.y}, ${UTURN_P3.x} ${UTURN_P3.y}`,
    trackAD: offsetCubicBezierD(UTURN_P0, UTURN_P1, UTURN_P2, UTURN_P3, -TRACK_OFFSET),
    trackBD: offsetCubicBezierD(UTURN_P0, UTURN_P1, UTURN_P2, UTURN_P3, TRACK_OFFSET),
    start: UTURN_P0,
    end: UTURN_P3,
  },
  lateral: {
    centerlineD: buildArcD(LATERAL_CX, LATERAL_CY, LATERAL_R, LATERAL_START_DEG, LATERAL_SWEEP_DEG),
    trackAD: buildArcD(LATERAL_CX, LATERAL_CY, LATERAL_R - TRACK_OFFSET, LATERAL_START_DEG, LATERAL_SWEEP_DEG),
    trackBD: buildArcD(LATERAL_CX, LATERAL_CY, LATERAL_R + TRACK_OFFSET, LATERAL_START_DEG, LATERAL_SWEEP_DEG),
    start: polarPoint(LATERAL_CX, LATERAL_CY, LATERAL_R, LATERAL_START_DEG),
    end: polarPoint(LATERAL_CX, LATERAL_CY, LATERAL_R, LATERAL_START_DEG + LATERAL_SWEEP_DEG),
  },
};

// Static transform centering + scaling the native 1024x1536 car artwork
// down into the CAR_WIDTH/CAR_HEIGHT footprint, nose-up. The per-frame
// transform (translate to the path point, rotate to the tangent) is
// applied on the parent <g> around this.
const CAR_LOCAL_TRANSFORM = `scale(${CAR_WIDTH / CAR_NATIVE_WIDTH}) translate(${-CAR_NATIVE_WIDTH / 2} ${-CAR_NATIVE_HEIGHT / 2})`;

// Precomputed lookup table for --ease-brand (cubic-bezier(0.16, 1, 0.3, 1)),
// used to advance `progress` non-linearly each frame — a fast-out, gentle
// finish reads as weight/momentum rather than a robotic constant speed.
function buildBezierEaseLUT(x1: number, y1: number, x2: number, y2: number, steps = 64) {
  const pts: Point[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const mt = 1 - t;
    pts.push({
      x: 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t,
      y: 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t,
    });
  }
  return pts;
}
const EASE_BRAND_LUT = buildBezierEaseLUT(0.16, 1, 0.3, 1);

function applyEaseBrand(u: number): number {
  if (u <= 0) return 0;
  if (u >= 1) return 1;
  let lo = 0;
  let hi = EASE_BRAND_LUT.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (EASE_BRAND_LUT[mid].x < u) lo = mid;
    else hi = mid;
  }
  const a = EASE_BRAND_LUT[lo];
  const b = EASE_BRAND_LUT[hi];
  const span = b.x - a.x;
  const t = span > 0 ? (u - a.x) / span : 0;
  return a.y + (b.y - a.y) * t;
}

interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  bornAt: number;
  life: number;
  baseRadius: number;
}

// Tuned for a dense, continuous, close-hugging cloud rather than a dotted
// trail: lower speed and a tight spread keep puffs from scattering off the
// path, and life long relative to DURATION_MS lets enough overlap to read
// as one trailing cloud, not individual dots.
function createSmokeParticle(x: number, y: number, travelAngleRad: number, now: number, burst: boolean): SmokeParticle {
  // Burst particles fan out wider and start with a small positional jitter
  // — without it, all of them spawn on the exact same point and their
  // first rendered frame composites into one over-dark solid blob instead
  // of a soft cloud, before velocity has had any time to separate them.
  const spread = burst ? 1.8 : 0.6;
  const backAngle = travelAngleRad + Math.PI + (Math.random() - 0.5) * spread;
  const speed = burst ? 6 + Math.random() * 4 : 2.4 + Math.random() * 2;
  const jitter = burst ? Math.random() * 2 : 0;
  const jitterAngle = Math.random() * Math.PI * 2;
  return {
    x: x + Math.cos(jitterAngle) * jitter,
    y: y + Math.sin(jitterAngle) * jitter,
    vx: Math.cos(backAngle) * speed,
    vy: Math.sin(backAngle) * speed - 1.2, // slight upward bias — smoke rises regardless of travel direction
    bornAt: now,
    life: burst ? 700 + Math.random() * 250 : 800 + Math.random() * 350,
    baseRadius: burst ? 3.2 + Math.random() * 1.6 : 2.4 + Math.random() * 1.2,
  };
}

export function CarDriftOverlay({
  direction,
  visible,
}: {
  direction: DriftDirection;
  visible: boolean;
}) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const centerlineRef = useRef<SVGPathElement>(null);
  const carRef = useRef<SVGGElement>(null);
  const haloARef = useRef<SVGPathElement>(null);
  const treadARef = useRef<SVGPathElement>(null);
  const haloBRef = useRef<SVGPathElement>(null);
  const treadBRef = useRef<SVGPathElement>(null);
  const smokePoolRef = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (!visible || reducedMotion) return;

    const centerlineNode = centerlineRef.current;
    const carNode = carRef.current;
    const haloANode = haloARef.current;
    const treadANode = treadARef.current;
    const haloBNode = haloBRef.current;
    const treadBNode = treadBRef.current;
    if (!centerlineNode || !carNode || !haloANode || !treadANode || !haloBNode || !treadBNode) return;

    // Rebound as non-null locals: `tick` below is handed to
    // requestAnimationFrame as a callback, and TS drops narrowing of the
    // ref reads across that closure boundary even though these are const.
    const centerline: SVGPathElement = centerlineNode;
    const car: SVGGElement = carNode;
    const haloA: SVGPathElement = haloANode;
    const treadA: SVGPathElement = treadANode;
    const haloB: SVGPathElement = haloBNode;
    const treadB: SVGPathElement = treadBNode;

    const centerlineLength = centerline.getTotalLength();
    const trackALength = treadA.getTotalLength();
    const trackBLength = treadB.getTotalLength();

    for (const [halo, tread, length] of [
      [haloA, treadA, trackALength],
      [haloB, treadB, trackBLength],
    ] as const) {
      halo.setAttribute("stroke-dasharray", `${length}`);
      tread.setAttribute("stroke-dasharray", `${length}`);
      halo.setAttribute("stroke-dashoffset", `${length}`);
      tread.setAttribute("stroke-dashoffset", `${length}`);
    }

    const particles: SmokeParticle[] = [];
    const startTime = performance.now();
    let lastFrameTime = startTime;
    let lastSmokeSpawn = 0;
    let rafId: number;

    // Emission-point burst: a cluster of larger puffs right where the
    // drift starts, gone before the trailing stream properly forms.
    const startTangent = centerline.getPointAtLength(Math.min(centerlineLength, 0.6));
    const startAngle = Math.atan2(startTangent.y - GEOMETRY[direction].start.y, startTangent.x - GEOMETRY[direction].start.x);
    for (let i = 0; i < SMOKE_BURST_COUNT; i++) {
      particles.push(createSmokeParticle(GEOMETRY[direction].start.x, GEOMETRY[direction].start.y, startAngle, startTime, true));
    }

    function renderSmoke(now: number) {
      const pool = smokePoolRef.current;
      for (let i = 0; i < pool.length; i++) {
        const circle = pool[i];
        if (!circle) continue;
        const particle = particles[i];
        if (!particle) {
          circle.setAttribute("opacity", "0");
          continue;
        }
        const lifeFrac = (now - particle.bornAt) / particle.life;
        // Kept deliberately low (vs. a single particle's "correct" full
        // opacity): with 30 particles overlapping in a dense trail, alpha
        // compositing stacks — a higher per-particle ceiling reads as a
        // solid dark clump near the car rather than a soft cloud.
        const opacity = lifeFrac < 0.15 ? (lifeFrac / 0.15) * 0.4 : 0.4 * (1 - (lifeFrac - 0.15) / 0.85);
        const radius = particle.baseRadius * (0.7 + 0.8 * lifeFrac);
        circle.setAttribute("cx", `${particle.x}`);
        circle.setAttribute("cy", `${particle.y}`);
        circle.setAttribute("r", `${radius}`);
        circle.setAttribute("opacity", `${Math.max(0, opacity)}`);
      }
    }

    function tick(now: number) {
      const dtSec = Math.min(0.05, (now - lastFrameTime) / 1000);
      lastFrameTime = now;

      const elapsed = now - startTime;
      const rawT = Math.min(1, elapsed / DURATION_MS);
      const progress = applyEaseBrand(rawT);

      const len = progress * centerlineLength;
      const p = centerline.getPointAtLength(len);
      const lookahead = centerline.getPointAtLength(Math.min(centerlineLength, len + 0.6));
      const angleRad = Math.atan2(lookahead.y - p.y, lookahead.x - p.x);
      const angleDeg = (angleRad * 180) / Math.PI;

      // Car position + rotation both read off the same point on the same
      // path — this is what makes "on path, facing forward" structural
      // rather than something to individually tune per mode.
      car.setAttribute("transform", `translate(${p.x} ${p.y}) rotate(${angleDeg + 90})`);

      // Tracks reveal via the SAME progress value, so the drawn portion
      // always ends exactly at the car's current position.
      const offsetA = trackALength * (1 - progress);
      const offsetB = trackBLength * (1 - progress);
      haloA.setAttribute("stroke-dashoffset", `${offsetA}`);
      treadA.setAttribute("stroke-dashoffset", `${offsetA}`);
      haloB.setAttribute("stroke-dashoffset", `${offsetB}`);
      treadB.setAttribute("stroke-dashoffset", `${offsetB}`);

      if (rawT < 1 && elapsed - lastSmokeSpawn > SMOKE_SPAWN_INTERVAL_MS) {
        lastSmokeSpawn = elapsed;
        if (particles.length < MAX_SMOKE_PARTICLES) {
          const rearX = p.x - Math.cos(angleRad) * (CAR_HEIGHT * 0.42);
          const rearY = p.y - Math.sin(angleRad) * (CAR_HEIGHT * 0.42);
          particles.push(createSmokeParticle(rearX, rearY, angleRad, now, false));
        }
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        if (now - particle.bornAt >= particle.life) {
          particles.splice(i, 1);
          continue;
        }
        particle.x += particle.vx * dtSec;
        particle.y += particle.vy * dtSec;
        particle.vx *= 0.94;
        particle.vy = particle.vy * 0.94 - 2 * dtSec;
      }

      renderSmoke(now);

      if (rawT < 1 || particles.length > 0) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [visible, direction, reducedMotion]);

  // Respect prefers-reduced-motion by skipping the animation outright;
  // RouteLoader's own slim progress bar (a separate, threshold-gated
  // element) still plays and is unaffected by this.
  if (reducedMotion) return null;

  const geo = GEOMETRY[direction];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-[190] flex items-center justify-center bg-canvas/90 backdrop-blur-sm pointer-events-none"
      aria-hidden="true"
    >
      <svg viewBox={`0 0 ${VIEWBOX_W} ${VIEWBOX_H}`} className="w-full max-w-3xl px-10" style={{ overflow: "visible" }}>
        <defs>
          {/* Chrome-adjacent gradient (reuses the site's existing chrome
              sheen stop for a rim highlight) over the brand red→black CTA
              gradient, so the car reads as "branded metal" rather than a
              flat silhouette in either theme. */}
          <linearGradient id="carBodyGradient" x1="10%" y1="0%" x2="90%" y2="100%">
            <stop offset="0%" stopColor="var(--chrome-stop-1)" stopOpacity={0.9} />
            <stop offset="38%" stopColor="var(--brand-red)" />
            <stop offset="100%" stopColor="var(--brand-black)" />
          </linearGradient>

          {/* Smoke is ink-colored: white against the dark theme's near-
              black canvas, dark against the light theme's near-white
              canvas — visible in both without per-theme branching. */}
          <radialGradient id="smokeGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--ink)" stopOpacity={0.6} />
            <stop offset="100%" stopColor="var(--ink)" stopOpacity={0} />
          </radialGradient>

          {visible && (
            <>
              <linearGradient
                id="trailFadeGradient"
                gradientUnits="userSpaceOnUse"
                x1={geo.start.x}
                y1={geo.start.y}
                x2={geo.end.x}
                y2={geo.end.y}
              >
                <stop offset="0%" stopColor="#ffffff" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#ffffff" stopOpacity={1} />
              </linearGradient>
              <mask id="trailFadeMask" maskUnits="userSpaceOnUse" x={0} y={0} width={VIEWBOX_W} height={VIEWBOX_H}>
                <rect x={0} y={0} width={VIEWBOX_W} height={VIEWBOX_H} fill="url(#trailFadeGradient)" />
              </mask>
            </>
          )}
        </defs>

        {visible && (
          <g key={direction}>
            {/* Reference-only centerline: never rendered, exists purely so
                the car can read its position/tangent off a real <path>
                via getPointAtLength — the single source of truth. */}
            <path ref={centerlineRef} d={geo.centerlineD} fill="none" stroke="none" />

            {/* Oldest portion of the trail fades out (mask gradient from
                the path's start to its end) so it reads as rubber
                dissipating, not a permanently drawn line. Tread is a fixed
                dark rubber color in both themes — a tire mark doesn't
                lighten in light mode — contrasted by the light halo
                underneath in dark theme; in light theme the halo is
                already invisible against the canvas and isn't needed for
                contrast, only laid down for consistency. (A tiled pattern
                fill of /tire-marks.svg was tried here first — it's a single
                skid-mark graphic, not a seamless texture, so tiling it at
                icon scale read as a sparse ladder of dots instead of a
                mark. A solid stroke reads correctly at this size.) */}
            <g mask="url(#trailFadeMask)">
              <path
                ref={haloARef}
                d={geo.trackAD}
                stroke="rgba(255,255,255,0.45)"
                strokeWidth={HALO_STROKE_WIDTH}
                strokeLinecap="round"
                fill="none"
              />
              <path
                ref={haloBRef}
                d={geo.trackBD}
                stroke="rgba(255,255,255,0.45)"
                strokeWidth={HALO_STROKE_WIDTH}
                strokeLinecap="round"
                fill="none"
              />
              <path ref={treadARef} d={geo.trackAD} stroke="rgba(20,18,18,0.85)" strokeWidth={TREAD_STROKE_WIDTH} strokeLinecap="round" fill="none" />
              <path ref={treadBRef} d={geo.trackBD} stroke="rgba(20,18,18,0.85)" strokeWidth={TREAD_STROKE_WIDTH} strokeLinecap="round" fill="none" />
            </g>

            {Array.from({ length: MAX_SMOKE_PARTICLES }).map((_, i) => (
              <circle
                key={i}
                ref={(el) => {
                  smokePoolRef.current[i] = el;
                }}
                cx={0}
                cy={0}
                r={0}
                opacity={0}
                fill="url(#smokeGradient)"
              />
            ))}

            <g ref={carRef} transform={`translate(${geo.start.x} ${geo.start.y})`}>
              <g transform={CAR_LOCAL_TRANSFORM}>
                <path
                  d={CAR_PATH_D}
                  fillRule="evenodd"
                  fill="url(#carBodyGradient)"
                  stroke="var(--ink)"
                  strokeOpacity={0.85}
                  strokeWidth={34}
                  strokeLinejoin="round"
                />
              </g>
            </g>
          </g>
        )}
      </svg>
    </motion.div>
  );
}
