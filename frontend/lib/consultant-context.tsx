"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

interface ConsultantContextValue {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

const ConsultantContext = createContext<ConsultantContextValue | null>(null);

// One modal, mounted once in the layout — the floating FAB, the footer's
// "Talk to a Consultant" link, and other quick-lead triggers all just call
// open() on this shared state, rather than each owning a separate copy of
// the form/modal. The full enquiry form lives at /contact instead of in
// this popup — see ContactForm.
export function ConsultantProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <ConsultantContext.Provider
      value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}
    >
      {children}
    </ConsultantContext.Provider>
  );
}

export function useConsultant() {
  const ctx = useContext(ConsultantContext);
  if (!ctx) {
    throw new Error("useConsultant must be used within ConsultantProvider");
  }
  return ctx;
}
