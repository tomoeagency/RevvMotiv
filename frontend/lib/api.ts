import { FALLBACK_CATEGORIES, FALLBACK_REVIEWS } from "@/lib/constants";

// Central client for the Laravel backend — see
// .claude/skills/api-integration/SKILL.md for the fetch pattern and
// response-shape contract this file implements.

const API_URL = process.env.NEXT_PUBLIC_API_URL;
// Generic dark-grey blur placeholder for product photos (remote Cloudinary
// URLs — Next can't auto-generate a real blur hash for those the way it
// can for local/static imports), so every listing/detail image gets a
// skeleton-like fade-in instead of popping in abruptly once loaded.
export const PRODUCT_IMAGE_BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAD0lEQVR4nGOQwgEYhpYEAJ8xE4Ff8Up2AAAAAElFTkSuQmCC";

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface ProductVariant {
  id: number;
  product_id?: number;
  name: string;
  sku?: string | null;
  price: number;
  compare_at_price?: number | null;
  stock?: number;
  in_stock?: boolean;
  image?: string | null;
  attributes?: Record<string, string> | null;
  is_default?: boolean;
  sort_order?: number;
}

export interface ApiProduct {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: number; // rupees, NOT paise — confirmed against the live endpoint
  compare_at_price: number | null;
  in_stock: boolean;
  is_featured: boolean;
  images: string[];
  category: Category;
  variants?: ProductVariant[];
  created_at: string;
}

export interface ApiOrder {
  id: number;
  access_token?: string;
  total_amount: number; // post-discount — the amount the advance % is applied to
  advance_amount: number;
  remaining_amount: number;
  advance_percent_applied: number;
  discount_amount: number;
  coupon_code: string | null;
  payment_status: string;
  order_status: string;
  razorpay: {
    key_id: string;
    order_id: string | null;
    amount: number; // paise
    currency: string;
  };
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
}

export interface ApiCollection<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

export interface Review {
  id: number;
  product_id: number | null;
  customer_name: string;
  rating: number;
  comment: string;
  media_urls: string[];
  verified_purchase: boolean;
  product?: { id: number; title: string; slug: string };
  created_at: string;
}

export interface ProductReviewsResponse {
  data: Review[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    average_rating: number;
    // Laravel's pluck('count', 'rating') only includes star levels that
    // have at least one review — e.g. {"5": 10, "3": 2} — never assume
    // all 1-5 keys are present.
    rating_breakdown: Record<string, number>;
  };
}

export interface AnnouncementItem {
  id: number;
  text: string;
  link_url: string | null;
}

export interface Announcement {
  enabled: boolean;
  // "scroll": join all announcements into one continuous marquee.
  // "rotate": show one at a time, switching every rotate_duration seconds.
  display_mode: "scroll" | "rotate";
  // Admin-configurable seconds value, used directly as the marquee's CSS
  // animation-duration (scroll mode only).
  scroll_speed: number;
  rotate_duration: number;
  announcements: AnnouncementItem[];
}

export interface GalleryItem {
  id: number;
  media_url: string;
  media_type: "image" | "video";
  caption: string | null;
}

export interface Policy {
  slug: string;
  title: string;
  content: string; // Markdown
  updated_at: string;
}

export const POLICY_SLUGS = [
  "refund-policy",
  "shipping-policy",
  "contact-information",
  "terms-of-service",
  "legal-notice",
  "privacy-policy",
] as const;

export type PolicySlug = (typeof POLICY_SLUGS)[number];

export interface SiteSettings {
  whatsapp_number: string;
  instagram_handle: string;
  contact_email: string;
  razorpay_advance_percent?: number;
}

export interface ProjectListItem {
  id: number;
  title: string;
  slug: string;
  car_make: string;
  car_model: string;
  cover_image: string;
  description: string;
  created_at: string;
}

export const PROJECT_VIEW_TYPES = [
  "front",
  "rear",
  "left",
  "right",
  "top",
  "bottom",
  "interior",
] as const;

export type ProjectViewType = (typeof PROJECT_VIEW_TYPES)[number];

export interface ProjectView {
  id: number;
  view_type: ProjectViewType;
  images: string[];
  work_description: string;
}

