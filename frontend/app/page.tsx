import { Hero } from "@/app/components/Hero";
import { CategoryStrip } from "@/app/components/CategoryStrip";
import { FitmentProcessSection } from "@/app/components/FitmentProcessSection";
import { PlatformSelectorSection } from "@/app/components/PlatformSelectorSection";
import { FeaturedProducts } from "@/app/components/FeaturedProducts";
import { TransformationSection } from "@/app/components/TransformationSection";
import { FeaturedReviews } from "@/app/components/FeaturedReviews";
import { ReelsSection } from "@/app/components/ReelsSection";
import { ClosingCta } from "@/app/components/ClosingCta";
import { getProducts, getCategories, getFeaturedReviews } from "@/lib/api";
import { FALLBACK_CATEGORIES } from "@/lib/constants";

export const revalidate = 60;

export default async function Home() {
  let featured: any[] = [];
  try {
    const res = await getProducts({ featured: true, perPage: 12 });
    featured = res.data || [];
    if (featured.length === 0) {
      const allRes = await getProducts({ perPage: 12 });
      featured = allRes.data || [];
    }
  } catch {
    featured = [];
  }

  let categories: any[] = [];
  try {
    const res = await getCategories();
    categories = res.data || [];
  } catch {
    categories = [];
  }
  if (!categories || categories.length === 0) {
    categories = [...FALLBACK_CATEGORIES];
  }

  let featuredReviews: any[] = [];
  try {
    const res = await getFeaturedReviews();
    featuredReviews = res.data || [];
  } catch {
    featuredReviews = [];
  }

  return (
    <>
      <Hero />
      <CategoryStrip categories={categories} />
      <PlatformSelectorSection />
      <FitmentProcessSection />
      <FeaturedProducts products={featured} />
      <TransformationSection />
      <FeaturedReviews reviews={featuredReviews} />
      <ReelsSection />
      <ClosingCta
        heading="Ready to Upgrade Your Car's Look?"
        body="Browse our styling catalog or speak directly with our workshop team for fitment advice."
      />
    </>
  );
}
