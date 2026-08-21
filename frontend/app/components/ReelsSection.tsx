import { getInstagramReelEmbeds, getInstagramLiveMedia } from "@/lib/instagram";
import { ReelsSectionClient } from "@/app/components/ReelsSectionClient";

export async function ReelsSection() {
  const [embeds, liveMedia] = await Promise.all([
    getInstagramReelEmbeds(),
    getInstagramLiveMedia(8),
  ]);

  return <ReelsSectionClient embeds={embeds} liveMedia={liveMedia} />;
}
