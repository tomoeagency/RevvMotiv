import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getProducts, getCategories } from "@/lib/api";
import { ProductCard } from "@/app/components/ProductCard";
import { ClosingCta } from "@/app/components/ClosingCta";
import { ShopSearchBar } from "@/app/shop/ShopSearchBar";
import { ShopClientGrid } from "@/app/shop/ShopClientGrid";

import { FALLBACK_CATEGORIES } from "@/lib/constants";

export const dynamic = "force-dynamic";

const PER_PAGE = 12;

const VEHICLE_FILTERS = [
  { label: "All Vehicles", value: "" },
  { label: "Hyundai Verna", value: "Verna" },
  { label: "Kia Sonet", value: "Sonet" },
  { label: "Tata Tiago", value: "Tiago" },
  { label: "VW Polo", value: "Polo" },
  { label: "Maruti Swift", value: "Swift" },
  { label: "Mahindra Thar", value: "Thar" },
  { label: "Hyundai Creta", value: "Creta" },
] as const;

type SearchParams = Promise<{
  category?: string;
  search?: string;
  page?: string;
  focus?: string;
  fitment?: string;
}>;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const { category } = await searchParams;
  if (!category) {
    return {
      title: "Shop All Parts — Precision Carbon Aero & Performance | RevvMotiv",
      description:
        "Browse precision-engineered carbon fiber styling, spoilers, diffusers, custom tyre stickers, and OLED lighting upgrades.",
      alternates: {
        canonical: "/shop",
      },
    };
  }

  const { data: categories } = await getCategories();
  const activeCategory = categories.find((c) => c.slug === category);
  if (!activeCategory) {
    return {
      title: "Shop All Parts — RevvMotiv",
      alternates: { canonical: "/shop" },
    };
  }

  return {
    title: `${activeCategory.name} — RevvMotiv Store`,
    description: `Shop ${activeCategory.name} — precision-engineered automotive styling and performance parts, fitted and shipped across India.`,
    alternates: {
      canonical: `/shop?category=${activeCategory.slug}`,
    },
  };
}

const DEFAULT_CATEGORIES = [...FALLBACK_CATEGORIES];

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category, search, page: pageParam, focus, fitment } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  // Combine search and fitment for query
  const effectiveSearch = fitment ? `${search ? `${search} ` : ""}${fitment}` : search;

  const [{ data: products, meta }, { data: apiCategories }] = await Promise.all([
    getProducts({ category, search: effectiveSearch, page, perPage: PER_PAGE }),
    getCategories(),
  ]);

  const categories = apiCategories && apiCategories.length > 0 ? apiCategories : DEFAULT_CATEGORIES;

  const activeCategory = category
    ? categories.find((c) => c.slug === category)
    : undefined;

  function buildHref(overrides: { category?: string; page?: number; fitment?: string }) {
    const params = new URLSearchParams();
    const nextCategory = "category" in overrides ? overrides.category : category;
    if (nextCategory) params.set("category", nextCategory);
    if (search) params.set("search", search);
    const nextFitment = "fitment" in overrides ? overrides.fitment : fitment;
    if (nextFitment) params.set("fitment", nextFitment);
    const nextPage = overrides.page ?? 1;
    if (nextPage > 1) params.set("page", String(nextPage));
    const qs = params.toString();
    return `/shop${qs ? `?${qs}` : ""}`;
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
        name: activeCategory ? activeCategory.name : "Shop",
        item: activeCategory
          ? `https://revvmotiv.com/shop?category=${encodeURIComponent(activeCategory.slug)}`
          : "https://revvmotiv.com/shop",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <div className="w-full bg-carbon text-ink">
        {/* 1. Hero Section */}
        <section className="relative border-b border-hairline bg-canvas overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40" />
          <div className="relative max-w-screen-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8 md:py-14">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-3">
                Store Catalog & Performance Upgrades
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-6">
                {activeCategory ? activeCategory.name : "Customised Parts Catalog"}
              </h1>
              <p className="text-ink-muted text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
                Precision 3D laser-scanned splitters, diffusers, spoilers, custom tyre stickers, and OLED lighting components engineered for maximum visual and functional downforce.
              </p>
              {category && (
                <Link
                  href="/shop"
                  className="inline-block text-xs font-bold text-ink uppercase tracking-widest hover:text-red-400 transition-colors border-b border-red-500 pb-1"
                >
                  Clear Category Filter
                </Link>
              )}
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-lg border border-hairline bg-surface overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/workshop.png"
                  alt="Master technician inspecting carbon splitter with 3D scanner"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur border border-white/10 rounded text-xs text-white">
                  <span className="font-bold text-red-500 uppercase tracking-wider block mb-0.5">
                    3D Laser Scan Precision
                  </span>
                  1:1 chassis fitment & quality control inspection.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Shop Area */}
      <section className="max-w-screen-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16 md:py-20">
        {/* Mobile/Tablet Category Filter Scrollbar */}
        <div
          className="lg:hidden -mx-4 px-4 sm:-mx-6 sm:px-6 mb-6 sm:mb-8 flex items-center gap-2 overflow-x-auto hide-scrollbar pb-2 touch-pan-x touch-pan-y"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <CategoryChip href={buildHref({ category: undefined })} label="All Products" active={!category} />
          {categories.map((cat) => (
            <CategoryChip
              key={cat.id}
              href={buildHref({ category: cat.slug })}
              label={cat.name}
              active={category === cat.slug}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-12">
          {/* Desktop Category Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block mb-4">
                Browse Categories
              </span>
              <nav className="flex flex-col gap-1">
                <SidebarLink href={buildHref({ category: undefined })} label="All Products" active={!category} />
                {categories.map((cat) => (
                  <SidebarLink
                    key={cat.id}
                    href={buildHref({ category: cat.slug })}
                    label={cat.name}
                    active={category === cat.slug}
                  />
                ))}
              </nav>
            </div>
          </aside>

          {/* Products Grid */}
          <div>
            <Suspense fallback={<div className="h-[50px] mb-8 bg-surface border border-hairline rounded animate-pulse" />}>
              <ShopSearchBar autoFocus={focus === "search"} />
            </Suspense>

            {/* Vehicle Model Fitment Filter (Temporarily disabled) */}
            {/*
            <div className="mb-6">
              <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest block mb-2.5">
                Filter by Vehicle Compatibility
              </span>
              <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
                {VEHICLE_FILTERS.map((vf) => {
                  const isSelected = (fitment || "") === vf.value;
                  return (
                    <Link
                      key={vf.label}
                      href={buildHref({ fitment: vf.value || undefined, page: 1 })}
                      className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                        isSelected
                          ? "bg-[var(--brand-red)] text-white border-[var(--brand-red)] shadow-[0_0_15px_rgba(225,29,72,0.3)]"
                          : "bg-surface border-hairline text-ink-muted hover:text-ink hover:border-hairline-strong"
                      }`}
                    >
                      {vf.label}
                    </Link>
                  );
                })}
              </div>
            </div>
            */}

            <ShopClientGrid
              initialProducts={products}
              initialTotal={meta.total}
              initialPage={meta.current_page}
              initialLastPage={meta.last_page}
              category={category}
              search={effectiveSearch}
            />
          </div>
        </div>
      </section>

      {/* 3. Closing CTA */}
      <ClosingCta
        heading="Can't Find What You Need?"
        body="Talk to our master technicians and we'll help you source the exact fitment for your car."
      />
      </div>
    </>
  );
}

function SidebarLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`border-l-2 pl-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
        active
          ? "border-red-500 text-red-500 bg-red-500/5"
          : "border-transparent text-ink-muted hover:text-ink hover:border-hairline-strong"
      }`}
    >
      {label}
    </Link>
  );
}

