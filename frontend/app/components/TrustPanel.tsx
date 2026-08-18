import { getSiteSettings, getProjects, getFeaturedReviews } from "@/lib/api";
import { TrustPanelClient } from "@/app/components/TrustPanelClient";

// Async Server Component — pre-fetches WhatsApp number, project cover photo,
// and approved featured reviews server-side so they render instantly with zero delay.
export async function TrustPanel() {
  const [settings, projects, reviewsRes] = await Promise.all([
    getSiteSettings().catch(() => null),
    getProjects().catch(() => null),
    getFeaturedReviews().catch(() => ({ data: [] })),
  ]);
  const digits = settings?.whatsapp_number.replace(/[^\d]/g, "") || null;
  const workPhoto = projects?.data[0]?.cover_image ?? null;
  const initialReviews = reviewsRes?.data || [];

  return (
    <TrustPanelClient
      whatsappDigits={digits}
      workPhoto={workPhoto}
      initialReviews={initialReviews}
    />
  );
}
