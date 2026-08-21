export interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  permalink: string;
  thumbnail_url?: string;
  timestamp: string;
}

export interface InstagramEmbed {
  url: string;
  html: string;
}

const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;
const FB_CLIENT_TOKEN = process.env.NEXT_PUBLIC_FB_CLIENT_TOKEN;
const DEFAULT_INSTAGRAM_ACCESS_TOKEN =
  "IGAAOtRJT9zI5BZAGF6SlBkTzhfYkZAYUFl4SnlOa2FGa3E5TkRBT215ZAHg2V2t3c2J4a0RDNW5qelRSd1pRNTBNQmpoWW9ZAX013Y3R2eVl3Qkl4ZAV9Ha0dBdXc2WXRjX29KRHBYcDNOZAm5RNnJzSHdNNzBRS0xQUEZAzTi1neDNpbwZDZD";

const INSTAGRAM_ACCESS_TOKEN =
  process.env.INSTAGRAM_ACCESS_TOKEN ||
  process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN ||
  DEFAULT_INSTAGRAM_ACCESS_TOKEN;

// Real Instagram Reel permalinks to feature here
export const INSTAGRAM_REEL_URLS: string[] = [];

/**
 * Fetches real live posts and reels directly from Instagram Graph API
 * for @revvmotiv using the user access token with 1-hour ISR cache.
 */
export async function getInstagramLiveMedia(limit: number = 8): Promise<InstagramMediaItem[]> {
  const token = INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${encodeURIComponent(
        token
      )}&limit=${limit}`,
      { next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return [];
    }

    const json: { data?: InstagramMediaItem[] } = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}

function isConfigured(): boolean {
  return Boolean(FB_APP_ID && FB_CLIENT_TOKEN && INSTAGRAM_REEL_URLS.length > 0);
}

async function fetchEmbed(url: string): Promise<InstagramEmbed | null> {
  try {
    const accessToken = `${FB_APP_ID}|${FB_CLIENT_TOKEN}`;
    const res = await fetch(
      `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${accessToken}&omitscript=true`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return null;
    const data: { html?: string } = await res.json();
    return data.html ? { url, html: data.html } : null;
  } catch {
    return null;
  }
}

/**
 * Fetches every configured reel in parallel, server-side.
 */
export async function getInstagramReelEmbeds(): Promise<InstagramEmbed[]> {
  if (!isConfigured()) return [];
  const results = await Promise.all(INSTAGRAM_REEL_URLS.map(fetchEmbed));
  return results.filter((r): r is InstagramEmbed => r !== null);
}
