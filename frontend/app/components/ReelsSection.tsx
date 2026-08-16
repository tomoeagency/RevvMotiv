import { getInstagramReelEmbeds } from "@/lib/instagram";
import { ReelsSectionClient } from "@/app/components/ReelsSectionClient";

// Server Component so the Instagram oEmbed fetch (and, once real
// credentials exist, its cache) happens server-side rather than from the
// browser. Falls back to the static garage-photo grid whenever nothing
// is configured yet or the fetch comes back empty — see lib/instagram.ts.
export async function ReelsSection() {
  const embeds = await getInstagramReelEmbeds();
  return <ReelsSectionClient embeds={embeds} />;
}
