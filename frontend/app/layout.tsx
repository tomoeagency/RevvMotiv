import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b0d10",
};
import { Orbitron, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/app/components/Navbar";
import { Footer } from "@/app/components/Footer";
import { AnnouncementStrip } from "@/app/components/AnnouncementStrip";
import { ClientOverlays } from "@/app/components/ClientOverlays";
import { CartProvider } from "@/lib/cart-context";
import { ConsultantProvider } from "@/lib/consultant-context";
import { RootSchema } from "@/app/components/RootSchema";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://revvmotiv.com"),
  title: {
    default: "RevvMotiv — Custom Car Styling, Splitters & Aero Parts in India",
    template: "%s | RevvMotiv",
  },
  description:
    "India's premier custom automotive styling studio. Precision 1:1 OEM fitment splitters, diffusers, spoilers, carbon fiber styling, permanent tyre lettering & performance upgrades with Pan-India express delivery.",
  keywords: [
    "car aero parts India",
    "custom front splitter",
    "rear diffuser India",
    "car spoilers India",
    "carbon fiber car parts",
    "Swift aero kit",
    "i20 N Line diffuser",
    "Polo GT splitter",
    "Thar body kit",
    "car styling studio Delhi NCR",
    "Greater Noida car accessories",
    "custom tyre stickers",
    "RevvMotiv",
  ],
  authors: [{ name: "RevvMotiv", url: "https://revvmotiv.com" }],
  creator: "RevvMotiv",
  publisher: "RevvMotiv",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://revvmotiv.com",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://revvmotiv.com",
    siteName: "RevvMotiv",
    title: "RevvMotiv — Custom Car Styling, Splitters & Aero Parts in India",
    description:
      "Precision-engineered automotive aero splitters, diffusers, spoilers, and carbon fiber body styling with 100% fitment guarantee and Pan-India express delivery.",
    images: [
      {
        url: "/icon.png",
        width: 1200,
        height: 630,
        alt: "RevvMotiv Custom Car Styling & Aero Parts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "RevvMotiv — Custom Car Styling & Aero Parts in India",
    description:
      "Precision-engineered automotive aero splitters, diffusers, spoilers, and styling accessories. Pan-India express shipping.",
    images: ["/icon.png"],
    creator: "@revvmotiv",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/icon.png", type: "image/png" },
    ],
    shortcut: "/favicon.png",
    apple: "/apple-icon.png",
  },
  other: {
    "geo.region": "IN-UP",
    "geo.placename": "Greater Noida, Kasna, Uttar Pradesh",
    "geo.position": "28.4744;77.5040",
    ICBM: "28.4744, 77.5040",
  },
};

import { SmoothScrollProvider } from "@/app/components/SmoothScrollProvider";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${inter.variable} antialiased w-full max-w-full`}
      suppressHydrationWarning
    >
      <head>
        <RootSchema />
        <link rel="preconnect" href="https://api.revvmotiv.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://api.revvmotiv.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        <link rel="preload" as="image" href="/hero-1-ai.jpg" fetchPriority="high" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLMs.txt" />
        <link rel="alternate" type="text/plain" href="/llms-full.txt" title="LLMs-full.txt" />
      </head>
      <body className="min-h-screen flex flex-col bg-carbon font-sans text-ink w-full max-w-full relative">
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
              <main className="flex-1 w-full max-w-full">{children}</main>
              <Footer />
              <ClientOverlays />
            </ConsultantProvider>
          </CartProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
