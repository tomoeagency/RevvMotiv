// No backend endpoint for this content exists yet (not in the
// api-integration skill's known endpoints, unlike reviews/recent-purchases).
// Until there's a real "builds/reels" data source, this is a static photo
// gallery only — no fabricated view counts, no fake video/Play affordance.
// Shared between ReelsSection (homepage) and TrustPanelClient (cart panel)
// so both point at the same one source instead of drifting copies.
export const GARAGE_GALLERY = [
  {
    id: 1,
    title: "Carbon Lip Install",
    img: "/images/reels/reel_carbon_lip.png",
  },
  {
    id: 2,
    title: "Night Run Aesthetics",
    img: "/images/reels/reel_night_run.png",
  },
  {
    id: 3,
    title: "Exhaust Sound Check",
    img: "/images/reels/reel_exhaust_check.png",
  },
  {
    id: 4,
    title: "Track Day Prep",
    img: "/images/reels/reel_track_prep.png",
  },
];
