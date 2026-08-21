import { ShieldCheck, Truck, Video, MessageCircle } from "lucide-react";

const HIGHLIGHTS = [
  {
    icon: ShieldCheck,
    title: "100% Fitment Guarantee",
    description: "Precision-engineered to bolt directly onto your exact model — no cutting, no drilling.",
  },
  {
    icon: Truck,
    title: "Pan-India Delivery",
    description: "Insured, tracked shipping to every PIN code in the country.",
  },
  {
    icon: Video,
    title: "Hassle-Free Replacement",
    description: "Record an unboxing video and we'll sort out any transit damage fast.",
  },
  {
    icon: MessageCircle,
    title: "Real Workshop Support",
    description: "Talk to our team on WhatsApp for fitment help before or after you order.",
  },
] as const;

export function WhyRevvMotivSection() {
  return (
    <section className="border-t border-hairline bg-surface-alt py-12 sm:py-16 md:py-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {HIGHLIGHTS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="flex flex-col gap-2.5 sm:gap-3 p-4 sm:p-5 rounded-xl border border-hairline bg-surface"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center flex-none">
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-ink leading-snug">
                {title}
              </h3>
              <p className="text-[11px] sm:text-xs text-ink-muted leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
