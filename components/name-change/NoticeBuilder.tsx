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

export type NameChangeBooking = {
  city: string;
  papers: Newspaper[];
  label: string;
  unit: string;
  rate?: number;
  mrp?: number;
};

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

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

type Gender = "male" | "female";
type GuardianKind = "father" | "mother" | "husband";
type AgeGroup = "adult" | "minor";
type Lang = "english" | "hindi";

const SAMPLE = {
  oldName: "Sagar Singh",
  newName: "Sagar Singh Bisht",
  guardian: "Raghuvir Singh",
  address: "Your locality, City - Pincode",
};

const inputClass =
  "w-full rounded-lg border border-line bg-white px-3 py-2.5 text-base text-ink outline-none transition placeholder:text-charcoal/80 focus:border-maroon/60 focus:ring-2 focus:ring-maroon/20 sm:text-sm";

function relationLabel(gender: Gender, kind: GuardianKind, lang: Lang) {
  if (kind === "husband") {
    return lang === "hindi" ? { short: "पत्नी", phrase: "पत्नी" } : { short: "W/o", phrase: "Wife of" };
  }
  if (gender === "female") {
    return lang === "hindi" ? { short: "पुत्री", phrase: "पुत्री" } : { short: "D/o", phrase: "Daughter of" };
  }
  return lang === "hindi" ? { short: "पुत्र", phrase: "पुत्र" } : { short: "S/o", phrase: "Son of" };
}

function guardianFieldLabel(kind: GuardianKind) {
  if (kind === "mother") return "Mother's name";
  if (kind === "husband") return "Husband's name";
  return "Father's name";
}

function childNoun(gender: Gender, lang: Lang) {
  if (gender === "female") {
    return lang === "hindi" ? "पुत्री" : "daughter";
  }
  return lang === "hindi" ? "पुत्र" : "son";
}

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

