"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { GARAGE_GALLERY } from "@/lib/garage-gallery";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";
import { InstagramReelsRow } from "@/app/components/InstagramReelsRow";
import type { InstagramEmbed } from "@/lib/instagram";

const TILE_SPAN = ["md:col-span-2 md:row-span-2", "", "", "md:col-span-2"];

export function ReelsSectionClient({ embeds }: { embeds: InstagramEmbed[] }) {
  return (
    <section id="from-our-garage" className="border-t border-hairline py-24 bg-surface-alt overflow-hidden">
      <div className="max-w-screen-2xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: MOTION_DURATION.page, ease: MOTION_EASE_BRAND }}
          className="mb-12"
        >
          <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-2">
            Build Documentation
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-ink uppercase tracking-tight">
            From Our Garage
          </h2>
          <p className="text-sm text-ink-muted mt-2">
            Real builds. Real performance. Documented inside our studio tuning bay.
          </p>
        </motion.div>

        {embeds.length > 0 ? (
          <InstagramReelsRow embeds={embeds} />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-6 md:h-[640px]">
            {GARAGE_GALLERY.map((photo, i) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
                whileHover={{ scale: 1.03, y: -4 }}
                className={`relative h-[240px] md:h-auto bg-surface border border-hairline-strong group overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl hover:shadow-red-500/15 transition-all duration-500 ${TILE_SPAN[i] ?? ""}`}
              >
                <Image
                  src={photo.img}
                  alt={photo.title}
                  fill
                  sizes="(min-width: 768px) 40vw, 50vw"
                  className="object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent z-10" />
                <div className="absolute inset-0 border border-red-500/0 group-hover:border-red-500/50 transition-all duration-500 rounded-2xl z-20" />

                <div className="absolute bottom-0 left-0 w-full p-6 z-30">
                  <h3 className="text-lg font-bold text-white leading-tight">
                    {photo.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
