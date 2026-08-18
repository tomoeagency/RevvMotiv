import type { Metadata } from "next";
import { Orbitron, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { CartDrawer } from "@/app/components/CartDrawer";
import { RouteLoader } from "@/app/components/RouteLoader";
import { AnnouncementStrip } from "@/app/components/AnnouncementStrip";
import { ConsultantModal } from "@/app/components/ConsultantModal";
import { ConsultantFabTrigger } from "@/app/components/ConsultantFabTrigger";
import { WhatsAppButton } from "@/app/components/WhatsAppButton";
import { CookieConsent } from "@/app/components/CookieConsent";
import { TrustPanel } from "@/app/components/TrustPanel";
import { CartProvider } from "@/lib/cart-context";
import { ConsultantProvider } from "@/lib/consultant-context";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  // Same domain fallback as app/sitemap.ts (NEXT_PUBLIC_SITE_URL, else the
  // production domain) — without this, Next resolves relative OpenGraph/
  // Twitter image URLs against localhost:3000 regardless of where the site
  // is actually deployed.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://revvmotiv.com"),
  title: "RevvMotiv — Custom Car Styling & Aero Parts in India",
  description:
    "Explore custom splitters, diffusers, spoilers, and styling accessories designed for popular Indian cars. Guaranteed fitment, premium finish, and Pan-India delivery.",
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
};

import { SmoothScrollProvider } from "@/app/components/SmoothScrollProvider";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-screen flex flex-col bg-carbon font-sans text-ink">
        <Script id="theme-init" strategy="beforeInteractive">
          {`try {
            if (localStorage.getItem("revvmotiv-theme") === "light") {
              document.documentElement.setAttribute("data-theme", "light");
            }
          } catch (e) {}`}
        </Script>
        <SmoothScrollProvider>
          <CartProvider>
            <ConsultantProvider>
              <AnnouncementStrip />
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartDrawer />
              <TrustPanel />
              <RouteLoader />
              <ConsultantModal />
              <ConsultantFabTrigger />
              <WhatsAppButton />
              <CookieConsent />
            </ConsultantProvider>
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
