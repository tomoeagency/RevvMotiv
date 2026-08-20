import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, HelpCircle, CheckCircle2, ShieldCheck, Truck, Wrench, MessageCircle } from "lucide-react";
import { PrimaryCtaLink } from "@/app/components/PrimaryCtaButton";

export const metadata: Metadata = {
  title: "Frequently Asked Questions (FAQ) — Fitment, Shipping & Materials",
  description:
    "Get clear, factual answers to frequently asked questions about RevvMotiv car splitters, rear diffusers, carbon fiber styling, 1:1 OEM fitment checks, and Pan-India delivery.",
  alternates: {
    canonical: "/faq",
  },
  openGraph: {
    title: "Frequently Asked Questions — RevvMotiv",
    description:
      "Clear answers on custom car styling fitment, materials, Pan-India courier delivery, COD policy, and installation support.",
    url: "https://revvmotiv.com/faq",
  },
};

interface FAQItem {
  question: string;
  category: "Fitment" | "Materials" | "Shipping" | "Payments & Returns";
  answer: string;
  shortAnswer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    category: "Fitment",
    question: "Do RevvMotiv aero splitters and diffusers fit all cars?",
    shortAnswer: "No. Aero parts are manufactured to specific vehicle chassis lines for 1:1 fitment, though universal track splitters are available.",
    answer:
      "RevvMotiv aero components are engineered for specific vehicle bumper contours and chassis mounting points to achieve precise 1:1 OEM alignment. We produce vehicle-specific parts for models including Maruti Suzuki Swift, Hyundai i20 N Line, Volkswagen Polo GT/Virtus, Mahindra Thar/Scorpio-N, Hyundai Creta/Verna, and Kia Seltos. We also design universal track splitters for custom builds, which require measuring bumper width prior to purchase.",
  },
  {
    category: "Fitment",
    question: "How do I verify if a part fits my specific car model and year?",
    shortAnswer: "Check the vehicle compatibility tag on the product page or message our technicians on WhatsApp with your car model and year.",
    answer:
      "Each product page states the exact vehicle make, model generation, and year compatibility. Before dispatch, our technicians cross-reference your order with your vehicle details. You can also consult directly via WhatsApp at +91 83683 43232 (Mon–Sat, 10:00 AM – 7:00 PM IST) or submit your vehicle specs through our on-site consultant modal for confirmation.",
  },
  {
    category: "Materials",
    question: "What is the difference between authentic carbon fiber and ABS plastic?",
    shortAnswer: "Authentic carbon fiber provides superior stiffness-to-weight ratio and visual weave depth; ABS plastic offers flexible impact resistance.",
    answer:
      "Authentic 2x2 twill carbon fiber offers maximum rigidity, high tensile strength, and distinct woven aesthetics with high-gloss UV-inhibiting clear coats. Automotive-grade ABS polymer provides high impact flexibility, making it resilient against low-speed scrape impacts and steep speed breakers on Indian city roads. Both materials are UV-treated to prevent sun fading and thermal warping.",
  },
  {
    category: "Materials",
    question: "What is pre-preg carbon fiber and why is it used in motorsport?",
    shortAnswer: "Pre-preg is carbon fiber pre-impregnated with epoxy resin and cured under heat and pressure for optimal strength and zero excess weight.",
    answer:
      "Pre-preg (pre-impregnated) carbon fiber involves carbon fabric pre-infused with a precise ratio of structural resin by the manufacturer, cured under vacuum and elevated temperatures. This ensures uniform resin distribution, eliminating dry spots, pinholes, and excess resin weight found in wet hand-layup methods, delivering motorsport-grade structural integrity.",
  },
  {
    category: "Shipping",
    question: "How long does custom delivery take across India?",
    shortAnswer: "Standard delivery takes 5 to 7 business days across 45+ cities and all postal PIN codes in India.",
    answer:
      "In-stock components are inspected, packed in reinforced protective crating, and dispatched within 24 to 48 hours. Transit time via surface express couriers is 3 to 5 business days for major metropolitan areas (Delhi-NCR, Mumbai, Bengaluru, Hyderabad, Pune, Chennai) and 5 to 7 business days for other regional PIN codes across India.",
  },
  {
    category: "Shipping",
    question: "How are aerodynamic splitters and body parts packaged to prevent transit damage?",
    shortAnswer: "Parts are shipped in heavy-duty impact-resistant crates with corner-guard padding and bubble wrapping.",
    answer:
      "Long aerodynamic splitters and delicate diffuser fins are secured with high-density foam edge guards, multi-layer shock-absorbing wrap, and encased in rigid heavy-gauge corrugated crates. All consignments are fully insured against transit loss or damage.",
  },
  {
    category: "Payments & Returns",
    question: "What is RevvMotiv's Cash on Delivery (COD) and Advance Payment policy?",
    shortAnswer: "Customers can pay 100% online or pay a 20% online advance via Razorpay and the remaining 80% balance on delivery.",
    answer:
      "Because automotive aero parts are large-format parcels requiring dedicated courier logistics, RevvMotiv offers a flexible payment structure: 100% full online payment via Razorpay (UPI, Cards, Net Banking) or a 20% advance payment online with the remaining 80% balance payable on delivery via Cash on Delivery (COD).",
  },
  {
    category: "Payments & Returns",
    question: "What is the policy if an item arrives damaged or does not fit?",
    shortAnswer: "Report transit damage within 48 hours with an uninterrupted unboxing video for replacement.",
    answer:
      "In accordance with our Shipping & Refund Policy, customers must record a continuous, uninterrupted unboxing video showing the shipping label and initial package opening. If transit damage or fitment deviation is verified, RevvMotiv arranges a reverse pickup and issues a prompt replacement or full refund.",
  },
  {
    category: "Fitment",
    question: "Where is RevvMotiv located and can I pick up parts in person?",
    shortAnswer: "Our studio and workshop is located at Site-5, Kasna, Greater Noida, Uttar Pradesh, India.",
    answer:
      "RevvMotiv operates from Site-5, Kasna, Greater Noida, UP 201306. While the majority of our customers order online with Pan-India doorstep delivery, local Delhi-NCR customers can arrange in-person pickup and fitment consultation by scheduling an appointment via WhatsApp.",
  },
];

