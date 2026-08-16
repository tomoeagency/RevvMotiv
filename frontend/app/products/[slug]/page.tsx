import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getProduct, getProducts, getProductReviews, formatPrice, PRODUCT_IMAGE_BLUR_DATA_URL } from "@/lib/api";
import { AddToCartButton } from "@/app/components/AddToCartButton";
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

  return {
    title: `${product.title} — RevvMotiv`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: [{ url: product.images[0] }],
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

  return (
    <>
      <div className="pt-12 md:pt-16 pb-24 px-6 max-w-screen-2xl mx-auto w-full">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-bold text-ink-muted uppercase tracking-widest hover:text-[var(--brand-red)] transition-colors mb-10"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="aspect-square bg-surface border border-hairline relative overflow-hidden">
            <Image
              src={product.images[0]}
              alt={product.title}
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
              placeholder="blur"
              blurDataURL={PRODUCT_IMAGE_BLUR_DATA_URL}
              className="object-cover object-center"
            />
          </div>

          <div className="flex flex-col justify-center">
            <div className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-2">
              {product.category.name}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight mb-4">
              {product.title}
            </h1>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-bold text-ink-muted">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price &&
                product.compare_at_price > product.price && (
                  <span className="text-sm text-ink-subtle line-through">
                    {formatPrice(product.compare_at_price)}
                  </span>
                )}
            </div>
            <p className="text-sm text-ink-muted font-medium leading-relaxed mb-10 max-w-md">
              {product.description}
            </p>

            <AddToCartButton product={product} />
          </div>
        </div>

        <ReviewsSection reviews={reviews} />

        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-16 border-t border-hairline">
            <span className="text-xs font-bold text-[var(--brand-red)] uppercase tracking-widest block mb-1">
              {product.category.name}
            </span>
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-8">
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
        body="Talk to a consultant about fitment, compatibility, or anything else before you buy."
      />
    </>
  );
}
