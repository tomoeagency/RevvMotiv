// Real Instagram Reel embeds for the "From Our Garage" section, via
// Meta's oEmbed API — not a scraped feed, not fake data. Needs two
// non-secret values from a (free) Meta Developer App:
//   - App ID:       developers.facebook.com > your app > Settings > Basic
//   - Client Token: same page > Settings > Advanced > Client Token
// Both are safe to expose client-side (this is not the App Secret) — set
// them as NEXT_PUBLIC_FB_APP_ID / NEXT_PUBLIC_FB_CLIENT_TOKEN in
// frontend/.env.local. Until both are set AND at least one real reel URL
// is added below, getInstagramReelEmbeds() returns [] and ReelsSection
// falls back to the static garage photos — never a broken or fake feed.
const FB_APP_ID = process.env.NEXT_PUBLIC_FB_APP_ID;
const FB_CLIENT_TOKEN = process.env.NEXT_PUBLIC_FB_CLIENT_TOKEN;

// Real Instagram Reel permalinks to feature here, e.g.
// "https://www.instagram.com/reel/Cxxxxxxxxxx/" — copy from the
// @revvmotiv account. Empty until populated.
export const INSTAGRAM_REEL_URLS: string[] = [];

export interface InstagramEmbed {
  url: string;
  html: string;
}

function isConfigured(): boolean {
  return Boolean(FB_APP_ID && FB_CLIENT_TOKEN && INSTAGRAM_REEL_URLS.length > 0);
}

async function fetchEmbed(url: string): Promise<InstagramEmbed | null> {
  try {
    const accessToken = `${FB_APP_ID}|${FB_CLIENT_TOKEN}`;
    const res = await fetch(
      `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${accessToken}&omitscript=true`,
      { next: { revalidate: 3600 } } // reels don't change often; an hour is plenty
    );
    if (!res.ok) return null;
    const data: { html?: string } = await res.json();
    return data.html ? { url, html: data.html } : null;
  } catch {
    return null;
  }
}

// Fetches every configured reel in parallel, server-side. Returns []
// whenever not configured or every fetch failed — callers must treat
// that as "use the fallback gallery," never render an empty section.
export async function getInstagramReelEmbeds(): Promise<InstagramEmbed[]> {
  if (!isConfigured()) return [];
  const results = await Promise.all(INSTAGRAM_REEL_URLS.map(fetchEmbed));
  return results.filter((r): r is InstagramEmbed => r !== null);
}