export default function FAQPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

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
        name: "FAQ",
        item: "https://revvmotiv.com/faq",
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="w-full bg-carbon text-ink">
        {/* Header Section */}
        <section className="relative border-b border-hairline bg-canvas overflow-hidden py-12 sm:py-16">
          <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:100px_100px] opacity-30" />
          <div className="relative max-w-screen-xl mx-auto px-4 sm:px-6">
            {/* Breadcrumb Navigation */}
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-ink-subtle mb-6">
              <Link href="/" className="hover:text-ink transition-colors">Home</Link>
              <span>/</span>
              <span className="text-red-500 font-semibold">FAQ</span>
            </nav>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-600/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest mb-4">
              <HelpCircle className="w-4 h-4" />
              <span>Knowledge Base & Support</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight mb-4 text-ink">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-ink-muted max-w-2xl leading-relaxed">
              Clear, factual answers regarding vehicle fitment checks, material differences, Pan-India shipping times, and payment policies.
            </p>
          </div>
        </section>

        {/* Structured Facts for Direct AI / Search Engine Extraction */}
        <section className="border-b border-hairline bg-surface-alt py-8">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6">
            <h2 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">
              Key Facts About RevvMotiv
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-hairline bg-surface flex flex-col gap-1">
                <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">What We Make</span>
                <span className="text-xs font-bold text-ink">Aero Splitters, Diffusers & Spoilers</span>
                <span className="text-[11px] text-ink-muted">1:1 OEM fitment in Carbon & ABS</span>
              </div>
              <div className="p-4 rounded-lg border border-hairline bg-surface flex flex-col gap-1">
                <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">Operational Studio</span>
                <span className="text-xs font-bold text-ink">Site-5 Kasna, Greater Noida</span>
                <span className="text-[11px] text-ink-muted">Delhi-NCR, Uttar Pradesh, India</span>
              </div>
              <div className="p-4 rounded-lg border border-hairline bg-surface flex flex-col gap-1">
                <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">Delivery Coverage</span>
                <span className="text-xs font-bold text-ink">Pan-India Express Shipping</span>
                <span className="text-[11px] text-ink-muted">5–7 Business Days Tracked Courier</span>
              </div>
              <div className="p-4 rounded-lg border border-hairline bg-surface flex flex-col gap-1">
                <span className="text-[10px] font-bold text-ink-subtle uppercase tracking-wider">Direct Tech Support</span>
                <span className="text-xs font-bold text-ink">+91 83683 43232 / WhatsApp</span>
                <span className="text-[11px] text-ink-muted">support@revvmotiv.com</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Q&A List */}
        <section className="max-w-screen-xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Quick Value Badges */}
            <div className="lg:col-span-4 sticky top-28 space-y-6">
              <div className="p-6 rounded-xl border border-hairline bg-surface flex flex-col gap-4 shadow-sm">
                <span className="text-xs font-bold text-red-500 uppercase tracking-widest">
                  Fitment Promise
                </span>
                <h3 className="text-lg font-bold text-ink uppercase tracking-tight">
                  Need Help Checking Your Bumper Fitment?
                </h3>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Send a photo of your car&apos;s front or rear bumper to our technicians for a verified fitment check before placing an order.
                </p>
                <a
                  href="https://wa.me/918368343232?text=Hi%20RevvMotiv%2C%20I%20need%20help%20verifying%20fitment%20for%20my%20car."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-lg bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Fitment Check</span>
                </a>
              </div>

              <div className="p-6 rounded-xl border border-hairline bg-surface-alt space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <ShieldCheck className="w-4 h-4 text-red-500" />
                  <span>100% Fitment Guarantee</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <Truck className="w-4 h-4 text-emerald-400" />
                  <span>Insured Pan-India Crating</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-ink">
                  <Wrench className="w-4 h-4 text-sky-400" />
                  <span>Direct Bolt-On Installation</span>
                </div>
              </div>
            </div>

            {/* Right Column: Complete FAQ Q&A Items */}
            <div className="lg:col-span-8 space-y-6">
              {FAQ_ITEMS.map((item, idx) => (
                <article
                  key={idx}
                  className="p-5 sm:p-6 rounded-xl border border-hairline bg-surface hover:border-hairline-strong transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider px-2 py-0.5 rounded bg-red-500/10">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-ink-subtle font-mono">Q{idx + 1}</span>
                  </div>

                  <h2 className="text-base sm:text-lg font-bold text-ink tracking-tight mb-3">
                    {item.question}
                  </h2>

                  {/* Extractable direct summary answer for Voice & PAA Snippets */}
                  <div className="p-3 rounded-lg bg-surface-alt border-l-2 border-red-500 mb-3">
                    <p className="text-xs font-semibold text-ink leading-relaxed">
                      <span className="text-red-500 uppercase text-[10px] font-black mr-1">Direct Answer:</span>
                      {item.shortAnswer}
                    </p>
                  </div>

                  {/* Full detailed explanation */}
                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="border-t border-hairline bg-canvas py-12 text-center">
          <div className="max-w-screen-md mx-auto px-4 sm:px-6">
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink mb-3">
              Still Have Questions?
            </h2>
            <p className="text-xs sm:text-sm text-ink-muted mb-6">
              Our team of automotive stylists and fitment specialists is available Monday to Saturday to assist with your build.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <PrimaryCtaLink href="/shop" className="px-8 py-3 text-xs inline-flex items-center justify-center">
                Browse Shop Catalog
              </PrimaryCtaLink>
              <Link
                href="/contact"
                className="px-8 py-3 bg-surface hover:bg-surface-alt border border-hairline text-ink font-bold text-xs uppercase tracking-widest rounded-lg transition-colors inline-flex items-center justify-center"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
