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

export const dynamic = "force-dynamic";

export default async function Home() {
  let featured = (await getProducts({ featured: true, perPage: 4 })).data;

  if (featured.length === 0) {
    featured = (await getProducts({ perPage: 4 })).data;
  }

  const { data: categories } = await getCategories();
  const { data: featuredReviews } = await getFeaturedReviews();

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
        heading="Ready to Build Your Car?"
        body="Browse our carbon aero catalog or speak directly with our master technicians for fitment advice."
      />
    </>
  );
}
