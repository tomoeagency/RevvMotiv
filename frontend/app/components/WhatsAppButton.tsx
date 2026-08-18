import { getSiteSettings } from "@/lib/api";
import { WhatsAppFab } from "@/app/components/WhatsAppFab";
import { BUSINESS_DETAILS } from "@/lib/constants";

// Async Server Component — only the fetch needs to happen here; the fixed
// positioning + footer-visibility fade below needs the DOM, so that part is
// a small client component. Stacked directly above the consultant FAB on
// the same bottom-right rail (see WhatsAppFab's bottom-[88px]).
export async function WhatsAppButton() {
  const settings = await getSiteSettings().catch(() => null);
  const rawNumber = settings?.whatsapp_number || BUSINESS_DETAILS.whatsappNumber;
  const digits = rawNumber.replace(/[^\d]/g, "") || "918368343232";

  return <WhatsAppFab digits={digits} />;
}
