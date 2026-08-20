import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://revvmotiv.com";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/checkout",
          "/cart",
          "/order-confirmation/",
        ],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
          "FacebookBot",
          "Bytespider",
          "cohere-ai",
        ],
        allow: [
          "/",
          "/llms.txt",
          "/llms-full.txt",
          "/.well-known/ai-plugin.json",
          "/.well-known/llms.txt",
        ],
        disallow: [
          "/admin/",
          "/api/",
          "/checkout",
          "/cart",
          "/order-confirmation/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
