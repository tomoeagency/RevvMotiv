import { getSiteSettings, getProjects } from "@/lib/api";
import { TrustPanelClient } from "@/app/components/TrustPanelClient";

// Async Server Component — only the WhatsApp number + a real project
// cover photo need to happen here (same split as WhatsAppButton/
// WhatsAppFab); everything else about this panel (cart-open visibility,
// scatter, review fetch) needs the DOM.
export async function TrustPanel() {
  const [settings, projects] = await Promise.all([
    getSiteSettings().catch(() => null),
    getProjects().catch(() => null),
  ]);
  const digits = settings?.whatsapp_number.replace(/[^\d]/g, "") || null;
  const workPhoto = projects?.data[0]?.cover_image ?? null;

  return <TrustPanelClient whatsappDigits={digits} workPhoto={workPhoto} />;
}
