import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://revvmotiv.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/checkout", "/cart", "/order-confirmation/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
