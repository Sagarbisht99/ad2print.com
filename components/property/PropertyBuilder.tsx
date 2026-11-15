"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FaCheckCircle,
  FaLock,
  FaPhoneAlt,
  FaSpinner,
  FaWhatsapp,
} from "react-icons/fa";
import { NewspaperLogo } from "@/components/NewspaperWall";
import {
  calculateLineQuote,
  countMatrimonialLines,
  wrapMatrimonialLines,
} from "@/lib/matrimonial-pricing";
import { calculatePricing, formatInr } from "@/lib/pricing";
import type { Newspaper } from "@/lib/data";
import {
  openRazorpayCheckout,
  PaymentCancelledError,
  type RazorpayPaymentResponse,
} from "@/lib/razorpay-client";
import { SITE } from "@/lib/site";

export type PropertyBooking = {
  id: string;
  name: string;
  label: string;
  cities: string;
  unit: string;
  unitNote: string;
  rate: number;
  unitType: "lines" | "words";
  includedLines: number;
  papers: Newspaper[];
};

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base text-ink outline-none transition placeholder:text-charcoal/70 focus:border-maroon/60 focus:ring-2 focus:ring-maroon/20 sm:text-sm";

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function PropertyBuilder({ booking }: { booking: PropertyBooking }) {
  const [company, setCompany] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [publicationDate, setPublicationDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<{ orderId: string; paymentId: string; totalPaise: number } | null>(null);

  const lineQuote = useMemo(
    () =>
      booking.unitType === "lines"
        ? calculateLineQuote(booking.rate, content, booking.includedLines)
        : null,
    [booking.unitType, booking.rate, booking.includedLines, content],
  );

  const wordingRate = lineQuote?.rate ?? booking.rate;
  const pricing = calculatePricing(wordingRate);
  const wrapped = wrapMatrimonialLines(content);
  const lines = countMatrimonialLines(content);

  function validate() {
    const errors: Record<string, string> = {};
    if (company.trim().length < 2) errors.company = "Enter your company / organisation.";
    if (name.trim().length < 2) errors.name = "Enter the contact person's name.";
    const digits = mobile.replace(/\D/g, "").slice(-10);
    if (!/^[6-9]\d{9}$/.test(digits)) errors.mobile = "Enter a valid 10-digit mobile number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) errors.email = "Enter a valid email.";
    if (content.trim().length < 10) errors.content = "Please write the ad wording (min. 10 characters).";
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
          service: "property",
          city: "Delhi",
          papers: booking.papers.map((paper) => paper.slug),
          packageId: booking.id,
          purpose: company.trim(),
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
        description: `Property ad — ${booking.label}`,
        prefill: { name: name.trim(), email: email.trim(), contact: mobile.replace(/\D/g, "").slice(-10) },
        notes: {
          purpose: `Property booking · ${company.trim()}`,
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
            "Property ad booking on AD2PRINT",
            "",
            `Company: ${company.trim()}`,
            `Contact person: ${name.trim()}`,
            `Papers: ${booking.label}`,
            publicationDate ? `Publication date requested: ${publicationDate}` : "",
            "",
            `Ad wording:\n${content.trim()}`,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
      const verified = await verifyRes.json().catch(() => ({}));
      if (!verifyRes.ok) {
        throw new Error(verified?.error || "Payment received but verification failed. Please call the desk.");
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
        setError(err instanceof Error ? err.message : "Something went wrong. Please try again or call the desk.");
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
        <h1 className="mt-5 font-display text-3xl text-ink">Booking received</h1>
        <p className="mt-3 text-sm leading-relaxed text-charcoal">
          Payment received and your property ad is in the booking queue. The desk will confirm the
          publication date and edition by phone or email before it prints.
        </p>
        <dl className="mx-auto mt-6 max-w-md divide-y divide-line border-y border-line text-left text-sm">
          <div className="flex items-center justify-between gap-4 py-3">
            <dt className="text-charcoal">Package</dt>
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
        <Link href="/property" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-maroon hover:underline">
          ← Back to property packages
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_21rem] xl:grid-cols-[minmax(0,1fr)_23rem]">
      <div className="border border-line bg-white">
        <div className="border-b border-line px-5 py-4 sm:px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-maroon">
            Property ad · {booking.unit}
          </p>
          <h1 className="mt-1 font-display text-xl text-ink sm:text-2xl">Compose your property ad</h1>
          <p className="mt-1.5 text-xs leading-relaxed text-charcoal">{booking.label}</p>
        </div>

        <div className="space-y-5 px-5 py-6 sm:px-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rec-company" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
                Company / Owner / Agent *
              </label>
              <input
                id="rec-company"
                value={company}
                onChange={(e) => { setCompany(e.target.value); setFieldErrors((p) => ({ ...p, company: "" })); }}
                className={`${inputClass} mt-1.5 ${fieldErrors.company ? "border-maroon" : ""}`}
                placeholder="Sharma Properties"
              />
              {fieldErrors.company ? <p className="mt-1 text-[11px] text-maroon">{fieldErrors.company}</p> : null}
            </div>
            <div>
              <label htmlFor="rec-name" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
                Contact person *
              </label>
              <input
                id="rec-name"
                value={name}
                onChange={(e) => { setName(e.target.value); setFieldErrors((p) => ({ ...p, name: "" })); }}
                className={`${inputClass} mt-1.5 ${fieldErrors.name ? "border-maroon" : ""}`}
                placeholder="Rohit Sharma"
              />
              {fieldErrors.name ? <p className="mt-1 text-[11px] text-maroon">{fieldErrors.name}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="rec-mobile" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
                Mobile *
              </label>
              <input
                id="rec-mobile"
                inputMode="numeric"
                value={mobile}
                onChange={(e) => { setMobile(e.target.value); setFieldErrors((p) => ({ ...p, mobile: "" })); }}
                className={`${inputClass} mt-1.5 ${fieldErrors.mobile ? "border-maroon" : ""}`}
                placeholder="98765 43210"
              />
              {fieldErrors.mobile ? <p className="mt-1 text-[11px] text-maroon">{fieldErrors.mobile}</p> : null}
            </div>
            <div>
              <label htmlFor="rec-email" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
                Email *
              </label>
              <input
                id="rec-email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: "" })); }}
                className={`${inputClass} mt-1.5 ${fieldErrors.email ? "border-maroon" : ""}`}
                placeholder="you@example.com"
              />
              {fieldErrors.email ? <p className="mt-1 text-[11px] text-maroon">{fieldErrors.email}</p> : null}
            </div>
          </div>

          <div>
            <label htmlFor="rec-content" className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
              Ad wording *
              <span className="font-sans text-[10px] font-medium normal-case tracking-normal text-slate">
                {booking.unitType === "lines"
                  ? `${lines} line${lines === 1 ? "" : "s"}${lineQuote && lineQuote.extraLines > 0 ? ` · ${lineQuote.extraLines} extra (×20%)` : ""}`
                  : `${content.trim() ? `${content.trim().split(/\s+/).filter(Boolean).length} words` : "0 words"}`}
              </span>
            </label>
            <textarea
              id="rec-content"
              rows={6}
              value={content}
              onChange={(e) => { setContent(e.target.value); setFieldErrors((p) => ({ ...p, content: "" })); }}
              className={`${inputClass} mt-1.5 min-h-[8rem] resize-y font-serif ${fieldErrors.content ? "border-maroon" : ""}`}
              placeholder="2 BHK flat for sale, east facing, park view, Sector 62, Noida. Price ₹68 Lakh (negotiable). Ready to move. Call 98XXX XXXXX."
            />
            {fieldErrors.content ? <p className="mt-1 text-[11px] text-maroon">{fieldErrors.content}</p> : null}
          </div>

          <div>
            <label htmlFor="rec-date" className="text-[11px] font-bold uppercase tracking-[0.08em] text-charcoal">
              Publication date <span className="font-sans font-medium normal-case tracking-normal text-slate">(optional)</span>
            </label>
            <input
              id="rec-date"
              type="date"
              value={publicationDate}
              onChange={(e) => setPublicationDate(e.target.value)}
              className={`${inputClass} mt-1.5`}
            />
          </div>

          {wrapped.length > 0 ? (
            <div className="rounded-lg border border-line bg-paper-2/40 p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate">
                Preview — as it will print (28 characters / line)
              </p>
              <div className="mt-2 space-y-0.5 font-serif text-[13px] leading-snug text-ink">
                {wrapped.map((line, i) => (
                  <p key={i} className="border-b border-line/60 pb-0.5">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          ) : null}

          {error ? (
            <p role="alert" className="rounded-lg border border-maroon/30 bg-maroon/5 px-4 py-3 text-sm text-maroon">
              {error}
            </p>
          ) : null}
        </div>
      </div>

      <aside className="h-fit border border-line bg-white p-5 lg:sticky lg:top-24">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-charcoal">
          Order summary
        </p>
        <div className="mt-3 flex items-center gap-3 border-b border-line pb-4">
          <div className="flex flex-wrap gap-1.5">
            {booking.papers.slice(0, 3).map((paper) => (
              <span key={paper.slug} className="flex h-8 w-24 items-center">
                <NewspaperLogo paper={paper} className="max-h-8 max-w-full object-contain" />
              </span>
            ))}
          </div>
        </div>

        <dl className="mt-4 space-y-2.5 text-sm">
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-charcoal">Package ({booking.unit})</dt>
            <dd className="font-semibold text-ink">{inr(booking.rate)}</dd>
          </div>
          {lineQuote && lineQuote.extraLines > 0 ? (
            <div className="flex items-baseline justify-between gap-3">
              <dt className="text-charcoal">Extra {lineQuote.extraLines} line{lineQuote.extraLines > 1 ? "s" : ""} (@20%)</dt>
              <dd className="font-semibold text-ink">+ {inr(lineQuote.extraLineAmount)}</dd>
            </div>
          ) : null}
          <div className="flex items-baseline justify-between gap-3 border-t border-line pt-2.5">
            <dt className="text-charcoal">Subtotal</dt>
            <dd className="font-semibold text-ink">{inr(wordingRate)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-charcoal">GST (5%)</dt>
            <dd className="font-semibold text-ink">{inr(Math.round((pricing.gstPaise / 100)))}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3">
            <dt className="text-charcoal">Convenience fee (2.5%)</dt>
            <dd className="font-semibold text-ink">{inr(Math.round((pricing.conveniencePaise / 100)))}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-3 border-t border-ink pt-2.5">
            <dt className="font-bold text-ink">Total payable</dt>
            <dd className="font-display text-xl font-bold text-maroon">{inr(Math.round((pricing.totalPaise / 100)))}</dd>
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
              <FaLock className="h-4 w-4" aria-hidden /> Pay {inr(Math.round((pricing.totalPaise / 100)))} securely
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
          <FaWhatsapp className="h-3.5 w-3.5" aria-hidden /> Ask about this package
        </a>
      </aside>
    </div>
  );
}
