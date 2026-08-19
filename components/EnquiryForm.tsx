"use client";

import { FormEvent, useState } from "react";
import {
  parseEnquiry,
  type EnquiryFieldErrors,
  type EnquiryInput,
} from "@/lib/enquiry-schema";
import { postEnquiry } from "@/lib/enquiry-api";

const fieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-maroon/30";
const errorClass = "border-maroon focus:ring-maroon/40";

export function EnquiryForm({
  submitLabel = "Send message",
  compact = false,
  onSent,
  categoryName,
  defaultMessage,
  source = "contact",
}: {
  submitLabel?: string;
  compact?: boolean;
  onSent?: () => void;
  categoryName?: string;
  defaultMessage?: string;
  source?: EnquiryInput["source"];
}) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [fields, setFields] = useState<EnquiryFieldErrors>({});
  const [loading, setLoading] = useState(false);

  function clearField(name: keyof EnquiryFieldErrors) {
    setFields((prev) => ({ ...prev, [name]: undefined }));
    setError("");
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      mobile: String(data.get("mobile") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      category: String(data.get("category") ?? categoryName ?? ""),
      source,
    };

    const parsed = parseEnquiry(payload);
    if (!parsed.ok) {
      setFields(parsed.fields);
      setError(parsed.error);
      return;
    }

    setFields({});
    setLoading(true);
    try {
      const { ok, data: body } = await postEnquiry(payload);
      if (!ok) {
        setFields(body.fields ?? {});
        setError(body.error || "Could not send. Please try again.");
        return;
      }
      setSent(true);
      onSent?.();
    } catch {
      setError("Could not send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className={compact ? "py-4 text-center" : "border border-maroon/30 bg-white p-8 text-center"}>
        <p className="font-display text-2xl text-maroon">Message received</p>
        <p className="mt-3 text-sm text-charcoal">
          Thank you. Our desk will get back to you shortly during working hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={compact ? "space-y-4" : "space-y-5"}>
      {categoryName ? <input type="hidden" name="category" value={categoryName} /> : null}
      <Field label="Name" error={fields.name}>
        <input
          name="name"
          type="text"
          autoComplete="name"
          maxLength={80}
          onChange={() => clearField("name")}
          className={`${fieldClass} ${fields.name ? errorClass : ""}`}
        />
      </Field>
      <Field label="Mobile" error={fields.mobile}>
        <input
          name="mobile"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          maxLength={14}
          onChange={() => clearField("mobile")}
          className={`${fieldClass} ${fields.mobile ? errorClass : ""}`}
        />
      </Field>
      <Field label="Email" error={fields.email}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={160}
          onChange={() => clearField("email")}
          className={`${fieldClass} ${fields.email ? errorClass : ""}`}
        />
      </Field>
      <Field label="Message" error={fields.message}>
        <textarea
          name="message"
          rows={compact ? 4 : 6}
          maxLength={2000}
          defaultValue={defaultMessage}
          onChange={() => clearField("message")}
          className={`${fieldClass} ${fields.message ? errorClass : ""}`}
        />
      </Field>
      {error && !Object.values(fields).some(Boolean) ? (
        <p className="text-sm text-maroon">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className={`rounded-full bg-maroon px-6 py-3 text-sm font-semibold !text-white hover:bg-maroon-deep disabled:opacity-60 ${
          compact ? "w-full" : ""
        }`}
      >
        {loading ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block font-semibold text-ink">{label}</span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-maroon">{error}</span> : null}
    </label>
  );
}
