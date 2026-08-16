"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { createEnquiry, ApiRequestError } from "@/lib/api";
import { PrimaryCtaButton } from "@/app/components/PrimaryCtaButton";

const PHONE_PATTERN = /^(?:\+91|91)?[6-9]\d{9}$/;

type Status = "idle" | "submitting" | "success" | "error";

interface FormState {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const EMPTY_FORM: FormState = { name: "", phone: "", email: "", message: "" };

export function ContactForm() {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  function validate(): boolean {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.phone.trim()) {
      next.phone = "Phone number is required.";
    } else if (!PHONE_PATTERN.test(form.phone.trim())) {
      next.phone = "Enter a valid 10-digit mobile number.";
    }
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      next.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) next.message = "Tell us a bit about what you need.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setApiError(null);
    if (!validate()) return;

    setStatus("submitting");
    try {
      await createEnquiry({
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        message: form.message.trim(),
      });
      setStatus("success");
      setForm(EMPTY_FORM);
    } catch (err) {
      setStatus("error");
      setApiError(
        err instanceof ApiRequestError
          ? err.message
          : "Couldn't send that just now. Please try again in a moment."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="border border-hairline bg-surface p-8 flex flex-col items-center text-center gap-3 rounded-lg">
        <CheckCircle2 className="w-10 h-10 text-red-500" />
        <p className="text-sm font-bold text-ink uppercase tracking-widest">
          Enquiry Sent
        </p>
        <p className="text-sm text-ink-muted leading-relaxed max-w-sm">
          Our team will get back to you within 24-48 business hours.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="mt-2 text-xs font-bold text-ink uppercase tracking-widest hover:text-red-400 transition-colors border-b border-red-500 pb-1"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <Field
          label="Full Name"
          value={form.name}
          onChange={(v) => setForm((f) => ({ ...f, name: v }))}
          error={errors.name}
        />
        <Field
          label="Phone Number"
          type="tel"
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          error={errors.phone}
        />
      </div>
      <Field
        label="Email"
        type="email"
        value={form.email}
        onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        error={errors.email}
      />
      <div>
        <label className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-2">
          Message
        </label>
        <textarea
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell us about your car and what styling or aero upgrade you're after..."
          className="w-full bg-surface border border-hairline focus:border-red-500 rounded outline-none px-4 py-3 text-sm text-ink placeholder:text-ink-subtle transition-colors"
        />
        {errors.message && (
          <p className="text-xs text-red-400 mt-1">{errors.message}</p>
        )}
      </div>

      {apiError && <p className="text-xs text-red-400">{apiError}</p>}

      <PrimaryCtaButton
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto px-12 py-4 text-sm flex items-center justify-center gap-2 rounded"
      >
        {status === "submitting" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        Send Enquiry
      </PrimaryCtaButton>
    </form>
  );
}

function Field({
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
        className="w-full bg-surface border border-hairline focus:border-red-500 rounded outline-none px-4 py-3 text-sm text-ink transition-colors"
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
