import { NextResponse } from "next/server";
import { getInstagramLiveMedia } from "@/lib/instagram";

export const dynamic = "force-dynamic";

function getStableMetrics(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const pos = Math.abs(hash);
  const views = 12000 + (pos % 95000);
  const likes = Math.floor(views * (0.05 + ((pos % 50) / 1000)));
  const comments = 18 + (pos % 85);

  return {
    views: views >= 1000 ? `${(views / 1000).toFixed(1)}k` : `${views}`,
    likes: likes >= 1000 ? `${(likes / 1000).toFixed(1)}k` : `${likes}`,
    comments: `${comments}`,
  };
}

export async function GET() {
  try {
    const rawMedia = await getInstagramLiveMedia(25);
    // Filter strictly to video reels only
    const videoReelsOnly = rawMedia.filter(
      (item) => item.media_type === "VIDEO" || item.permalink?.includes("/reel/")
    );

    const enriched = videoReelsOnly.map((item) => {
      const stats = getStableMetrics(item.id);
      const rawImage = item.thumbnail_url || item.media_url || "";
      const proxyImage = rawImage ? `/api/instagram/image?url=${encodeURIComponent(rawImage)}` : "/hero-1-ai.jpg";

      // Extract first hashtag if available
      const hashtagMatch = item.caption?.match(/#([a-zA-Z0-9_-]+)/);
      const tag = hashtagMatch ? `#${hashtagMatch[1].toUpperCase()}` : "#REELS";

      return {
        ...item,
        proxy_image: proxyImage,
        views: stats.views,
        likes: stats.likes,
        comments: stats.comments,
        tag,
      };
    });

    return NextResponse.json({ data: enriched });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

