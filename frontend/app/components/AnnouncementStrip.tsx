import { getAnnouncement } from "@/lib/api";
import { AnnouncementStripClient } from "@/app/components/AnnouncementStripClient";

export async function AnnouncementStrip() {
  const announcement = await getAnnouncement().catch(() => null);

  if (!announcement || !announcement.enabled || announcement.announcements.length === 0) {
    return null;
  }

  return <AnnouncementStripClient announcement={announcement} />;
}