export function NoticeBuilder({
  booking,
}: {
  cities?: string[];
  booking?: NameChangeBooking;
}) {
  const [lang, setLang] = useState<Lang>("english");
  const [ageGroup, setAgeGroup] = useState<AgeGroup>("adult");
  const [gender, setGender] = useState<Gender>("male");
  const [guardianKind, setGuardianKind] = useState<GuardianKind>("father");
  const [oldName, setOldName] = useState("");
  const [guardian, setGuardian] = useState("");
  const [newName, setNewName] = useState("");
  const [address, setAddress] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [documentName, setDocumentName] = useState("");

  const [contact, setContact] = useState({ mobile: "", email: "" });
  const [fieldErrors, setFieldErrors] = useState<EnquiryFieldErrors>({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState<PaymentStatus>({ kind: "idle" });
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftKey, setDraftKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const rel = relationLabel(gender, guardianKind, lang);
  const edition = booking?.city;
  const isMinor = ageGroup === "minor";
  const pricing = booking?.rate ? calculatePricing(booking.rate) : null;
  const busy =
    status.kind === "saving" || status.kind === "paying" || status.kind === "verifying";

  const notice = useMemo(() => {
    const oldN = oldName.trim() || SAMPLE.oldName;
    const newN = newName.trim() || SAMPLE.newName;
    const addr = address.trim() || edition || SAMPLE.address;

    if (isMinor) {
      const parent = guardian.trim() || SAMPLE.guardian;
      const child = childNoun(gender, lang);

      if (lang === "hindi") {
        return `मैं, ${parent}, निवासी ${addr}, ने अपने नाबालिग ${child} का नाम ${oldN} से बदलकर ${newN} रख दिया है। सभी प्रयोजनों के लिए।`;
      }

      return `I, ${parent}, R/o ${addr}, have changed my minor ${child}'s name from ${oldN} to ${newN} for all purposes.`;
    }

    const guard = guardian.trim() || SAMPLE.guardian;

    if (lang === "hindi") {
      return `मैं, ${oldN}, ${rel.short} ${guard}, निवासी ${addr}, ने अपना नाम बदलकर ${newN} रख लिया है। सभी प्रयोजनों के लिए।`;
    }

    return `I, ${oldN}, ${rel.short} ${guard}, R/o ${addr}, have changed my name to ${newN} for all purposes.`;
  }, [
    lang,
    isMinor,
    rel.short,
    gender,
    oldName,
    guardian,
    newName,
    address,
    edition,
  ]);

  const words = notice.trim().split(/\s+/).length;

  function setGenderAndKind(next: Gender) {
    setGender(next);
    if (next === "male" && guardianKind === "husband") setGuardianKind("father");
  }

  async function copyNotice() {
    try {
      await navigator.clipboard.writeText(notice);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  async function submit() {
    setError("");

    if (!oldName.trim() || !newName.trim() || !address.trim()) {
      setError("Please fill the old name, new name and address.");
      return;
    }

    if (!guardian.trim()) {
      setError(
        isMinor
          ? "Please fill the father's or mother's name."
          : "Please fill the father's, mother's or husband's name.",
      );
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

    const details = {
      oldName: oldName.trim(),
      guardian: guardian.trim(),
      newName: newName.trim(),
      address: address.trim(),
      releaseDate,
    };

    const relationLine = isMinor
      ? `${guardianFieldLabel(guardianKind)}: ${details.guardian}`
      : `Relation: ${rel.short} ${details.guardian} (${guardianFieldLabel(guardianKind)})`;

    const message = [
      "Change of Name request",
      "",
      booking ? `City: ${booking.city}` : "",
      booking ? `Selected paper: ${booking.label}` : "",
      booking ? `Package: ${booking.unit}` : "",
      booking?.rate
        ? `Package rate: ${inr(booking.rate)}`
        : "",
      pricing ? `GST (5%): ${formatInr(pricing.gstPaise)}` : "",
      pricing ? `Convenience fee (2.5% on rate + GST): ${formatInr(pricing.conveniencePaise)}` : "",
      pricing ? `Total payable: ${formatInr(pricing.totalPaise)}` : "",
      isMinor ? "Age group: Below 18 years" : "Age group: Above 18 years",
      isMinor ? `Child's old name: ${details.oldName}` : `Old name: ${details.oldName}`,
      isMinor ? `Child's new name: ${details.newName}` : `New name: ${details.newName}`,
      `Gender: ${gender === "female" ? "Female" : "Male"}`,
      relationLine,
      `Address: ${details.address}`,
      `Release date: ${details.releaseDate}`,
      `Language: ${lang === "hindi" ? "Hindi" : "English"}`,
      documentName ? `Attached document name: ${documentName}` : "",
      "",
      "Draft notice:",
      notice,
    ]
      .filter((line) => line !== "")
      .join("\n");

    const payload = {
      name: isMinor ? details.guardian : details.oldName,
      mobile: contact.mobile,
      email: contact.email,
      message,
      category: "Change of Name",
      source: "category" as const,
    };

    const parsed = parseEnquiry(payload);
    if (!parsed.ok) {
      setFieldErrors(parsed.fields);
      setError(parsed.error);
      return;
    }

    if (!booking?.rate) {
      setError("Online payment is not available for this package. Please call the desk.");
      return;
    }

    const { name: customerName, mobile, email } = parsed.data;
    const currentDraftKey = `${mobile}|${email}|${message}`;

    setFieldErrors({});
    setError("");
    setStatus({ kind: "saving" });

    try {
      let activeDraftId = draftId;

      // Step 1: save the draft in the admin panel before any payment. The admin is
      // emailed immediately with "payment pending" and again after payment succeeds.
      if (!activeDraftId || draftKey !== currentDraftKey) {
        const { ok, data } = await postEnquiry({
          name: customerName,
          mobile,
          email,
          message,
          category: "Change of Name",
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

      // Step 2: take payment for the selected package (base + GST + convenience fee).
      setStatus({ kind: "paying" });

      const orderRes = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: customerName,
          email,
          phone: mobile,
          city: booking.city,
          papers: booking.papers.map((paper) => paper.slug),
          purpose: booking.label,
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
        description: booking.label,
        prefill: {
          name: customerName,
          email,
          contact: mobile,
        },
        notes: {
          city: booking.city,
          papers: booking.label,
        },
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
      <div id="compose-fields" className="min-w-0 scroll-mt-24">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">Compose your advertisement</h2>

        <div className="mt-6 space-y-4">
          <fieldset>
            <legend className="mb-1.5 text-[15px] font-bold text-ink">
              Advertisement for <span className="text-maroon">*</span>
            </legend>
            <div className="flex flex-wrap gap-5 text-sm text-ink">
              <Radio
                checked={ageGroup === "adult"}
                onChange={() => setAgeGroup("adult")}
                label="Above 18 Years"
              />
              <Radio
                checked={ageGroup === "minor"}
                onChange={() => {
                  setAgeGroup("minor");
                  if (guardianKind === "husband") setGuardianKind("father");
                }}
                label="Below 18 Years"
              />
            </div>
            <p className="mt-1.5 text-[13px] text-charcoal">
              {isMinor
                ? "Notice will be published by the father or mother."
                : "Notice will be published in the person's own name."}
            </p>
          </fieldset>

          <Field label={isMinor ? "Child's old name" : "Old name"} required>
            <input
              value={oldName}
              onChange={(e) => setOldName(e.target.value)}
              placeholder={SAMPLE.oldName}
              maxLength={80}
              className={inputClass}
            />
          </Field>
          <Field label={isMinor ? "Child's new name" : "New name"} required>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={SAMPLE.newName}
              maxLength={80}
              className={inputClass}
            />
          </Field>

          <fieldset>
            <legend className="mb-1.5 text-[15px] font-bold text-ink">
              {isMinor ? "Child's gender" : "Gender"} <span className="text-maroon">*</span>
            </legend>
            <div className="flex flex-wrap gap-5 text-sm text-ink">
              <Radio checked={gender === "male"} onChange={() => setGenderAndKind("male")} label="Male" />
              <Radio checked={gender === "female"} onChange={() => setGenderAndKind("female")} label="Female" />
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1.5 text-[15px] font-bold text-ink">
              Relation <span className="text-maroon">*</span>
            </legend>
            <div className="flex flex-wrap gap-5 text-sm text-ink">
              <Radio
                checked={guardianKind === "father"}
                onChange={() => setGuardianKind("father")}
                label="Father's name"
              />
              <Radio
                checked={guardianKind === "mother"}
                onChange={() => setGuardianKind("mother")}
                label="Mother's name"
              />
              {isMinor ? null : (
                <Radio
                  checked={guardianKind === "husband"}
                  onChange={() => setGuardianKind("husband")}
                  label="Husband's name"
                  disabled={gender === "male"}
                />
              )}
            </div>
            <input
              value={guardian}
              onChange={(e) => setGuardian(e.target.value)}
              placeholder={SAMPLE.guardian}
              maxLength={80}
              aria-label={guardianFieldLabel(guardianKind)}
              className={`${inputClass} mt-3`}
            />
          </fieldset>

          <Field label="Address" required>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={booking?.city || SAMPLE.address}
              maxLength={200}
              rows={4}
              className={`${inputClass} resize-y`}
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

          <Field label="Release Date / (प्रकाशन की तारीख)" required>
            <input
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              type="date"
              min={todayValue()}
              onBlur={(e) => setReleaseDate(e.target.value)}
              className={inputClass}
            />
          </Field>
          <p className="text-[13px] leading-relaxed text-charcoal">
            (Next Day Booking is accepted till 5:00 PM)
          </p>

          <Field label="Upload any document (Affidavit, PAN, Aadhaar etc)">
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              onChange={(e) => setDocumentName(e.target.files?.[0]?.name ?? "")}
              className="block w-full text-sm text-charcoal file:mr-3 file:border file:border-line file:bg-paper-2 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink"
            />
            {documentName ? (
              <p className="mt-1.5 text-[13px] text-charcoal">Selected: {documentName}</p>
            ) : (
              <p className="mt-1.5 text-[13px] text-charcoal">
                Optional. You can also send it later on WhatsApp.
              </p>
            )}
          </Field>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-charcoal">
          For urgent bookings, call {SITE.phone}. We may be able to book an earlier date.
        </p>

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
            <h2 className="font-display text-2xl text-ink sm:text-[28px]">
              Ads Preview &amp; Payment Details
            </h2>
          </div>

          <div className="px-5 py-5 sm:px-6">
            <div className="border border-maroon/30 bg-paper-2/40 px-4 py-4 text-[15px] leading-relaxed text-ink">
              {notice}
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <a
                href="#compose-fields"
                className="text-sm font-semibold text-maroon hover:underline"
              >
                Click to edit matter, if required
              </a>
              <div className="flex items-center gap-3">
                <div className="flex overflow-hidden rounded-lg border border-line bg-white">
                  {(["english", "hindi"] as const).map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setLang(value)}
                      className={`px-3 py-1 text-xs font-semibold transition ${
                        lang === value ? "bg-maroon text-white" : "text-charcoal hover:text-maroon"
                      }`}
                    >
                      {value === "english" ? "English" : "हिन्दी"}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => void copyNotice()}
                  className="text-xs font-semibold text-maroon hover:underline"
                >
                  {copied ? "Copied" : "Copy text"}
                </button>
              </div>
            </div>
            <p className="mt-1 text-[11px] text-charcoal">
              {words} words · updates as you type
            </p>

            <dl className="mt-5 text-sm">
              <SummaryRow label="Date of Release" value={formatDate(releaseDate)} />
              <SummaryRow label="Name" value={newName.trim() || oldName.trim() || "—"} />
              <SummaryRow label="Email" value={contact.email || "—"} />
              <SummaryRow label="Phone No." value={contact.mobile || "—"} />
              {pricing ? (
                <>
                  <SummaryRow label="Amount" value={formatInr(pricing.basePaise)} />
                  <SummaryRow label="GST (5%)" value={formatInr(pricing.gstPaise)} />
                  <SummaryRow
                    label="Convenience Fee @2.5%"
                    value={formatInr(pricing.conveniencePaise)}
                  />
                </>
              ) : null}
            </dl>

            {pricing ? (
              <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-3">
                <span className="font-display text-lg font-semibold text-ink">Total Amount</span>
                <span className="font-display text-2xl font-semibold text-maroon">
                  {formatInr(pricing.totalPaise)}
                </span>
              </div>
            ) : null}

            {status.kind === "saving" ? (
              <p
                role="status"
                className="mt-4 rounded-lg border border-line bg-paper-2/60 px-4 py-2.5 text-sm text-charcoal"
              >
                Saving your draft in the admin panel…
              </p>
            ) : null}

            {status.kind === "paying" ? (
              <p
                role="status"
                className="mt-4 rounded-lg border border-line bg-paper-2/60 px-4 py-2.5 text-sm text-charcoal"
              >
                Draft saved. Opening the payment window…
              </p>
            ) : null}

            {status.kind === "verifying" ? (
              <p
                role="status"
                className="mt-4 rounded-lg border border-line bg-paper-2/60 px-4 py-2.5 text-sm text-charcoal"
              >
                Payment received. Verifying… please do not close this page.
              </p>
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
                  {pricing ? `${formatInr(pricing.totalPaise)} paid` : "Payment received"}. Payment
                  ID: <span className="font-semibold text-ink">{status.paymentId}</span>
                </p>
                <p className="mt-2 text-sm text-charcoal">
                  {status.emailSent
                    ? `Payment confirmation sent to ${contact.email}.`
                    : status.warning ||
                      "Payment confirmed, but the confirmation email could not be sent."}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-charcoal">
                  {status.adminNotified || status.savedInbox
                    ? "Our desk has received your details and will confirm the wording, paper, and publishing date on WhatsApp."
                    : "Please contact the desk with your payment ID so we can process your booking."}
                </p>
              </div>
            ) : pricing ? (
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
                  Your draft is saved before payment. Total includes 5% GST and a 2.5% convenience
                  fee on rate + GST.
                </p>
              </div>
            ) : (
              <div className="mt-5 border border-line bg-paper-2/40 p-4 text-center">
                <p className="text-sm text-charcoal">
                  Online payment is not available for this package. Please call{" "}
                  <a
                    href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                    className="font-semibold text-maroon"
                  >
                    {SITE.phone}
                  </a>{" "}
                  to book.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>

      <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
        {booking ? (
          <div className="border border-maroon/40 bg-white p-5">
            <h2 className="font-display text-xl text-ink">Your Selected Paper</h2>
            <div className="mt-3 space-y-2 text-sm">
              <p className="text-ink">
                <span className="font-semibold">Paper Name:</span> {booking.label}
              </p>
              <p className="text-ink">
                <span className="font-semibold">Edition:</span> {booking.city}
              </p>
              {pricing ? (
                <p className="text-ink">
                  <span className="font-semibold">Price:</span> {formatInr(pricing.basePaise)} /{" "}
                  {booking.unit}
                </p>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-line pt-3">
              {booking.papers.map((paper) => (
                <span key={paper.slug} className="inline-flex h-8 items-center">
                  <NewspaperLogo paper={paper} />
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <div className="border border-line bg-white p-5">
          <h2 className="font-display text-xl text-ink">Contact Us</h2>
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-2.5 last:border-b-0">
      <dt className="text-charcoal">{label}</dt>
      <dd className="max-w-[65%] text-right font-medium text-ink break-words">{value}</dd>
    </div>
  );
}

function Radio({
  checked,
  onChange,
  label,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  disabled?: boolean;
}) {
  return (
    <label className={`inline-flex items-center gap-2 ${disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}>
      <input
        type="radio"
        checked={checked}
        disabled={disabled}
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
      <span className="mb-1.5 block font-bold text-[15px] text-ink">
        {label}
        {required ? <span className="text-maroon"> *</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-xs font-semibold text-maroon">{error}</span> : null}
    </label>
  );
}
