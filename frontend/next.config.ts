import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // /products (the old catalog listing) is superseded by /shop — /products
  // /[slug] (product detail) is untouched and still lives here, this only
  // redirects the exact listing route. Query params (e.g. ?category=x)
  // carry over automatically since `source` doesn't declare/consume them.
  async rewrites() {
    let backendUrl =
      process.env.API_BASE_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      (process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:8000"
        : "http://api.revvmotiv.com");

    if (backendUrl.includes("https://api.revvmotiv.com")) {
      backendUrl = backendUrl.replace("https://", "http://");
    }

    backendUrl = backendUrl.replace(/\/api(\/v1)?\/?$/, "").replace(/\/+$/, "");

    return [
      {
        source: "/uploads/:path*",
        destination: `${backendUrl}/uploads/:path*`,
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
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://api.razorpay.com; connect-src 'self' https://checkout.razorpay.com https://api.razorpay.com https://lumberjack.razorpay.com https://api.revvmotiv.com http://api.revvmotiv.com http://127.0.0.1:8000; frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com; img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com https://api.revvmotiv.com http://api.revvmotiv.com https://*.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'self' https://checkout.razorpay.com; frame-ancestors 'none';",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 86400,
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