export interface ProjectDetail extends ProjectListItem {
  views: ProjectView[];
}

export interface LeadPayload {
  name: string;
  phone: string;
}

export interface EnquiryPayload {
  name: string;
  phone: string;
  email: string;
  message: string;
}

export interface OrderItemPayload {
  product_id: number;
  variant_id?: number | null;
  variant_name?: string | null;
  quantity: number;
}

export interface OrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  coupon_code?: string;
  payment_option?: "advance" | "full";
  items: OrderItemPayload[];
}

export interface AvailableCoupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
  min_order_amount: number | null;
  expires_at: string | null;
  applies_to: string;
}

export interface CouponPreview {
  code: string;
  discount_amount: number;
  subtotal: number;
  total_after_discount: number;
  applies_to: string;
}

export class ApiRequestError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, body: ApiError) {
    super(body.message);
    this.status = status;
    this.errors = body.errors;
  }
}

function apiUrl(path: string): string {
  if (typeof window !== "undefined") {
    return path;
  }

  let base =
    process.env.API_BASE_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:8000"
      : "http://api.revvmotiv.com");

  if (base.includes("https://api.revvmotiv.com")) {
    base = base.replace("https://", "http://");
  }

  base = base.replace(/\/api(\/v1)?\/?$/, "").replace(/\/+$/, "");

  return `${base}${path}`;
}

// Server-side fetch (product listing, product detail, homepage) — the
// pages that need to be indexed. See api-integration skill.
export async function getProducts(params?: {
  category?: string;
  featured?: boolean;
  perPage?: number;
  page?: number;
  search?: string;
}): Promise<ApiCollection<ApiProduct>> {
  try {
    const query = new URLSearchParams();
    if (params?.category) query.set("category", params.category);
    if (params?.featured) query.set("featured", "true");
    if (params?.perPage) query.set("per_page", String(params.perPage));
    if (params?.page) query.set("page", String(params.page));
    if (params?.search) query.set("search", params.search);

    const qs = query.toString();
    const res = await fetch(apiUrl(`/api/v1/products${qs ? `?${qs}` : ""}`), {
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } };
    }

    return res.json();
  } catch {
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } };
  }
}

