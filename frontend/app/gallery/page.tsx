import type { Metadata } from "next";
import Image from "next/image";
import { getGallery } from "@/lib/api";
import { GalleryGrid } from "@/app/components/GalleryGrid";
import { ClosingCta } from "@/app/components/ClosingCta";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Build Gallery & Installation Media — RevvMotiv",
  description:
    "Photos and video clips from real RevvMotiv builds and installs — carbon fiber styling, aero kits, and finish work documented inside our workshop.",
};

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <div className="w-full bg-carbon text-ink">
      {/* 1. Hero Section */}
      <section className="relative border-b border-hairline bg-canvas overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40" />
        <div className="relative max-w-screen-2xl mx-auto px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-3">
                Media & Installation Feed
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-6">
                Build Gallery & <br />
                <span className="text-red-500">Installation Media.</span>
              </h1>
              <p className="text-ink-muted text-base md:text-lg leading-relaxed max-w-2xl">
                Watch installation clips, review build photos, and explore customer transformations. Real customer cars with genuine fitment.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-lg border border-hairline bg-surface overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/facility.png"
                  alt="RevvMotiv clean white studio tuning workshop"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur border border-white/10 rounded text-xs text-white">
                  <span className="font-bold text-red-500 uppercase tracking-wider block mb-0.5">
                    Studio Media Recording Bay
                  </span>
                  High-definition build video & photo documentation.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Gallery Masonry Grid */}
      <section className="max-w-screen-2xl mx-auto px-6 py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-1">
              Installation Feed
            </span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">
              Workshop Media Showcase
            </h2>
          </div>
          <p className="text-xs text-ink-muted">
            Click any clip or photo to open high-definition preview & video player.
          </p>
        </div>

        <GalleryGrid items={items} />
      </section>

      {/* 3. Closing CTA */}
      <ClosingCta
        heading="Like What You See?"
        body="Talk to our master technicians about getting a similar carbon styling or aero build for your own car."
      />
    </div>
  );
}
