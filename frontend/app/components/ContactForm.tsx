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
    const cleanPhone = form.phone.replace(/[\s\-()]/g, "");
    if (!cleanPhone) {
      next.phone = "Phone number is required.";
    } else if (!PHONE_PATTERN.test(cleanPhone)) {
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
      const cleanPhone = form.phone.replace(/[\s\-()]/g, "");
      await createEnquiry({
        name: form.name.trim(),
        phone: cleanPhone,
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
          className="mt-2 text-xs font-bold text-ink uppercase tracking-widest hover:text-red-400 transition-colors border-b border-red-500 pb-1 cursor-pointer"
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
          autoComplete="name"
        />
        <Field
          label="Phone Number"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={form.phone}
          onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
          error={errors.phone}
        />
      </div>
      <Field
        label="Email"
        type="email"
        inputMode="email"
        autoComplete="email"
        value={form.email}
        onChange={(v) => setForm((f) => ({ ...f, email: v }))}
        error={errors.email}
      />
      <div>
        <label htmlFor="contact-form-message" className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="contact-form-message"
          rows={5}
          value={form.message}
          onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
          placeholder="Tell us about your car and what styling or aero upgrade you're after..."
          className="w-full bg-surface-alt border border-hairline focus:border-red-500 rounded-lg outline-none px-4 py-3 text-sm text-ink placeholder:text-ink-subtle transition-colors"
        />
        {errors.message && (
          <p className="text-xs text-red-400 mt-1">{errors.message}</p>
        )}
      </div>

      {apiError && <p className="text-xs text-red-400">{apiError}</p>}

      <PrimaryCtaButton
        type="submit"
        disabled={status === "submitting"}
        className="w-full sm:w-auto px-10 py-3.5 text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl cursor-pointer"
      >
        {status === "submitting" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Send className="w-4 h-4" />
        )}
        <span>Send Enquiry</span>
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
  inputMode,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  inputMode?: "text" | "tel" | "email" | "numeric";
  autoComplete?: string;
}) {
  const id = `contact-field-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <div>
      <label htmlFor={id} className="block text-[10px] font-bold text-ink-subtle uppercase tracking-widest mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface-alt border border-hairline focus:border-red-500 rounded-lg outline-none px-4 py-3 text-sm text-ink transition-colors"
      />
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </div>
  );
}
