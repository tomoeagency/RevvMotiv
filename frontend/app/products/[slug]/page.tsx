import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, Video, CheckCircle2 } from "lucide-react";
import { getProduct, getProducts, getProductReviews, formatPrice } from "@/lib/api";
import { ProductDetailInteractive } from "@/app/components/ProductDetailInteractive";
import { ProductVideoWidget } from "@/app/components/ProductVideoWidget";
import { ReviewsSection } from "@/app/components/ReviewsSection";
import { ClosingCta } from "@/app/components/ClosingCta";
import { ProductCard } from "@/app/components/ProductCard";

const RELATED_COUNT = 4;

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found — RevvMotiv" };
  }

  const desc = product.description?.slice(0, 160) || `${product.title} - High quality custom automotive parts by RevvMotiv.`;

  return {
    title: `${product.title} — RevvMotiv`,
    description: desc,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.title,
      description: desc,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [{ url: "https://revvmotiv.com/images/logo.png" }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  const nonce = (await headers()).get("x-nonce") || undefined;

  if (!product) {
    notFound();
  }

  const [reviews, { data: sameCategoryProducts }] = await Promise.all([
    getProductReviews(slug),
    getProducts({ category: product.category.slug, perPage: RELATED_COUNT + 1 }),
  ]);
  const relatedProducts = sameCategoryProducts
    .filter((p) => p.id !== product.id)
    .slice(0, RELATED_COUNT);

  const hasRealReviews = reviews?.data && reviews.data.length > 0;
  const reviewCount = reviews?.meta?.total || reviews?.data?.length || 0;
  const avgRating = reviews?.meta?.average_rating || 5;

  const productSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || `${product.title} - Custom automotive styling upgrade by RevvMotiv.`,
    image: product.images && product.images.length > 0 ? product.images : ["https://revvmotiv.com/images/logo.png"],
    sku: `RM-${product.id}`,
    category: product.category.name,
    brand: {
      "@type": "Brand",
      name: "RevvMotiv",
    },
    offers: {
      "@type": "Offer",
      url: `https://revvmotiv.com/products/${product.slug}`,
      price: product.price,
      priceCurrency: "INR",
      priceValidUntil: "2026-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.in_stock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "RevvMotiv",
      },
    },
  };

  if (hasRealReviews) {
    productSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating,
      reviewCount: reviewCount,
      bestRating: "5",
      worstRating: "1",
    };
    productSchema.review = reviews.data.slice(0, 5).map((rev) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: rev.customer_name || "Verified Customer",
      },
      datePublished: rev.created_at || new Date().toISOString(),
      reviewRating: {
        "@type": "Rating",
        ratingValue: rev.rating,
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: rev.comment,
    }));
  }

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://revvmotiv.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: "https://revvmotiv.com/shop",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.category.name,
        item: `https://revvmotiv.com/shop?category=${encodeURIComponent(product.category.slug)}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.title,
        item: `https://revvmotiv.com/products/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <script
        type="application/ld+json"
        nonce={nonce}
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="pt-6 sm:pt-8 md:pt-12 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Visual Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-ink-subtle mb-8">
          <Link href="/" className="hover:text-ink transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-ink transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category.slug}`} className="hover:text-ink transition-colors">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-ink font-semibold truncate max-w-[200px] sm:max-w-xs">{product.title}</span>
        </nav>

        <ProductDetailInteractive
          product={product}
          reviewsMeta={reviews?.meta}
        />

        {product.video_url && (
          <ProductVideoWidget videoUrl={product.video_url} title={product.title} />
        )}

        {/* Product FAQ Accordion / Quick Answers (AEO) */}
        <section className="mt-16 pt-12 border-t border-hairline max-w-3xl">
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
            Product Questions & Answers
          </span>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight mb-6 text-ink">
            Frequently Asked About This Upgrade
          </h2>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-hairline bg-surface">
              <h3 className="text-sm font-bold text-ink mb-1.5">
                Does this {product.title} require bumper cutting or drilling?
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Most RevvMotiv splitters and diffusers use factory underbody clips and mounting holes for direct bolt-on fitment. For high-downforce applications, optional stainless steel support hardware is included.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-hairline bg-surface">
              <h3 className="text-sm font-bold text-ink mb-1.5">
                How long will it take to arrive at my address?
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Orders are dispatched within 24–48 hours in reinforced protective crating. Transit time is 3–5 business days for major metropolitan areas and 5–7 business days for all other PIN codes across India.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-hairline bg-surface">
              <h3 className="text-sm font-bold text-ink mb-1.5">
                Can I pay partially online and balance on Cash on Delivery?
              </h3>
              <p className="text-xs text-ink-muted leading-relaxed">
                Yes. At checkout, you can choose to pay a 20% advance online via Razorpay (UPI, Credit/Debit card, Net Banking) and the remaining 80% balance on delivery.
              </p>
            </div>
          </div>
        </section>

        <ReviewsSection
          productId={product.id}
          productTitle={product.title}
          reviews={reviews}
        />

        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-hairline">
            <span className="text-xs font-bold text-[var(--brand-red)] uppercase tracking-widest block mb-1">
              {product.category.name}
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8 text-ink">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </section>
        )}
      </div>

      <ClosingCta
        heading="Still Deciding?"
        body="Talk to our technicians on WhatsApp about fitment and vehicle compatibility before you order."
      />
    </>
  );
}
