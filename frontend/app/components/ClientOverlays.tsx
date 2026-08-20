"use client";

import dynamic from "next/dynamic";

const CartDrawer = dynamic(() => import("@/app/components/CartDrawer").then((mod) => mod.CartDrawer), { ssr: false });
const RouteLoader = dynamic(() => import("@/app/components/RouteLoader").then((mod) => mod.RouteLoader), { ssr: false });
const ConsultantModal = dynamic(() => import("@/app/components/ConsultantModal").then((mod) => mod.ConsultantModal), { ssr: false });
const ConsultantFabTrigger = dynamic(() => import("@/app/components/ConsultantFabTrigger").then((mod) => mod.ConsultantFabTrigger), { ssr: false });
const WhatsAppButton = dynamic(() => import("@/app/components/WhatsAppButton").then((mod) => mod.WhatsAppButton), { ssr: false });
const CookieConsent = dynamic(() => import("@/app/components/CookieConsent").then((mod) => mod.CookieConsent), { ssr: false });
const TrustPanel = dynamic(() => import("@/app/components/TrustPanel").then((mod) => mod.TrustPanel), { ssr: false });

export function ClientOverlays() {
  return (
    <>
      <CartDrawer />
      <TrustPanel />
      <RouteLoader />
      <ConsultantModal />
      <ConsultantFabTrigger />
      <WhatsAppButton />
      <CookieConsent />
    </>
  );
}
