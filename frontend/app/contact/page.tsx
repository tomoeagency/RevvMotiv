import type { Metadata } from "next";
import Image from "next/image";
import { Mail, AtSign, Clock, ShieldCheck, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/api";
import { ContactForm } from "@/app/components/ContactForm";
import { WhatsAppIcon } from "@/app/components/WhatsAppIcon";

export const metadata: Metadata = {
  title: "Contact Us — Fitment Advice & Custom Build Consultation | RevvMotiv",
  description:
    "Get in touch with RevvMotiv for product questions, 3D fitment advice, order status, or a custom build consultation.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings().catch(() => null);
  const whatsappDigits = settings?.whatsapp_number.replace(/\D/g, "") ?? null;

  return (
    <div className="w-full bg-carbon text-ink">
      {/* 1. Hero Section */}
      <section className="relative border-b border-hairline bg-canvas overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(var(--grid-line)_1px,transparent_1px),linear-gradient(90deg,var(--grid-line)_1px,transparent_1px)] bg-[size:100px_100px] opacity-40" />
        <div className="relative max-w-screen-2xl mx-auto px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7">
              <span className="text-xs font-bold text-red-500 uppercase tracking-widest block mb-3">
                Workshop Support & Consultation
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-6">
                Get In Touch. <br />
                <span className="text-red-500">Plan Your Build.</span>
              </h1>
              <p className="text-ink-muted text-base md:text-lg leading-relaxed max-w-2xl">
                Have questions about vehicle compatibility, custom styling, or order tracking? Our workshop team is here to help you get the exact fitment for your car.
              </p>
            </div>

            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-lg border border-hairline bg-surface overflow-hidden shadow-2xl">
                <Image
                  src="/images/about/fitting.png"
                  alt="Master technician aligning carbon fiber diffuser"
                  fill
                  priority
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/60 backdrop-blur border border-white/10 rounded text-xs text-white">
                  <span className="font-bold text-red-500 uppercase tracking-wider block mb-0.5">
                    Workshop Fitment Desk
                  </span>
                  Direct consultation & technical build support.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="max-w-screen-2xl mx-auto px-6 py-20 grid lg:grid-cols-[1fr_1.3fr] gap-12 items-start">
        {/* Left Column: Direct Channels & Help Topics */}
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-4">
            Direct Support Channels
          </h2>
          <p className="text-sm text-ink-muted leading-relaxed mb-8">
            Connect directly with our workshop team via WhatsApp, email, or Instagram. We are active Monday to Saturday, 10:00 AM – 7:00 PM IST.
          </p>

          <div className="flex flex-col gap-4 mb-10">
            {whatsappDigits && (
              <a
                href={`https://wa.me/${whatsappDigits}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded border border-hairline bg-surface hover:border-[#25D366]/60 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366]/10 text-[#25D366] flex items-center justify-center flex-none group-hover:scale-110 transition-transform">
                  <WhatsAppIcon className="w-5 h-5 fill-[#25D366]" />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink uppercase tracking-wider group-hover:text-[#25D366] transition-colors">
                    Instant WhatsApp Support
                  </div>
                  <div className="text-xs text-ink-muted">Chat directly with a build technician</div>
                </div>
              </a>
            )}

            {settings?.contact_email && (
              <a
                href={`mailto:${settings.contact_email}`}
                className="flex items-center gap-4 p-4 rounded border border-hairline bg-surface hover:border-red-500/40 transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-none group-hover:scale-110 transition-transform">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-ink uppercase tracking-wider group-hover:text-red-400 transition-colors">
                    {settings.contact_email}
                  </div>
                  <div className="text-xs text-ink-muted">Email support & technical inquiries</div>
                </div>
              </a>
            )}

            {/* Address */}
            <div className="flex items-center gap-4 p-4 rounded border border-hairline bg-surface">
              <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center flex-none">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-ink uppercase tracking-wider">
                  Workshop & Registered Address
                </div>
                <div className="text-xs text-ink-muted">
                  Site-5, Kasna, Greater Noida, Uttar Pradesh, India
                </div>
              </div>
            </div>

            {/* Instagram Builds */}
            <div className="p-4 rounded border border-hairline bg-surface">
              <div className="flex items-center gap-2 mb-2">
                <AtSign className="w-4 h-4 text-pink-500" />
                <span className="text-sm font-bold text-ink uppercase tracking-wider">
                  Follow Our Workshop Builds
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <a
                  href="https://www.instagram.com/revv.nation__/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-surface-alt hover:bg-hover border border-hairline rounded font-bold text-ink-muted hover:text-ink transition-colors"
                >
                  @revv.nation__
                </a>
                <a
                  href="https://www.instagram.com/sonet.4100__/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 bg-surface-alt hover:bg-hover border border-hairline rounded font-bold text-ink-muted hover:text-ink transition-colors"
                >
                  @sonet.4100__
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-hairline pt-10">
            <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest mb-4">
              What We Help With
            </h3>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-ink-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500 flex-none" />
                <span>3D Fitment & Chassis Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-red-500 flex-none" />
                <span>Order Status & Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-500 flex-none" />
                <span>Nationwide Shipping Queries</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-red-500 flex-none" />
                <span>Installation Guidance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="border border-hairline bg-surface p-6 md:p-10 rounded-lg shadow-xl">
          <div className="mb-6">
            <h3 className="text-xl font-black uppercase tracking-tight mb-1">
              Send an Enquiry
            </h3>
            <p className="text-xs text-ink-muted">
              Fill out your details below and our team will get back to you within 24–48 business hours.
            </p>
          </div>
          <ContactForm />
        </div>
      </section>
    </div>
  );
}
