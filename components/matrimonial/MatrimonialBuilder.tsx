"use client";

import { useMemo, useState } from "react";
import { NewspaperLogo } from "@/components/NewspaperWall";
import type { Newspaper } from "@/lib/data";
import { postEnquiry } from "@/lib/enquiry-api";
import { parseEnquiry, type EnquiryFieldErrors } from "@/lib/enquiry-schema";
import { calculatePricing, formatInr } from "@/lib/pricing";
import {
  openRazorpayCheckout,
  PaymentCancelledError,
  type RazorpayPaymentResponse,
} from "@/lib/razorpay-client";
import { SITE } from "@/lib/site";

export type MatrimonialBooking = {
  id: string;
  name: string;
  cities: string;
  papers: Newspaper[];
  label: string;
  unit: string;
  rate: number;
};

type AdFor = "bride" | "groom";

type PaymentStatus =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "paying" }
  | { kind: "verifying" }
  | { kind: "draft" }
  | { kind: "error"; message: string }
  | {
      kind: "success";
      paymentId: string;
      emailSent: boolean;
      adminNotified: boolean;
      savedInbox: boolean;
      warning?: string;
    };

const SAMPLE =
  "Alliance invited for a 29-year-old, 5'6\" tall, MBA graduate working as a marketing manager in a reputed company. Belongs to a well-educated family. Caste no bar. Contact: 98XXXXXXXX.";

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base text-ink outline-none transition placeholder:text-charcoal/70 focus:border-maroon/60 focus:ring-2 focus:ring-maroon/20 sm:text-sm";

function todayValue() {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, "0");
  const day = `${now.getDate()}`.padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function formatDate(value: string) {
  if (!value) return "Not selected";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
}

function isSunday(value: string) {
  if (!value) return false;
  const date = new Date(`${value}T00:00:00`);
  return !Number.isNaN(date.getTime()) && date.getDay() === 0;
}

