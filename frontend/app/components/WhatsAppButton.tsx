import { getSiteSettings } from "@/lib/api";
import { WhatsAppFab } from "@/app/components/WhatsAppFab";

// Async Server Component — only the fetch needs to happen here; the fixed
// positioning + footer-visibility fade below needs the DOM, so that part is
// a small client component. Stacked directly above the consultant FAB on
// the same bottom-right rail (see WhatsAppFab's bottom-[88px]).
export async function WhatsAppButton() {
  const settings = await getSiteSettings().catch(() => null);
  if (!settings?.whatsapp_number) return null;

  const digits = settings.whatsapp_number.replace(/[^\d]/g, "");
  if (!digits) return null;

  return <WhatsAppFab digits={digits} />;
}