export async function getProduct(idOrSlug: string): Promise<ApiProduct | null> {
  try {
    const res = await fetch(apiUrl(`/api/v1/products/${idOrSlug}`), {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const { data }: ApiResponse<ApiProduct> = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function getProductReviews(
  productIdOrSlug: string,
  perPage = 10
): Promise<ProductReviewsResponse> {
  try {
    const res = await fetch(
      apiUrl(`/api/v1/products/${productIdOrSlug}/reviews?per_page=${perPage}`),
      { next: { revalidate: 300 } }
    );

    if (!res.ok) {
      return {
        data: [],
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: perPage,
          total: 0,
          average_rating: 5,
          rating_breakdown: {},
        },
      };
    }

    return res.json();
  } catch {
    return {
      data: [],
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: perPage,
        total: 0,
        average_rating: 5,
        rating_breakdown: {},
      },
    };
  }
}

// Server-side fetch (homepage "Top Reviews" section).
export async function getFeaturedReviews(): Promise<ApiResponse<Review[]>> {
  try {
    const res = await fetch(apiUrl("/api/v1/reviews/featured"), {
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: FALLBACK_REVIEWS };
    }

    const body = await res.json();
    return body.data && body.data.length > 0 ? body : { data: FALLBACK_REVIEWS };
  } catch {
    return { data: FALLBACK_REVIEWS };
  }
}

// Client-side fetch — the floating trust panel (shown alongside the cart
// drawer, a client-only interaction) needs this on demand rather than at
// page-render time, unlike the homepage's server-rendered reviews section.
export async function getFeaturedReviewsClient(): Promise<Review[]> {
  try {
    const res = await fetch(apiUrl("/api/v1/reviews/featured"));
    if (!res.ok) {
      return [];
    }
    const body: ApiResponse<Review[]> = await res.json();
    return body.data;
  } catch {
    return [];
  }
}

// Server-side fetch (policy pages) — real, indexable legal/policy content.
export async function getPolicy(slug: string): Promise<Policy | null> {
  try {
    const res = await fetch(apiUrl(`/api/v1/policies/${slug}`), {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return null;
    }

    const { data }: ApiResponse<Policy> = await res.json();
    return data;
  } catch {
    return null;
  }
}

// Server-side fetch (Footer) — real WhatsApp/Instagram/contact details.
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(apiUrl("/api/v1/site-settings"), {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return {
        whatsapp_number: "+918368343232",
        instagram_handle: "revvmotiv",
        contact_email: "orders@revvmotiv.com",
      };
    }

    const { data }: ApiResponse<SiteSettings> = await res.json();
    return data;
  } catch {
    return {
      whatsapp_number: "+918368343232",
      instagram_handle: "revvmotiv",
      contact_email: "orders@revvmotiv.com",
    };
  }
}

// Server-side fetch (Our Work listing) — real project case studies, meant
// to be indexed like product pages.
const FALLBACK_PROJECTS: ProjectDetail[] = [
  {
    id: 101,
    title: "2019 Hyundai Verna — Stealth Aero & Carbon Edition",
    slug: "2019-hyundai-verna-stealth-aero-edition",
    car_make: "Hyundai",
    car_model: "Verna 2019",
    description:
      "Complete dark-stealth aero package: precision 3D-scanned front carbon lip splitter with red accents, gloss black de-chromed cascading grille, concave forged satin black alloys with 3D white REVV MOTIV tyre lettering, and an aggressive quad-fin carbon rear diffuser with quad titanium tips.",
    cover_image: "/images/projects/verna_cover.webp",
    created_at: new Date().toISOString(),
    views: [
      {
        id: 1,
        view_type: "front",
        work_description:
          "Precision 3D laser-scanned carbon fiber front splitter with subtle red aero accent trim and de-chromed gloss black grille.",
        images: ["/images/projects/verna_front.webp"],
      },
      {
        id: 2,
        view_type: "rear",
        work_description:
          "Aggressive quad-fin carbon fiber rear diffuser paired with quad titanium burnt exhaust tips and gloss black ducktail spoiler.",
        images: ["/images/projects/verna_rear.webp"],
      },
    ],
  },
  {
    id: 102,
    title: "2025 Kia Sonet GT-Line — Wide Aero & Carbon Package",
    slug: "2025-kia-sonet-gt-line-aero-package",
    car_make: "Kia",
    car_model: "Sonet 2025",
    description:
      "Matte pewter gray compact SUV build featuring RevvMotiv carbon fiber front splitter with red GT-Line corner winglets, floating gloss black roof wrap, rally-style roof spoiler with aero endplates, and multi-fin carbon rear diffuser.",
    cover_image: "/images/projects/sonet_cover.webp",
    created_at: new Date().toISOString(),
    views: [
      {
        id: 3,
        view_type: "front",
        work_description:
          "Front carbon fiber lip splitter with red GT-Line corner winglets and gloss black tiger-nose grille styling.",
        images: ["/images/projects/sonet_front.webp"],
      },
      {
        id: 4,
        view_type: "rear",
        work_description:
          "Extended rally-inspired carbon fiber roof wing spoiler with aero endplates and deep multi-fin rear diffuser.",
        images: ["/images/projects/sonet_rear.webp"],
      },
    ],
  },
  {
    id: 103,
    title: "2023 Tata Tiago — JTP-Inspired Track Hatch Build",
    slug: "2023-tata-tiago-jtp-track-look-build",
    car_make: "Tata",
    car_model: "Tiago 2023",
    description:
      "Fiery magma orange hot hatch build equipped with high-downforce front splitter with red anodized support struts, rally-style carbon fiber roof wing spoiler, center-exit quad diffuser, and motorsport lightweight wheels with white tyre lettering.",
    cover_image: "/images/projects/tiago_cover.webp",
    created_at: new Date().toISOString(),
    views: [
      {
        id: 5,
        view_type: "front",
        work_description:
          "Motorsport front carbon splitter with red anodized tie-rod support struts and lowered track suspension setup.",
        images: ["/images/projects/tiago_front.webp"],
      },
      {
        id: 6,
        view_type: "rear",
        work_description:
          "Carbon fiber rally roof wing spoiler, center dual-exit diffuser, and smoked LED taillamp treatment.",
        images: ["/images/projects/tiago_rear.webp"],
      },
    ],
  },
  {
    id: 104,
    title: "2023 Maruti Swift — Full Aero Kit",
    slug: "2023-maruti-swift-full-aero-kit",
    car_make: "Maruti Suzuki",
    car_model: "Swift",
    description:
      "Complete exterior transformation: carbon front lip, side skirt extensions, and a rear diffuser to match. Customer wanted an aggressive stance without touching the suspension.",
    cover_image: "/images/projects/swift_cover.png",
    created_at: new Date().toISOString(),
    views: [
      {
        id: 7,
        view_type: "front",
        work_description:
          "V-style carbon front lip fitted with factory-matched clips, no drilling. Repainted the surrounding bumper section for a seamless line.",
        images: ["/images/projects/swift_front.png"],
      },
      {
        id: 8,
        view_type: "rear",
        work_description:
          "Rear diffuser insert fitted below the bumper, paired with a dual-exit exhaust tip upgrade for visual balance.",
        images: ["/images/projects/swift_rear.png"],
      },
    ],
  },
  {
    id: 105,
    title: "Hyundai i20 N Line — Blackout Package",
    slug: "hyundai-i20-n-line-blackout-package",
    car_make: "Hyundai",
    car_model: "i20 N Line",
    description:
      "Full gloss-black trim package: mirror caps, grille surround, and sequential tails, finished with a satin roof wrap for contrast against the factory red paint.",
    cover_image: "/images/projects/i20_cover.png",
    created_at: new Date().toISOString(),
    views: [
      {
        id: 9,
        view_type: "front",
        work_description:
          "Grille surround and badge blacked out, factory chrome removed entirely for a cleaner front end.",
        images: ["/images/projects/i20_front.png"],
      },
      {
        id: 10,
        view_type: "rear",
        work_description:
          "OLED sequential tail lights installed plug-and-play, no wiring modifications needed on this generation.",
        images: ["/images/projects/i20_rear.png"],
      },
    ],
  },
  {
    id: 106,
    title: "Volkswagen Polo GT — Track Look Build",
    slug: "volkswagen-polo-gt-track-look-build",
    car_make: "Volkswagen",
    car_model: "Polo GT",
    description:
      "Motorsport-inspired refresh for a customer who wanted a track-day look for weekend use — front splitter, tyre stickers, and an audio upgrade for the drive there.",
    cover_image: "/images/projects/polo_cover.png",
    created_at: new Date().toISOString(),
    views: [
      {
        id: 11,
        view_type: "front",
        work_description:
          "Wind-tunnel profiled front splitter for a lower, more planted stance at speed.",
        images: ["/images/projects/polo_front.png"],
      },
    ],
  },
];

export async function getProjects(): Promise<ApiCollection<ProjectListItem>> {
  try {
    const res = await fetch(apiUrl("/api/v1/projects"), {
      cache: "no-store",
    });

    if (res.ok) {
      const body = await res.json();
      if (body?.data && Array.isArray(body.data) && body.data.length > 0) {
        return body;
      }
    }
  } catch {}

  return {
    data: FALLBACK_PROJECTS,
    meta: { current_page: 1, last_page: 1, per_page: 10, total: FALLBACK_PROJECTS.length },
  };
}

// Server-side fetch (Gallery page) — real admin-curated media, meant to
// be indexed the same way the rest of the content pages are.
export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const res = await fetch(apiUrl("/api/v1/gallery"), {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    const { data }: ApiResponse<GalleryItem[]> = await res.json();
    return data;
  } catch {
    return [];
  }
}

// Server-side fetch (Our Work detail) — powers generateMetadata and the
// initial render of the angle selector.
export async function getProject(slug: string): Promise<ProjectDetail | null> {
  try {
    const res = await fetch(apiUrl(`/api/v1/projects/${slug}`), {
      cache: "no-store",
    });

    if (res.ok) {
      const { data }: ApiResponse<ProjectDetail> = await res.json();
      if (data) return data;
    }
  } catch {}

  const fallback = FALLBACK_PROJECTS.find((p) => p.slug === slug);
  return fallback ?? null;
}

const DEFAULT_CATEGORIES: Category[] = [...FALLBACK_CATEGORIES];

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const res = await fetch(apiUrl("/api/v1/categories"), {
      cache: "no-store",
    });

    if (res.ok) {
      const json = await res.json();
      if (json?.data && Array.isArray(json.data) && json.data.length > 0) {
        return json;
      }
    }
  } catch {}

  return { data: DEFAULT_CATEGORIES };
}

