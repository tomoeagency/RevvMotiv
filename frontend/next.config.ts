import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /products (the old catalog listing) is superseded by /shop — /products
  // /[slug] (product detail) is untouched and still lives here, this only
  // redirects the exact listing route. Query params (e.g. ?category=x)
  // carry over automatically since `source` doesn't declare/consume them.
  async redirects() {
    return [
      {
        source: "/products",
        destination: "/shop",
        permanent: true,
      },
      // "Splitters/Side Skirts" was seeded with a missing hyphen
      // (splittersside-skirts) — fixed at the data level (see backend
      // migration 2026_08_10_064606), but any link/bookmark/indexed page
      // built against the old slug needs to keep resolving to the
      // category rather than silently returning an empty filtered grid.
      {
        source: "/shop",
        has: [{ type: "query", key: "category", value: "splittersside-skirts" }],
        destination: "/shop?category=splitters-side-skirts",
        permanent: true,
      },
    ];
  },
  images: {
    // TODO: remove once product/hero images come from the real backend/CDN —
    // Unsplash is only used for ai-studio-source placeholder data.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Review photos/videos (and eventually product media) come from
        // Cloudinary per the backend's media-storage convention.
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
