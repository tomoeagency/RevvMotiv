import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /products (the old catalog listing) is superseded by /shop — /products
  // /[slug] (product detail) is untouched and still lives here, this only
  // redirects the exact listing route. Query params (e.g. ?category=x)
  // carry over automatically since `source` doesn't declare/consume them.
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://api.revvmotiv.com/api/:path*",
      },
      {
        source: "/uploads/:path*",
        destination: "http://api.revvmotiv.com/uploads/:path*",
      },
    ];
  },
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
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "api.revvmotiv.com",
      },
      {
        protocol: "http",
        hostname: "api.revvmotiv.com",
      },
      {
        protocol: "http",
        hostname: "3xe.b8b.mytemp.website",
      },
      {
        protocol: "https",
        hostname: "3xe.b8b.mytemp.website",
      },
    ],
  },
};

export default nextConfig;