// Client-side fetch (checkout) — genuinely interactive, not meant to be
// crawled. See api-integration skill.
export async function createOrder(payload: OrderPayload): Promise<ApiOrder> {
  const res = await fetch(apiUrl("/api/v1/orders"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json();

  if (!res.ok) {
    throw new ApiRequestError(res.status, body as ApiError);
  }

  return (body as ApiResponse<ApiOrder>).data;
}

// Client-side fetch (checkout — "available coupons" list). Never cached:
// the admin toggles is_public per coupon and that should show up on the
// storefront immediately. Swallows failures like getAnnouncement — a coupon
// list that fails to load just means the section doesn't render, never a
// broken checkout page.
export async function getAvailableCoupons(): Promise<AvailableCoupon[]> {
  try {
    const res = await fetch(apiUrl("/api/v1/coupons/available"), {
      cache: "no-store",
    });
    if (!res.ok) return [];

    const { data }: ApiResponse<AvailableCoupon[]> = await res.json();
    return data;
  } catch {
    return [];
  }
}

// Client-side fetch (checkout — "Apply" button). Read-only preview against
// the same discount logic real order creation uses, so the customer sees
// the real discount before paying, not just after.
export async function previewCoupon(payload: {
  coupon_code: string;
  items: OrderItemPayload[];
}): Promise<CouponPreview> {
  const res = await fetch(apiUrl("/api/v1/coupons/preview"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const body = await res.json();

  if (!res.ok) {
    throw new ApiRequestError(res.status, body as ApiError);
  }

  return (body as ApiResponse<CouponPreview>).data;
}

// Client-side fetch (order-confirmation polling) — payment_status changes
// asynchronously via Razorpay webhook, so this must never be cached.
export async function getOrder(id: number | string, token?: string): Promise<ApiOrder> {
  const qs = token ? `?token=${encodeURIComponent(token)}` : "";
  const res = await fetch(apiUrl(`/api/v1/orders/${id}${qs}`), {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to load order (${res.status})`);
  }

  const { data }: ApiResponse<ApiOrder> = await res.json();
  return data;
}

// Client-side fetch (announcement strip) — decorative, not indexable, and
// the endpoint doesn't exist on the backend yet (separate session is still
// building it). Swallows failures and returns null rather than throwing,
// so a missing/broken endpoint just means the strip doesn't render — never
// a broken page. Never cached: an admin-edited announcement should show up
// without a redeploy.
export async function getAnnouncement(): Promise<Announcement | null> {
  try {
    const res = await fetch(apiUrl("/api/v1/announcement"), {
      cache: "no-store",
    });
    if (!res.ok) return null;

    const { data }: ApiResponse<Announcement> = await res.json();
    return data;
  } catch {
    return null;
  }
}

// Client-side fetch (consultant popup — quick lead capture). Endpoint
// doesn't exist yet; throws ApiRequestError like createOrder so the caller
// can show a normal error state rather than crash.
export async function createLead(payload: LeadPayload): Promise<void> {
  const res = await fetch(apiUrl("/api/v1/leads"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Something went wrong." }));
    throw new ApiRequestError(res.status, body as ApiError);
  }
}

// Client-side fetch (consultant popup — full enquiry form).
export async function createEnquiry(payload: EnquiryPayload): Promise<void> {
  const res = await fetch(apiUrl("/api/v1/enquiries"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: "Something went wrong." }));
    throw new ApiRequestError(res.status, body as ApiError);
  }
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}
