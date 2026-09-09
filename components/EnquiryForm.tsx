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
const compactFieldClass =
  "w-full rounded-md border border-line bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-maroon/30";
const errorClass = "border-maroon focus:ring-maroon/40";

export function EnquiryForm({
  submitLabel = "Send message",
  compact = false,
  fill = false,
  onSent,
  categoryName,
  defaultMessage,
  source = "contact",
}: {
  submitLabel?: string;
  compact?: boolean;
  fill?: boolean;
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
      <div className={compact ? "flex flex-1 items-center justify-center py-4 text-center" : "border border-maroon/30 bg-white p-8 text-center"}>
        <div>
          <p className="font-display text-2xl text-maroon">Message received</p>
          <p className="mt-3 text-sm text-charcoal">
            Thank you. Our desk will get back to you shortly during working hours.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={
        compact
          ? fill
            ? "flex min-h-0 flex-1 flex-col gap-3"
            : "space-y-3"
          : "space-y-5"
      }
    >
      {categoryName ? <input type="hidden" name="category" value={categoryName} /> : null}
      <div className={compact ? "grid grid-cols-1 gap-3 min-[480px]:grid-cols-2" : "contents"}>
        <Field label="Name" error={fields.name} compact={compact}>
          <input
            name="name"
            type="text"
            autoComplete="name"
            maxLength={80}
            onChange={() => clearField("name")}
            className={`${compact ? compactFieldClass : fieldClass} ${fields.name ? errorClass : ""}`}
          />
        </Field>
        <Field label="Mobile" error={fields.mobile} compact={compact}>
          <input
            name="mobile"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            maxLength={14}
            onChange={() => clearField("mobile")}
            className={`${compact ? compactFieldClass : fieldClass} ${fields.mobile ? errorClass : ""}`}
          />
        </Field>
      </div>
      <Field label="Email" error={fields.email} compact={compact}>
        <input
          name="email"
          type="email"
          autoComplete="email"
          maxLength={160}
          onChange={() => clearField("email")}
          className={`${compact ? compactFieldClass : fieldClass} ${fields.email ? errorClass : ""}`}
        />
      </Field>
      <Field label="Message" error={fields.message} compact={compact} grow={fill}>
        <textarea
          name="message"
          rows={compact ? (fill ? 4 : 2) : 6}
          maxLength={2000}
          defaultValue={defaultMessage}
          onChange={() => clearField("message")}
          className={`${compact ? compactFieldClass : fieldClass} ${fields.message ? errorClass : ""} ${
          fill ? "min-h-24 flex-1 resize-none sm:min-h-32" : ""
          }`}
        />
      </Field>
      {error && !Object.values(fields).some(Boolean) ? (
        <p className="text-sm text-maroon">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className={`btn-primary disabled:opacity-60 ${compact ? "mt-auto w-full" : ""}`}
      >
        {loading ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  compact,
  grow,
  children,
}: {
  label: string;
  error?: string;
  compact?: boolean;
  grow?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`block text-sm ${grow ? "flex min-h-0 flex-1 flex-col" : ""}`}>
      <span className={`block font-semibold text-ink ${compact ? "mb-1 text-xs" : "mb-1.5"}`}>
        {label}
      </span>
      {children}
      {error ? <span className="mt-1 block text-xs text-maroon">{error}</span> : null}
    </label>
  );
}
