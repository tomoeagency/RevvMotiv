import type { MetadataRoute } from "next";
import { getProducts, getProjects, getCategories } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://revvmotiv.com";

  // 1. Static Core Landing Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/gallery`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/policies/shipping-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/refund-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/contact-information`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/policies/legal-notice`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 2. Dynamic Category Routes
  let categoryRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: categories } = await getCategories();
    if (categories && Array.isArray(categories)) {
      categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/shop?category=${encodeURIComponent(cat.slug)}`,
        lastModified: new Date(),
        changeFrequency: "daily",
        priority: 0.85,
      }));
    }
  } catch (error) {
    console.error("Failed to fetch categories for sitemap:", error);
  }

  // 3. Dynamic Product routes with complete pagination
  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    let page = 1;
    let hasMore = true;
    while (hasMore) {
      const res = await getProducts({ page, perPage: 50 });
      if (res.data && res.data.length > 0) {
        for (const product of res.data) {
          productRoutes.push({
            url: `${baseUrl}/products/${product.slug}`,
            lastModified: new Date(product.created_at || Date.now()),
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      }
      if (page >= (res.meta?.last_page || 1) || res.data.length === 0) {
        hasMore = false;
      } else {
        page++;
      }
    }
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error);
  }

  // 4. Dynamic Work Project routes
  let projectRoutes: MetadataRoute.Sitemap = [];
  try {
    const { data: projects } = await getProjects();
    projectRoutes = projects.map((project) => ({
      url: `${baseUrl}/work/${project.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Failed to fetch projects for sitemap:", error);
  }

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...projectRoutes];
}