function CategoryChip({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex-none min-h-[36px] px-4 py-2 text-[11px] font-bold uppercase tracking-widest border rounded transition-all whitespace-nowrap flex items-center cursor-pointer ${
        active
          ? "border-red-500 text-white brand-gradient-flow shadow-sm shadow-red-500/20"
          : "border-hairline text-ink-muted hover:border-hairline-strong hover:text-ink bg-surface"
      }`}
    >
      {label}
    </Link>
  );
}

function ShopPagination({
  currentPage,
  lastPage,
  buildHref,
}: {
  currentPage: number;
  lastPage: number;
  buildHref: (page: number) => string;
}) {
  if (lastPage <= 1) return null;

  // Plain server-rendered <Link>s (no client JS needed) — a page number is
  // just another URL, same as the category filters above.
  const pages = Array.from({ length: lastPage }, (_, i) => i + 1);

  return (
    <nav
      aria-label="Product page navigation"
      className="flex items-center justify-center gap-2 mt-14"
    >
      <PageLink
        href={buildHref(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="w-4 h-4" />
      </PageLink>

      {pages.map((p) => (
        <PageLink key={p} href={buildHref(p)} active={p === currentPage}>
          {p}
        </PageLink>
      ))}

      <PageLink
        href={buildHref(currentPage + 1)}
        disabled={currentPage >= lastPage}
        aria-label="Next page"
      >
        <ChevronRight className="w-4 h-4" />
      </PageLink>
    </nav>
  );
}

function PageLink({
  href,
  children,
  active,
  disabled,
  ...rest
}: {
  href: string;
  children: React.ReactNode;
  active?: boolean;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const className = `w-9 h-9 flex items-center justify-center text-xs font-bold border rounded transition-all ${
    active
      ? "border-red-500 text-white brand-gradient-flow"
      : disabled
        ? "border-hairline text-ink-subtle pointer-events-none opacity-40"
        : "border-hairline text-ink-muted hover:border-hairline-strong hover:text-ink bg-surface"
  }`;

  if (disabled) {
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    );
  }

  return (
    <Link href={href} className={className} {...rest}>
      {children}
    </Link>
  );
}
