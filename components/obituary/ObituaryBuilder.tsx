"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaLock,
  FaPhoneAlt,
  FaSpinner,
  FaWhatsapp,
} from "react-icons/fa";
import { NewspaperLogo } from "@/components/NewspaperWall";
import { calculatePricing, formatInr } from "@/lib/pricing";
import {
  openRazorpayCheckout,
  PaymentCancelledError,
  type RazorpayPaymentResponse,
} from "@/lib/razorpay-client";
import { SITE } from "@/lib/site";
import type { Newspaper } from "@/lib/data";

export type ObituaryBooking = {
  id: string;
  name: string;
  label: string;
  cities: string;
  unit: string;
  size: string;
  bw: boolean;
  rate: number;
  papers: Newspaper[];
};

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base text-ink outline-none transition placeholder:text-charcoal/70 focus:border-maroon/60 focus:ring-2 focus:ring-maroon/20 sm:text-sm";

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function ObituaryBuilder({ booking }: { booking: ObituaryBooking }) {
  const [deceasedName, setDeceasedName] = useState("");
  const [age, setAge] = useState("");
  const [relation, setRelation] = useState("");
  const [relationName, setRelationName] = useState("");
  const [dateOfDeath, setDateOfDeath] = useState("");
  const [funeral, setFuneral] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<{
    orderId: string;
    paymentId: string;
    totalPaise: number;
  } | null>(null);

  const pricing = calculatePricing(booking.rate);

  function validate() {
    const errors: Record<string, string> = {};
    if (deceasedName.trim().length < 2) errors.deceasedName = "Enter the deceased's full name.";
    if (!dateOfDeath) errors.dateOfDeath = "Enter the date of death.";
    if (name.trim().length < 2) errors.name = "Enter a contact person's name.";
    const digits = mobile.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) errors.mobile = "Enter a valid 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Enter a valid email.";
    if (content.trim().length < 10) errors.content = "Please write the notice (min. 10 characters).";
    return errors;
  }

  async function onPay() {
    setError("");
    const errors = validate();
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service: "obituary",
          city: "Delhi",
          papers: booking.papers.map((paper) => paper.slug),
          packageId: booking.id,
          purpose: `Obituary · ${deceasedName.trim()}`,
          name: name.trim(),
          email: email.trim(),
          phone: mobile,
          content: content.trim(),
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
        description: `Obituary ad — ${booking.label}`,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: mobile.replace(/\D/g, "").slice(-10),
        },
        notes: {
          purpose: `Obituary · ${deceasedName.trim()}`,
          ...(publicationDate ? { publication_date: publicationDate } : {}),
        },
      });

      const verifyRes = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: payment.razorpay_order_id,
          razorpay_payment_id: payment.razorpay_payment_id,
          razorpay_signature: payment.razorpay_signature,
          message: [
            "Obituary ad booking on AD2PRINT",
            "",
            `Deceased: ${deceasedName.trim()}`,
            `Date of death: ${dateOfDeath}`,
            age.trim() ? `Age: ${age.trim()}` : "",
            relation.trim() && relationName.trim()
              ? `${relation.trim()} of ${relationName.trim()}`
              : "",
            funeral.trim() ? `Funeral / last rites: ${funeral.trim()}` : "",
            `Papers: ${booking.label}`,
            publicationDate ? `Publication date requested: ${publicationDate}` : "",
            "",
            `Notice wording:\n${content.trim()}`,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      const verified = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok) {
        throw new Error(
          verified?.error || "Payment received but verification failed. Please call the desk.",
        );
      }

      setSuccess({
        orderId: payment.razorpay_order_id,
        paymentId: payment.razorpay_payment_id,
        totalPaise: order.amount,
      });
    } catch (err) {
      if (err instanceof PaymentCancelledError) {
        setError("Payment cancelled. Your details are safe — tap Pay again whenever you're ready.");
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong. Please try again or call the desk.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="mx-auto max-w-2xl py-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100">
          <FaCheckCircle className="h-7 w-7 text-emerald-700" aria-hidden />
        </span>
        <h1 className="mt-5 font-display text-3xl text-ink">Notice received with condolences</h1>
        <p className="mt-3 text-sm leading-relaxed text-charcoal">
          The desk has received your obituary booking. We will confirm the edition and publication
          date by phone or email before it prints.
        </p>
        <dl className="mx-auto mt-6 max-w-md divide-y divide-line border-y border-line text-left text-sm">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-charcoal">Notice</dt>
            <dd className="text-right font-semibold text-ink">{booking.label}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-charcoal">Order ID</dt>
            <dd className="text-right font-mono text-xs font-semibold text-ink">{success.orderId}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-charcoal">Payment ID</dt>
            <dd className="text-right font-mono text-xs font-semibold text-ink">{success.paymentId}</dd>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-charcoal">Amount paid</dt>
            <dd className="text-right font-semibold text-ink">{formatInr(success.totalPaise)}</dd>
          </div>
        </dl>
        <p className="mt-6 text-xs text-slate">
          Questions? Call{" "}
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-maroon">
            {SITE.phone}
          </a>{" "}
          — quote the order ID above.
        </p>
        <Link
          href="/obituary"
          className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-maroon hover:underline"
        >
          ← Back to obituary packages
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] xl:grid-cols-[minmax(0,1fr)_23rem]">
      <div className="border border-line bg-white">
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-maroon">
            Obituary notice · Size {booking.size} cm{booking.bw ? " · B/w" : ""}
          </p>
          <h1 className="mt-1 font-display text-xl text-ink sm:text-2xl">Compose the obituary notice</h1>
          <p className="mt-1.5 text-xs leading-relaxed text-charcoal">{booking.label}</p>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-6">
          <p className="rounded-lg border border-line bg-paper-2/40 px-4 py-3 text-xs leading-relaxed text-charcoal">
            The published name, date and place are never edited by us — send the exact final copy.
            The desk fits it to the chosen size and confirms the proof before print.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ob-deceased" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
                Deceased&apos;s full name *
              </label>
              <input
                id="ob-deceased"
                value={deceasedName}
                onChange={(e) => {
                  setDeceasedName(e.target.value);
                  setFieldErrors((p) => ({ ...p, deceasedName: "" }));
                }}
                className={`${inputClass} mt-1.5 ${fieldErrors.deceasedName ? "border-maroon" : ""}`}
                placeholder="Late Shri Ram Kumar Sharma"
              />
              {fieldErrors.deceasedName ? (
                <p className="mt-1 text-[11px] text-maroon">{fieldErrors.deceasedName}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ob-age" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
                Age at death
              </label>
              <input
                id="ob-age"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={`${inputClass} mt-1.5`}
                placeholder="74 years"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ob-date" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
                Date of death *
              </label>
              <input
                id="ob-date"
                type="date"
                value={dateOfDeath}
                onChange={(e) => {
                  setDateOfDeath(e.target.value);
                  setFieldErrors((p) => ({ ...p, dateOfDeath: "" }));
                }}
                className={`${inputClass} mt-1.5 ${fieldErrors.dateOfDeath ? "border-maroon" : ""}`}
              />
              {fieldErrors.dateOfDeath ? (
                <p className="mt-1 text-[11px] text-maroon">{fieldErrors.dateOfDeath}</p>
              ) : null}
            </div>
            <div className="grid grid-cols-[8rem_1fr] gap-2">
              <div>
                <label htmlFor="ob-rel" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
                  Relation
                </label>
                <input
                  id="ob-rel"
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className={`${inputClass} mt-1.5`}
                  placeholder="Son / Daughter"
                />
              </div>
              <div>
                <label htmlFor="ob-rel-name" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
                  Of
                </label>
                <input
                  id="ob-rel-name"
                  value={relationName}
                  onChange={(e) => setRelationName(e.target.value)}
                  className={`${inputClass} mt-1.5`}
                  placeholder="Shri Mohan Lal Sharma"
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="ob-funeral" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
              Funeral / last rites details
            </label>
            <input
              id="ob-funeral"
              value={funeral}
              onChange={(e) => setFuneral(e.target.value)}
              className={`${inputClass} mt-1.5`}
              placeholder="Cremation tomorrow at 10 AM, Nigambodh Ghat"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ob-name" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
                Your name *
              </label>
              <input
                id="ob-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setFieldErrors((p) => ({ ...p, name: "" }));
                }}
                className={`${inputClass} mt-1.5 ${fieldErrors.name ? "border-maroon" : ""}`}
                placeholder="Ramesh Sharma"
              />
              {fieldErrors.name ? (
                <p className="mt-1 text-[11px] text-maroon">{fieldErrors.name}</p>
              ) : null}
            </div>
            <div>
              <label htmlFor="ob-mobile" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
                Mobile *
              </label>
              <input
                id="ob-mobile"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  setFieldErrors((p) => ({ ...p, mobile: "" }));
                }}
                className={`${inputClass} mt-1.5 ${fieldErrors.mobile ? "border-maroon" : ""}`}
                placeholder="98765 43210"
              />
              {fieldErrors.mobile ? (
                <p className="mt-1 text-[11px] text-maroon">{fieldErrors.mobile}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="ob-email" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
              Email *
            </label>
            <input
              id="ob-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFieldErrors((p) => ({ ...p, email: "" }));
              }}
              className={`${inputClass} mt-1.5 ${fieldErrors.email ? "border-maroon" : ""}`}
              placeholder="you@example.com"
            />
            {fieldErrors.email ? (
              <p className="mt-1 text-[11px] text-maroon">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="ob-content" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
              Notice wording (exact) *
            </label>
            <textarea
              id="ob-content"
              rows={6}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                setFieldErrors((p) => ({ ...p, content: "" }));
              }}
              className={`${inputClass} mt-1.5 min-h-[9rem] resize-y font-serif ${fieldErrors.content ? "border-maroon" : ""}`}
              placeholder={
                "It is with deep sorrow that we inform the demise of Shri Ram Kumar Sharma, aged 74 years, on 15 November 2026 at his residence, Rohini, Delhi. Funeral at Nigambodh Ghat on 16 November at 10 AM. Family\n"
              }
            />
            {fieldErrors.content ? (
              <p className="mt-1 text-[11px] text-maroon">{fieldErrors.content}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="ob-date2" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
              Publication date <span className="font-sans font-medium normal-case tracking-normal text-slate">(optional)</span>
            </label>
            <input
              id="ob-date2"
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              className={`${inputClass} mt-1.5`}
            />
          </div>

          {error ? (
            <p role="alert" className="rounded-lg border border-maroon/30 bg-maroon/5 px-4 py-3 text-sm text-maroon">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <aside className="h-fit border border-line bg-white p-5 lg:sticky lg:top-24">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-charcoal">
          Notice details
        </p>
        <div className="mt-3 flex items-center gap-3 border-b border-line pb-4">
          <div className="flex flex-wrap gap-1.5">
            {booking.papers.map((paper) => (
              <span key={paper.slug} className="flex h-8 w-24 items-center">
                <NewspaperLogo paper={paper} className="max-h-8 max-w-full object-contain" />
              </span>
            ))}
          </div>
        </div>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-charcoal">Size</dt>
            <dd className="font-semibold text-ink">{booking.size} cm{booking.bw ? " · B/w" : ""}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-charcoal">Package ({booking.unit})</dt>
            <dd className="font-semibold text-ink">{inr(booking.rate)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-line pt-2.5">
            <dt className="text-charcoal">GST (5%)</dt>
            <dd className="font-semibold text-ink">{inr(Math.round(pricing.gstPaise / 100))}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-charcoal">Convenience fee (2.5%)</dt>
            <dd className="font-semibold text-ink">{inr(Math.round(pricing.conveniencePaise / 100))}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-ink pt-2.5">
            <dt className="font-bold text-ink">Total payable</dt>
            <dd className="font-display text-xl font-bold text-maroon">
              {inr(Math.round(pricing.totalPaise / 100))}
            </dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={onPay}
          disabled={loading}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-maroon px-4 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(200,16,46,0.25)] transition hover:bg-maroon-deep disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? (
            <>
              <FaSpinner className="h-4 w-4 animate-spin" aria-hidden /> Processing…
            </>
          ) : (
            <>
              <FaLock className="h-4 w-4" aria-hidden /> Pay {inr(Math.round(pricing.totalPaise / 100))} securely
            </>
          )}
        </button>
        <p className="mt-2 text-center text-[10px] leading-snug text-slate">
          UPI · Cards · Net Banking — secured by Razorpay. 5% GST included in the total.
        </p>

        <div className="mt-4 border-t border-line pt-4 text-xs leading-relaxed text-charcoal">
          <p className="flex items-start gap-2">
            <FaCheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-maroon" aria-hidden />
            The desk confirms the edition, size &amp; publication date before printing.
          </p>
          <p className="mt-2 flex items-start gap-2">
            <FaCheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-maroon" aria-hidden />
            e-paper page + GST invoice sent after publication.
          </p>
        </div>

        <a
          href={`tel:${SITE.phone.replace(/\s/g, "")}`}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-line px-4 py-2.5 text-xs font-semibold text-ink transition hover:border-maroon/40 hover:text-maroon"
        >
          <FaPhoneAlt className="h-3.5 w-3.5" aria-hidden /> Need help? Call {SITE.phone}
        </a>
        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0b6b37]/25 px-4 py-2.5 text-xs font-semibold text-[#0b6b37] transition hover:border-[#0b6b37]/50"
        >
          <FaWhatsapp className="h-3.5 w-3.5" aria-hidden /> Message the desk
        </a>
      </aside>
    </div>
  );
}
