"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Megaphone, X } from "lucide-react";
import type { Announcement, AnnouncementItem } from "@/lib/api";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

const DISMISS_KEY = "revvmotiv-announcement-dismissed";
const FALLBACK_SCROLL_SPEED = 24;
const FALLBACK_ROTATE_DURATION = 4;

export function AnnouncementStripClient({ announcement }: { announcement: Announcement }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem(DISMISS_KEY) === "1") {
      setDismissed(true);
    }
  }, []);

  if (dismissed) return null;

  function handleDismiss() {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="relative w-full bg-canvas border-b border-hairline overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
      <div className="flex items-center h-9 max-w-screen-2xl mx-auto">
        <div className="flex-none flex items-center gap-2 pl-6 pr-4 border-r border-hairline h-full">
          <Megaphone className="w-3.5 h-3.5 text-red-500" />
        </div>

        {announcement.display_mode === "rotate" ? (
          <RotateStrip
            announcements={announcement.announcements}
            rotateDuration={
              Number.isFinite(announcement.rotate_duration) &&
              announcement.rotate_duration > 0
                ? announcement.rotate_duration
                : FALLBACK_ROTATE_DURATION
            }
          />
        ) : (
          <ScrollStrip
            announcements={announcement.announcements}
            scrollSpeed={
              Number.isFinite(announcement.scroll_speed) &&
              announcement.scroll_speed > 0
                ? announcement.scroll_speed
                : FALLBACK_SCROLL_SPEED
            }
          />
        )}

        <button
          onClick={handleDismiss}
          aria-label="Dismiss announcement"
          className="flex-none px-4 h-full flex items-center text-ink-subtle hover:text-ink transition-colors cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

function AnnouncementText({ item }: { item: AnnouncementItem }) {
  const className = "text-xs sm:text-sm font-medium tracking-wide text-ink-muted";
  if (item.link_url) {
    return (
      <a href={item.link_url} className={`${className} hover:text-ink transition-colors`}>
        {item.text}
      </a>
    );
  }
  return <span className={className}>{item.text}</span>;
}

function ScrollStrip({
  announcements,
  scrollSpeed,
}: {
  announcements: AnnouncementItem[];
  scrollSpeed: number;
}) {
  const content = (
    <span className="inline-flex items-center gap-3 px-6">
      {announcements.map((item) => (
        <span key={item.id} className="inline-flex items-center gap-3">
          <AnnouncementText item={item} />
          <span className="w-1 h-1 rounded-full bg-red-500/60" />
        </span>
      ))}
    </span>
  );

  return (
    <div className="flex-1 flex overflow-hidden group">
      <div
        className="flex items-center w-max shrink-0 animate-marquee group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${scrollSpeed}s` }}
      >
        {content}
        {content}
      </div>
    </div>
  );
}

function RotateStrip({
  announcements,
  rotateDuration,
}: {
  announcements: AnnouncementItem[];
  rotateDuration: number;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (announcements.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % announcements.length);
    }, rotateDuration * 1000);
    return () => clearInterval(timer);
  }, [announcements.length, rotateDuration]);

  const current = announcements[index % announcements.length];

  return (
    <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
        >
          <AnnouncementText item={current} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
