import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ShieldCheck, Truck, Video, CheckCircle2 } from "lucide-react";
import { getProduct, getProducts, getProductReviews, formatPrice } from "@/lib/api";
import { AddToCartButton } from "@/app/components/AddToCartButton";
import { ProductGallery } from "@/app/components/ProductGallery";
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

  const desc = product.description.slice(0, 160);

  return {
    title: `${product.title} — RevvMotiv`,
    description: desc,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.title,
      description: desc,
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
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

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    sku: `RM-${product.id}`,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "RevvMotiv",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="pt-6 sm:pt-8 md:pt-12 pb-20 px-6 max-w-screen-2xl mx-auto w-full">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-ink-muted uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <ProductGallery images={product.images} title={product.title} />

          <div className="flex flex-col justify-center sticky top-28">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                {product.category.name}
              </span>
              <span className="text-ink-subtle">·</span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> In Stock & Ready to Dispatch
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight mb-4">
              {product.title}
            </h1>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-2xl sm:text-3xl font-bold text-ink font-mono">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price &&
                product.compare_at_price > product.price && (
                  <span className="text-sm text-ink-subtle line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
            </div>

            <p className="text-[11px] text-ink-subtle uppercase tracking-wider mb-6">
              All prices are final — no hidden charges.
            </p>

            <p className="text-sm text-ink-muted font-medium leading-relaxed mb-6 max-w-md">
              {product.description}
            </p>

            {/* Quality & Policy Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded border border-hairline bg-surface mb-8 max-w-md text-xs">
              <div className="flex items-center gap-2 text-ink">
                <ShieldCheck className="w-4 h-4 text-red-500 flex-none" />
                <span>100% Fitment Guarantee</span>
              </div>
              <div className="flex items-center gap-2 text-ink">
                <Truck className="w-4 h-4 text-emerald-400 flex-none" />
                <span>Standard Tracked Courier (5–7 Days)</span>
              </div>
              <div className="flex items-center gap-2 text-ink-muted col-span-full pt-1 border-t border-hairline text-[11px]">
                <Video className="w-3.5 h-3.5 text-ink-subtle flex-none" />
                <span>Note: Uninterrupted unboxing video required for damage claims.</span>
              </div>
            </div>

            <AddToCartButton product={product} />
          </div>
        </div>

        <ReviewsSection reviews={reviews} />

        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-hairline">
            <span className="text-xs font-bold text-[var(--brand-red)] uppercase tracking-widest block mb-1">
              {product.category.name}
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8 text-ink">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
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
