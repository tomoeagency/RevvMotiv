import Link from "next/link";
import Image from "next/image";
import { Flag, ShieldCheck, ArrowUpRight } from "lucide-react";
import { getSiteSettings } from "@/lib/api";
import { ConsultantFooterLink } from "@/app/components/ConsultantFooterLink";
import { LogoMark } from "@/app/components/LogoMark";

export async function Footer() {
  const settings = await getSiteSettings().catch(() => null);
  const instagramUrl = settings
    ? `https://instagram.com/${settings.instagram_handle.replace(/^@/, "")}`
    : null;
  const whatsappDigits = settings?.whatsapp_number.replace(/\D/g, "") ?? null;

  return (
    <footer className="relative bg-canvas text-ink pt-20 pb-10 border-t border-hairline overflow-hidden">
      {/* Sleek Motorsport Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-600 to-transparent opacity-50" />

      {/* Subtle Carbon Fiber Texture Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

      {/* Premium Watermark Graphics */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Faded tire marks anchored to extreme left — the source art is
            solid black, so on the dark canvas it needs inverting to white
            (kept faint) to read at all; on the light canvas the original
            black reads fine on its own at a higher opacity. */}
        <img
          src="/tire-marks.svg"
          alt=""
          className="absolute top-0 -left-[5%] w-1/2 h-full object-cover object-left invert opacity-10 light:invert-0 light:opacity-[0.08]"
        />
        {/* Soft red glow */}
        <div className="absolute bottom-[-200px] right-[-200px] w-[600px] h-[600px] bg-red-600/15 light:bg-red-600/10 rounded-full blur-[100px]" />
      </div>

      {/* Main Footer Container */}
      <div className="relative z-20 max-w-screen-2xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          
          {/* Brand Column (Left) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" aria-label="RevvMotiv Home" className="block mb-8">
              <div className="opacity-90 hover:opacity-100 transition-opacity">
                <LogoMark className="h-10 w-auto text-ink" />
              </div>
            </Link>
            <p className="text-sm text-ink-muted leading-relaxed max-w-sm mb-8 font-medium">
              Custom aerodynamic styling and exterior accessories designed for popular Indian cars. Tested fitment, durable finish, and Pan-India delivery.
            </p>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-hairline-strong bg-hover text-[10px] font-bold uppercase tracking-widest text-ink-subtle">
              <Flag className="w-3.5 h-3.5 text-red-500" />
              <span>Tested for Indian Roads</span>
            </div>
          </div>

          {/* Links Columns (Right) */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Support */}
            <div className="flex flex-col">
              <h4 className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-6">
                Support
              </h4>
              <ul className="flex flex-col gap-4 text-sm font-medium text-ink-muted">
                <li>
                  <Link href="/policies/shipping-policy" className="hover:text-red-500 transition-colors">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link href="/policies/refund-policy" className="hover:text-red-500 transition-colors">
                    Returns &amp; Refunds
                  </Link>
                </li>
                <li>
                  <Link href="/policies/contact-information" className="hover:text-red-500 transition-colors">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="/review" className="hover:text-red-500 transition-colors flex items-center gap-2 group">
                    <span>Leave a Review</span>
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col">
              <h4 className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-6">
                Legal
              </h4>
              <ul className="flex flex-col gap-4 text-sm font-medium text-ink-muted">
                <li>
                  <Link href="/policies/terms-of-service" className="hover:text-red-500 transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/policies/legal-notice" className="hover:text-red-500 transition-colors">
                    Legal Notice
                  </Link>
                </li>
                <li>
                  <Link href="/policies/privacy-policy" className="hover:text-red-500 transition-colors">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="flex flex-col">
              <h4 className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-6">
                Follow the Builds
              </h4>
              <ul className="flex flex-col gap-4 text-sm font-medium text-ink-muted">
                <li>
                  <a
                    href="https://www.instagram.com/revv.nation__/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-500 transition-colors flex items-center gap-1 group"
                  >
                    @revv.nation__
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/sonet.4100__/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-500 transition-colors flex items-center gap-1 group"
                  >
                    @sonet.4100__
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div className="flex flex-col">
              <h4 className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-6">
                Get In Touch
              </h4>
              <ul className="flex flex-col gap-3 text-sm font-medium text-ink-muted">
                <li className="text-xs leading-relaxed text-ink-muted">
                  Site-5, Kasna, Greater Noida, Uttar Pradesh, India
                </li>
                <li>
                  <a
                    href="tel:+918368343232"
                    className="hover:text-red-500 transition-colors text-xs flex items-center gap-1 group"
                  >
                    Phone: +91 83683 43232
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href="https://wa.me/918368343232?text=Hi%20RevvMotiv%2C%20I'm%20looking%20for%20styling%20%26%20aero%20parts%20for%20my%20car.%20Can%20you%20assist%20me%3F"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-red-500 transition-colors text-xs flex items-center gap-1 group"
                  >
                    WhatsApp Support
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:support@revvmotiv.com"
                    className="hover:text-red-500 transition-colors text-xs"
                  >
                    support@revvmotiv.com
                  </a>
                </li>
                <li>
                  <div className="text-ink-muted hover:text-red-500 transition-colors">
                    <ConsultantFooterLink />
                  </div>
                </li>
              </ul>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-hairline flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-bold text-ink-subtle uppercase tracking-widest">
            &copy; {new Date().getFullYear()} RevvMotiv. All rights reserved.
          </p>

          {/* Agency attribution */}
          <a
            href="https://tomoe.agency"
            target="_blank"
            rel="noopener noreferrer"
            title="A Tomoe Creation"
            className="text-[11px] font-medium text-ink-subtle hover:text-ink transition-colors flex items-center gap-1.5"
          >
            <span>a</span>
            <span className="font-bold uppercase tracking-wider text-ink-muted hover:text-ink">tomoe creation</span>
          </a>

          <div className="flex items-center gap-2 text-[10px] font-bold text-ink-muted uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
            100% Guaranteed OEM Fitment
          </div>
        </div>
      </div>
    </footer>
  );
}
