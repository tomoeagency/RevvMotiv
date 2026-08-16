"use client";

import { useConsultant } from "@/lib/consultant-context";

// The in-footer equivalent of the floating consultant FAB — opens the same
// shared modal (see ConsultantProvider), so once the floating button fades
// out near the footer, this is the real, reachable replacement rather than
// the action just disappearing.
export function ConsultantFooterLink() {
  const { open } = useConsultant();

  return (
    <button
      onClick={open}
      className="hover:text-red-400 transition-colors text-left"
    >
      Talk to a Consultant
    </button>
  );
}
