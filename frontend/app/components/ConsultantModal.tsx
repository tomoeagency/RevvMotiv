"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { X, Send, Loader2, CheckCircle2 } from "lucide-react";
import { createLead, ApiRequestError } from "@/lib/api";
import { useConsultant } from "@/lib/consultant-context";
import { PrimaryCtaButton } from "@/app/components/PrimaryCtaButton";
import { MOTION_DURATION, MOTION_EASE_BRAND } from "@/lib/motion-tokens";

// India-format mobile: optional +91/91 prefix, then a 10-digit number
// starting 6-9.
const PHONE_PATTERN = /^(?:\+91|91)?[6-9]\d{9}$/;

type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  phone: string;
}

const EMPTY_FORM: FormState = { name: "", phone: "" };

// The modal itself — mounted once in the layout. Any number of triggers
// (the floating FAB, the footer link, TalkToUsButton) share this single
// instance via ConsultantProvider, so there's one form/one submission
// state regardless of which trigger opened it. Quick-lead capture only
// (name + phone, createLead) — the fuller enquiry form lives at its own
// page, /contact, not nested in this popup.
export function ConsultantModal() {
  const { isOpen, close: closeContext } = useConsultant();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  function reset() {
    setForm(EMPTY_FORM);
    setStatus("idle");
    setErrors({});
    setApiError(null);
  }

  function close() {
    closeContext();
    // Delay reset past the exit animation so the form doesn't visibly
    // blank out while the modal is still closing.
    setTimeout(reset, 300);
  }

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (!PHONE_PATTERN.test(form.phone.trim())) {
      next.phone = "Enter a valid 10-digit mobile number.";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setStatus("submitting");
    try {
      await createLead({ name: form.name.trim(), phone: form.phone.trim() });
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setApiError(
        err instanceof ApiRequestError
          ? err.message
          : "Couldn't send that just now. Please try again in a moment."
      );
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 bg-black/60 z-[65]"
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: MOTION_DURATION.base, ease: MOTION_EASE_BRAND }}
            role="dialog"
            aria-modal="true"
            aria-label="Request a callback"
            className="fixed inset-x-4 bottom-24 sm:inset-x-auto sm:right-6 sm:bottom-24 z-[70] w-auto sm:w-[380px] bg-surface border border-hairline shadow-[0_0_60px_rgba(0,0,0,0.8)]"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-hairline">
              <span className="text-sm font-bold text-ink uppercase tracking-widest">
                Request a Callback
              </span>
              <button
                onClick={close}
                aria-label="Close"
                className="text-ink-muted hover:text-ink transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {status === "success" ? (
                <div className="flex flex-col items-center text-center gap-3 py-4">
                  <CheckCircle2 className="w-10 h-10 text-red-500" />
                  <p className="text-sm font-bold text-ink uppercase tracking-widest">
                    Request Received
                  </p>
                  <p className="text-sm text-ink-muted leading-relaxed">
                    Our workshop team will call you back shortly.
                  </p>
                  <button
                    onClick={close}
                    className="mt-2 text-xs font-bold text-ink uppercase tracking-widest hover:text-red-400 transition-colors border-b border-red-500 pb-1"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <p className="text-xs text-ink-muted leading-relaxed">
                    Enter your contact details and our team will call you to confirm fitment and recommend the right parts for your car.
                  </p>

                  <WidgetField
                    label="Full Name"
                    value={form.name}
                    onChange={(v) => setForm((f) => ({ ...f, name: v }))}
                    error={errors.name}
                  />
                  <WidgetField
                    label="Mobile Number"
                    type="tel"
                    value={form.phone}
                    onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                    error={errors.phone}
                  />

                  {apiError && (
                    <p className="text-xs text-red-400">{apiError}</p>
                  )}

                  <PrimaryCtaButton
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full px-6 py-3.5 text-xs flex items-center justify-center gap-2"
                  >
                    {status === "submitting" ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    Request Callback
                  </PrimaryCtaButton>

                  <Link
                    href="/contact"
                    onClick={close}
                    className="block text-center text-[11px] font-bold text-ink-subtle hover:text-ink-muted uppercase tracking-widest transition-colors"
                  >
                    Have custom build questions? Contact us
                  </Link>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function WidgetField({
  label,
  value,
  onChange,
  error,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface border border-hairline focus:border-[var(--brand-red)] outline-none px-4 py-3 text-sm text-ink transition-colors"
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
