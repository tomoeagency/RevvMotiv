"use client";

import { MessageCircle } from "lucide-react";
import { useConsultant } from "@/lib/consultant-context";

// Opens the shared consultant modal in lead ("quick") mode — used as the
// secondary action next to ClosingCta's "Shop Parts" link. The dedicated
// enquiry flow now lives at /contact; this stays a fast callback request,
// kept as its own tiny client component so pages that use it can stay
// server components.
export function TalkToUsButton() {
  const { open } = useConsultant();

  return (
    <button
      onClick={() => open()}
      className="inline-flex items-center gap-2 px-12 py-4 border border-hairline-strong text-ink text-sm font-bold uppercase tracking-widest hover:border-[var(--brand-red)] hover:text-[var(--brand-red)] transition-colors"
    >
      <MessageCircle className="w-4 h-4" />
      Talk to Us
    </button>
  );
}
