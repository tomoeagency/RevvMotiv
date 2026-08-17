// No backend endpoint for this content exists yet (not in the
// api-integration skill's known endpoints, unlike reviews/recent-purchases).
// Until there's a real "builds/reels" data source, this is a static photo
// gallery only — no fabricated view counts, no fake video/Play affordance.
// Shared between ReelsSection (homepage) and TrustPanelClient (cart panel)
// so both point at the same one source instead of drifting copies.
export interface GarageReel {
  id: number;
  title: string;
  category: string;
  car: string;
  img: string;
  views: string;
  likes: string;
  comments: string;
  duration: string;
  audio: string;
  description: string;
  tag: string;
}

export const GARAGE_GALLERY: GarageReel[] = [
  {
    id: 1,
    title: "Carbon Lip Splitter Fitment",
    category: "Aero Installation",
    car: "2024 Maruti Brezza ZXi",
    img: "/images/reels/reel_carbon_lip.webp",
    views: "54.2K",
    likes: "4.8K",
    comments: "186",
    duration: "0:42",
    audio: "RevvMotiv Workshop — Original Audio",
    description: "Precision laser alignment and 3M + mechanical bracket mounting for zero high-speed vibration.",
    tag: "#BrezzaAero",
  },
  {
    id: 2,
    title: "Midnight Boost & Aero Run",
    category: "Street Testing",
    car: "Hyundai i20 N-Line",
    img: "/images/reels/reel_night_run.webp",
    views: "128.5K",
    likes: "11.4K",
    comments: "492",
    duration: "0:35",
    audio: "Twin Exhaust Pop & Bangs — N-Line Boost",
    description: "High-speed aerodynamic stability test after fitting our dual-fin rear diffuser and side skirts.",
    tag: "#i20NLine",
  },
  {
    id: 3,
    title: "Valved Exhaust Cold Start Revs",
    category: "Sound Check",
    car: "Volkswagen Polo GT TSI",
    img: "/images/reels/reel_exhaust_check.webp",
    views: "89.1K",
    likes: "8.2K",
    comments: "310",
    duration: "0:28",
    audio: "Catless Downpipe + Valved System",
    description: "Pure acoustic bliss. Wireless remote valve switch opens straight pipe mode instantly.",
    tag: "#PoloGT",
  },
  {
    id: 4,
    title: "Track Day Stance & Coilovers",
    category: "Track Setup",
    car: "Maruti Swift Sport Edition",
    img: "/images/reels/reel_track_prep.webp",
    views: "67.9K",
    likes: "6.1K",
    comments: "224",
    duration: "0:49",
    audio: "RevvMotiv Track Prep Sound",
    description: "Dialing in camber angles and tire clearance for maximum cornering grip on track day.",
    tag: "#SwiftTrack",
  },
];
