import { NextResponse } from "next/server";
import { getProducts, getProjects } from "@/lib/api";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://revvmotiv.com";

  const [productsRes, projectsRes] = await Promise.all([
    getProducts({ perPage: 25 }).catch(() => ({ data: [] })),
    getProjects().catch(() => ({ data: [] })),
  ]);

  const products = productsRes.data || [];
  const projects = projectsRes.data || [];

  const items = [
    ...products.map((p) => ({
      title: `${p.title} — RevvMotiv Aero`,
      link: `${baseUrl}/products/${p.slug}`,
      description: p.description || "RevvMotiv 1:1 OEM Fitment Aero Component",
      pubDate: new Date(p.created_at || Date.now()).toUTCString(),
      guid: `product-${p.id}`,
    })),
    ...projects.map((proj) => ({
      title: `Build Showcase: ${proj.title}`,
      link: `${baseUrl}/work/${proj.slug}`,
      description: proj.description || "RevvMotiv Custom Workshop Project",
      pubDate: new Date(proj.created_at || Date.now()).toUTCString(),
      guid: `project-${proj.id}`,
    })),
  ];

  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>RevvMotiv — Custom Car Styling, Splitters &amp; Aero Parts</title>
  <link>${baseUrl}</link>
  <description>Latest carbon fiber styling parts, 3D laser splitters, diffusers, and workshop projects from RevvMotiv India.</description>
  <language>en-IN</language>
  <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  ${items
    .map(
      (item) => `
  <item>
    <title><![CDATA[${item.title}]]></title>
    <link>${item.link}</link>
    <guid isPermaLink="false">${item.guid}</guid>
    <pubDate>${item.pubDate}</pubDate>
    <description><![CDATA[${item.description}]]></description>
  </item>`
    )
    .join("")}
</channel>
</rss>`;

  return new NextResponse(rssXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
