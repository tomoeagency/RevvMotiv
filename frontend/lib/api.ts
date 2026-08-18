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
  created_at: string;
}

export interface ApiOrder {
  id: number;
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
  if (API_URL) {
    return `${API_URL}${path}`;
  }
  if (typeof window !== "undefined") {
    return path;
  }
  return `http://api.revvmotiv.com${path}`;
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
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return { data: [] };
    }

    return res.json();
  } catch {
    return { data: [] };
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
export async function getProjects(): Promise<ApiCollection<ProjectListItem>> {
  try {
    const res = await fetch(apiUrl("/api/v1/projects"), {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return { data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
    }

    return res.json();
  } catch {
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
  }
}

// Server-side fetch (Gallery page) — real admin-curated media, meant to
// be indexed the same way the rest of the content pages are.
export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const res = await fetch(apiUrl("/api/v1/gallery"), {
      next: { revalidate: 300 },
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
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      return null;
    }

    const { data }: ApiResponse<ProjectDetail> = await res.json();
    return data;
  } catch {
    return null;
  }
}

export async function getCategories(): Promise<ApiResponse<Category[]>> {
  try {
    const res = await fetch(apiUrl("/api/v1/categories"), {
      cache: "no-store",
    });

    if (!res.ok) {
      return { data: [] };
    }

    return res.json();
  } catch {
    return { data: [] };
  }
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
export async function getOrder(id: number | string): Promise<ApiOrder> {
  const res = await fetch(apiUrl(`/api/v1/orders/${id}`), {
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
