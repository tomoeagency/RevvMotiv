"use client";

import { useEffect } from "react";
import Script from "next/script";
import type { InstagramEmbed } from "@/lib/instagram";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

// Real reels render as tall (9:16) native Instagram embeds with their
// own iframe/UI Meta controls — that doesn't fit the custom bento grid
// the static-photo fallback uses (which relies on cropping arbitrary
// photos to fixed tile shapes), so this is a horizontal-scrolling row of
// full embeds instead, each just framed in the site's card border.
export function InstagramReelsRow({ embeds }: { embeds: InstagramEmbed[] }) {
  // Blockquotes are injected via dangerouslySetInnerHTML, so embed.js's
  // own auto-scan (which only runs once, on script load) won't catch
  // them if this mounts after that — re-run it explicitly once the
  // script and the blockquotes are both in the DOM.
  useEffect(() => {
    window.instgrm?.Embeds.process();
  }, [embeds]);

  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
      />
      <div data-lenis-prevent className="flex gap-4 overflow-x-auto hide-scrollbar pb-8 snap-x snap-mandatory touch-pan-y touch-pan-x overscroll-x-contain">
        {embeds.map((embed) => (
          <div
            key={embed.url}
            className="flex-none w-[328px] bg-surface border border-hairline-strong overflow-hidden snap-center"
            dangerouslySetInnerHTML={{ __html: embed.html }}
          />
        ))}
      </div>
    </>
  );
}