export function MatrimonialBuilder({ booking }: { booking: MatrimonialBooking }) {
  const [adFor, setAdFor] = useState<AdFor>("bride");
  const [content, setContent] = useState("");
  const [name, setName] = useState("");
  const [contact, setContact] = useState({ mobile: "", email: "" });
  const [releaseDate, setReleaseDate] = useState("");

  const [fieldErrors, setFieldErrors] = useState<EnquiryFieldErrors>({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState<PaymentStatus>({ kind: "idle" });
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftKey, setDraftKey] = useState<string | null>(null);

  const pricing = useMemo(() => calculatePricing(booking.rate), [booking.rate]);
  const busy =
    status.kind === "saving" || status.kind === "paying" || status.kind === "verifying";

  const adType = adFor === "bride" ? "Bride Wanted" : "Groom Wanted";
  const words = content.trim() ? content.trim().split(/\s+/).length : 0;

  async function submit() {
    setError("");

    if (content.trim().length < 10) {
      setError("Please write at least a line or two about the bride or groom.");
      return;
    }
    if (!releaseDate) {
      setError("Please select the release date.");
      return;
    }
    if (releaseDate < todayValue()) {
      setError("Release date cannot be in the past.");
      return;
    }

    const message = [
      "Matrimonial ad request",
      "",
      `Ad type: ${adType}`,
      `Selected package: ${booking.name}`,
      `Newspapers: ${booking.label}`,
      `Coverage: ${booking.cities}`,
      `Package: ${booking.unit}`,
      `Package rate: ${formatInr(pricing.basePaise)}`,
      `GST (5%): ${formatInr(pricing.gstPaise)}`,
      `Convenience fee (2.5% on rate + GST): ${formatInr(pricing.conveniencePaise)}`,
      `Total payable: ${formatInr(pricing.totalPaise)}`,
      `Release date: ${releaseDate}`,
      "",
      "Ad content:",
      content.trim(),
    ].join("\n");

    const payload = {
      name,
      mobile: contact.mobile,
      email: contact.email,
      message,
      category: "Matrimonial",
      source: "category" as const,
    };

    const parsed = parseEnquiry(payload);
    if (!parsed.ok) {
      setFieldErrors(parsed.fields);
      setError(parsed.error);
      return;
    }

    const { name: customerName, mobile, email } = parsed.data;
    const currentDraftKey = `${mobile}|${email}|${message}`;

    setFieldErrors({});
    setStatus({ kind: "saving" });

    try {
      let activeDraftId = draftId;

      // Save the draft in the admin panel before payment, so the desk sees the
      // request even if the customer abandons the payment window.
      if (!activeDraftId || draftKey !== currentDraftKey) {
        const { ok, data } = await postEnquiry({
          name: customerName,
          mobile,
          email,
          message,
          category: "Matrimonial",
          source: "category",
          notifyAdmin: true,
          paymentPending: true,
        });

        if (!ok) {
          setFieldErrors(data.fields ?? {});
          throw new Error(data.error || "Could not save your draft. Please try again.");
        }
        if (!data.id) {
          throw new Error("Could not save your draft. Please try again.");
        }

        activeDraftId = String(data.id);
        setDraftId(activeDraftId);
        setDraftKey(currentDraftKey);
      }

      setStatus({ kind: "paying" });

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName,
          email,
          phone: mobile,
          service: "matrimonial",
          packageId: booking.id,
          city: booking.cities,
          papers: booking.papers.map((paper) => paper.slug),
          purpose: booking.name,
        }),
      });
      const order = await orderRes.json().catch(() => ({}));
      if (!orderRes.ok) {
        throw new Error(order.error || "Could not start payment. Please try again.");
      }

      const payment: RazorpayPaymentResponse = await openRazorpayCheckout({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        orderId: order.orderId,
        description: booking.name,
        prefill: { name: customerName, email, contact: mobile },
        notes: { city: booking.cities, papers: booking.label },
      });

      setStatus({ kind: "verifying" });

      const verifyRes = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payment, enquiryId: activeDraftId, message }),
      });
      const verified = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok) {
        throw new Error(verified.error || "Payment verification failed.");
      }

      setStatus({
        kind: "success",
        paymentId: verified.paymentId || payment.razorpay_payment_id,
        emailSent: Boolean(verified.emailSent),
        adminNotified: Boolean(verified.adminNotified),
        savedInbox: Boolean(verified.savedToInbox),
        warning: verified.warning,
      });
    } catch (err) {
      if (err instanceof PaymentCancelledError) {
        setStatus({ kind: "draft" });
        return;
      }
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Payment could not be completed.",
      });
    }
  }

  return (
    <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">Write your matrimonial ad</h2>

        <div className="mt-6 space-y-4">
          <fieldset>
            <legend className="mb-1.5 text-[15px] font-bold text-ink">
              This ad is for <span className="text-maroon">*</span>
            </legend>
            <div className="flex flex-wrap gap-5 text-sm text-ink">
              <Radio checked={adFor === "bride"} onChange={() => setAdFor("bride")} label="Bride Wanted" />
              <Radio checked={adFor === "groom"} onChange={() => setAdFor("groom")} label="Groom Wanted" />
            </div>
          </fieldset>

          <Field label="Ad content" required>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={SAMPLE}
              maxLength={1200}
              rows={6}
              className={`${inputClass} resize-y`}
            />
            <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
              <span className="text-[12px] text-charcoal">{words} words</span>
              <button
                type="button"
                onClick={() => setContent(SAMPLE)}
                className="text-xs font-semibold text-maroon hover:underline"
              >
                Use sample wording
              </button>
            </div>
          </Field>

          <Field label="Your name" required error={fieldErrors.name}>
            <input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFieldErrors((f) => ({ ...f, name: undefined }));
              }}
              placeholder="Name of the person booking the ad"
              maxLength={80}
              className={`${inputClass} ${fieldErrors.name ? "border-maroon" : ""}`}
            />
          </Field>

          <Field label="Mobile no." required error={fieldErrors.mobile}>
            <input
              value={contact.mobile}
              onChange={(e) => {
                setContact((c) => ({ ...c, mobile: e.target.value }));
                setFieldErrors((f) => ({ ...f, mobile: undefined }));
              }}
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={14}
              className={`${inputClass} ${fieldErrors.mobile ? "border-maroon" : ""}`}
            />
          </Field>

          <Field label="Email-id" required error={fieldErrors.email}>
            <input
              value={contact.email}
              onChange={(e) => {
                setContact((c) => ({ ...c, email: e.target.value }));
                setFieldErrors((f) => ({ ...f, email: undefined }));
              }}
              type="email"
              autoComplete="email"
              maxLength={160}
              className={`${inputClass} ${fieldErrors.email ? "border-maroon" : ""}`}
            />
          </Field>

          <Field label="Release date" required>
            <input
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              type="date"
              min={todayValue()}
              className={inputClass}
            />
          </Field>
          <p className="text-[13px] leading-relaxed text-charcoal">
            Most matrimonial classifieds publish on Sunday.{" "}
            {releaseDate && !isSunday(releaseDate)
              ? "The date you picked is not a Sunday — the desk will confirm availability."
              : "Pick the Sunday you want the ad to appear."}
          </p>
        </div>

        {error ? <p className="mt-4 text-sm text-maroon">{error}</p> : null}

        {status.kind === "error" ? (
          <p
            role="alert"
            className="mt-4 rounded-lg border border-maroon/30 bg-maroon/5 px-4 py-3 text-sm text-maroon"
          >
            {status.message}
          </p>
        ) : null}

        <section className="mt-10 border border-line bg-white">
          <div className="border-b border-line px-5 py-4 sm:px-6">
            <h2 className="font-display text-2xl text-ink sm:text-[28px]">Ad Preview &amp; Payment</h2>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-maroon">{adType}</p>
            <div className="mt-2 border border-maroon/30 bg-paper-2/40 px-4 py-4 text-[15px] leading-relaxed text-ink">
              {content.trim() || SAMPLE}
            </div>
            <p className="mt-1 text-[11px] text-charcoal">Preview updates as you type.</p>

            <dl className="mt-5 text-sm">
              <SummaryRow label="Package" value={booking.name} />
              <SummaryRow label="Newspapers" value={booking.label} />
              <SummaryRow label="Coverage" value={booking.cities} />
              <SummaryRow label="Release date" value={formatDate(releaseDate)} />
              <SummaryRow label="Name" value={name.trim() || "—"} />
              <SummaryRow label="Email" value={contact.email || "—"} />
              <SummaryRow label="Phone" value={contact.mobile || "—"} />
              <SummaryRow label="Amount" value={formatInr(pricing.basePaise)} />
              <SummaryRow label="GST (5%)" value={formatInr(pricing.gstPaise)} />
              <SummaryRow label="Convenience fee @2.5%" value={formatInr(pricing.conveniencePaise)} />
            </dl>

            <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
              <span className="font-display text-lg font-semibold text-ink">Total Amount</span>
              <span className="font-display text-2xl font-semibold text-maroon">
                {formatInr(pricing.totalPaise)}
              </span>
            </div>

            {status.kind === "saving" ? (
              <Status> Saving your draft in the admin panel…</Status>
            ) : null}
            {status.kind === "paying" ? (
              <Status>Draft saved. Opening the payment window…</Status>
            ) : null}
            {status.kind === "verifying" ? (
              <Status>Payment received. Verifying… please do not close this page.</Status>
            ) : null}

            {draftId && status.kind !== "success" && status.kind !== "verifying" ? (
              <p className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-900">
                Draft saved in our admin panel. Complete the payment to confirm your booking.
              </p>
            ) : null}

            {status.kind === "success" ? (
              <div className="mt-5 border border-emerald-200 bg-emerald-50 p-5 text-center">
                <p className="font-display text-xl text-emerald-800">Payment successful</p>
                <p className="mt-2 text-sm text-charcoal">
                  {formatInr(pricing.totalPaise)} paid. Payment ID:{" "}
                  <span className="font-semibold text-ink">{status.paymentId}</span>
                </p>
                <p className="mt-2 text-sm text-charcoal">
                  {status.emailSent
                    ? `Payment confirmation sent to ${contact.email}.`
                    : status.warning || "Payment confirmed, but the confirmation email could not be sent."}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-charcoal">
                  {status.adminNotified || status.savedInbox
                    ? "Our desk has received your ad and will confirm the wording, newspaper and publishing date on WhatsApp."
                    : "Please contact the desk with your payment ID so we can process your booking."}
                </p>
              </div>
            ) : (
              <div className="mt-5">
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void submit()}
                  className="btn-primary w-full disabled:opacity-60 sm:w-auto"
                >
                  {status.kind === "saving"
                    ? "Saving draft…"
                    : status.kind === "paying"
                      ? "Opening payment…"
                      : status.kind === "verifying"
                        ? "Verifying payment…"
                        : "Make Payment"}
                </button>
                <p className="mt-2 max-w-md text-xs leading-relaxed text-charcoal">
                  Your draft is saved before payment. Total includes 5% GST and a 2.5%
                  convenience fee on rate + GST.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
        <div className="border border-maroon/40 bg-white p-5">
          <h2 className="font-display text-xl text-ink">Your selected package</h2>
          <div className="mt-3 space-y-2 text-sm">
            <p className="text-ink">
              <span className="font-semibold">Package:</span> {booking.name}
            </p>
            <p className="text-ink">
              <span className="font-semibold">Newspapers:</span> {booking.label}
            </p>
            <p className="text-ink">
              <span className="font-semibold">Available in:</span> {booking.cities}
            </p>
            <p className="text-ink">
              <span className="font-semibold">Price:</span> {formatInr(pricing.basePaise)} /{" "}
              {booking.unit}
            </p>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-3">
            {booking.papers.map((paper) => (
              <span key={paper.slug} className="inline-flex h-8 items-center">
                <NewspaperLogo paper={paper} />
              </span>
            ))}
          </div>
        </div>

        <div className="border border-line bg-white p-5">
          <h2 className="font-display text-xl text-ink">Contact us</h2>
          <p className="mt-2 text-sm text-charcoal">
            Need help? Call{" "}
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-maroon">
              {SITE.phone}
            </a>
          </p>
          <p className="mt-1 text-sm">
            <a href={`mailto:${SITE.email}`} className="text-maroon hover:underline">
              {SITE.email}
            </a>
          </p>
          <p className="mt-3 text-xs leading-relaxed text-charcoal">
            {SITE.hours}. {SITE.cutoff}.
          </p>
        </div>
      </aside>
    </div>
  );
}

function Status({ children }: { children: React.ReactNode }) {
  return (
    <p
      role="status"
      className="mt-4 rounded-lg border border-line bg-paper-2/60 px-4 py-2.5 text-sm text-charcoal"
    >
      {children}
    </p>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <dt className="text-charcoal">{label}</dt>
      <dd className="max-w-[65%] break-words text-right font-medium text-ink">{value}</dd>
    </div>
  );
}

function Radio({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-maroon"
      />
      <span className="font-semibold">{label}</span>
    </label>
  );
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-[15px] font-bold text-ink">
        {label}
        {required ? <span className="text-maroon"> *</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-xs font-semibold text-maroon">{error}</span> : null}
    </label>
  );
}
