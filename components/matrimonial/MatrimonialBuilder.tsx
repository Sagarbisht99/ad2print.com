"use client";

import { useMemo, useState } from "react";
import { NewspaperLogo } from "@/components/NewspaperWall";
import type { Newspaper } from "@/lib/data";
import { postEnquiry } from "@/lib/enquiry-api";
import { parseEnquiry, type EnquiryFieldErrors } from "@/lib/enquiry-schema";
import {
  calculateMatrimonialRate,
  MATRIMONIAL_ADDONS,
  MATRIMONIAL_SCHEMES,
  MATRIMONIAL_SCHEME_IDS,
  type MatrimonialAddOnId,
  type MatrimonialSchemeId,
} from "@/lib/matrimonial-pricing";
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

const SAMPLES = [
  {
    id: "bride-1",
    label: "Sample 1: Looking for Bride",
    text: `SM4 (Location) based h'some boy, 5'5"/80, B.Tech, Private Job, seeks B'ful Edu. Girl, Caste No Bar. Call (Number).`,
  },
  {
    id: "bride-2",
    label: "Sample 2: Looking for Bride",
    text: `Alliance invited for a 29-year-old, 5'6" tall, MBA graduate working as a marketing manager in a reputed company. Belongs to a well-educated family. Caste no bar. Contact: 98XXXXXXXX.`,
  },
  {
    id: "bride-3",
    label: "Sample 3: Looking for Bride",
    text: `Alliance invited for a 30-year-old groom, 5'8", B.Tech + MBA, working in a reputed MNC in Delhi NCR. Family: business class, well-educated. Seeks a fair, educated and understanding bride. Caste no bar. Contact: 98XXXXXXXX.`,
  },
  {
    id: "groom-1",
    label: "Sample 4: Looking for Groom",
    text: `SM4 (Location) based beautiful girl, 5'4"/28, M.A., Teacher, seeks well-educated boy from a decent family. Caste no bar. Call (Number).`,
  },
  {
    id: "groom-2",
    label: "Sample 5: Looking for Groom",
    text: `Alliance invited for a 27-year-old bride, 5'5" tall, B.Ed. graduate working as a school teacher in Delhi. Belongs to a well-educated family. Seeks a settled, educated groom. Caste no bar. Contact: 98XXXXXXXX.`,
  },
  {
    id: "groom-3",
    label: "Sample 6: Looking for Groom",
    text: `Alliance invited for a 26-year-old bride, 5'4", M.Com, working as an accountant in a reputed firm. Family: respectable and well-educated. Seeks a caring, well-settled groom. Caste no bar. Contact: 98XXXXXXXX.`,
  },
  {
    id: "divorce-1",
    label: "Sample 7: Divorce",
    text: `Divorcee, 34 years, 5'6", MBA, working professional, no children, seeks a well-educated and understanding life partner. Caste no bar. Contact: 98XXXXXXXX.`,
  },
  {
    id: "divorcee-1",
    label: "Sample 8: Divorcee",
    text: `Alliance invited for a divorcee groom, 38 years, 5'9", B.Tech, settled in Delhi, previously married (no children), seeks a suitable educated bride. Caste no bar. Contact: 98XXXXXXXX.`,
  },
  {
    id: "divorcee-2",
    label: "Sample 9: Divorcee",
    text: `Divorcee bride, 31 years, 5'4", M.Com, teacher, seeking a mature and understanding groom from a respectable family. Caste no bar. Contact: 98XXXXXXXX.`,
  },
];

const BACKGROUNDS = [
  { id: "none", label: "White", value: "#ffffff" },
  { id: "pink", label: "Pink", value: "#FCE7EA" },
  { id: "blue", label: "Blue", value: "#DCEBFA" },
  { id: "yellow", label: "Yellow", value: "#FFF3C4" },
] as const;

type BackgroundId = (typeof BACKGROUNDS)[number]["id"];

const COMMUNITIES = [
  "No bar",
  "Brahmin",
  "Kayastha",
  "Rajput",
  "Jat",
  "Agarwal",
  "Maratha",
  "Punjabi",
  "Sikh",
  "Muslim",
  "Christian",
  "Other",
];

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

function percent(value: number) {
  return `${Math.round(value * 100)}%`;
}

export function MatrimonialBuilder({ booking }: { booking: MatrimonialBooking }) {
  const [adFor, setAdFor] = useState<AdFor>("bride");
  const [community, setCommunity] = useState(COMMUNITIES[0]);
  const [scheme, setScheme] = useState<MatrimonialSchemeId>("none");
  const [content, setContent] = useState("");
  const [sampleId, setSampleId] = useState("");
  const [background, setBackground] = useState<BackgroundId>("none");
  const [border, setBorder] = useState(false);
  const [tick, setTick] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState({ mobile: "", email: "" });
  const [releaseDate, setReleaseDate] = useState("");

  const [fieldErrors, setFieldErrors] = useState<EnquiryFieldErrors>({});
  const [error, setError] = useState("");
  const [status, setStatus] = useState<PaymentStatus>({ kind: "idle" });
  const [draftId, setDraftId] = useState<string | null>(null);
  const [draftKey, setDraftKey] = useState<string | null>(null);

  const addonIds = useMemo<MatrimonialAddOnId[]>(() => {
    const ids: MatrimonialAddOnId[] = [];
    if (background !== "none") ids.push("background");
    if (border) ids.push("border");
    if (tick) ids.push("tick");
    return ids;
  }, [background, border, tick]);

  const quote = useMemo(
    () => calculateMatrimonialRate(booking.rate, content, addonIds, scheme),
    [booking.rate, content, addonIds, scheme],
  );
  const pricing = useMemo(() => calculatePricing(quote.rate), [quote.rate]);

  const busy =
    status.kind === "saving" || status.kind === "paying" || status.kind === "verifying";

  const adType = adFor === "bride" ? "Bride Wanted" : "Groom Wanted";
  const sample = SAMPLES.find((row) => row.id === sampleId);
  const backgroundValue =
    BACKGROUNDS.find((option) => option.id === background)?.value ?? "#ffffff";
  const addonSummary = addonIds
    .map((id) => `${MATRIMONIAL_ADDONS[id].label} (${percent(MATRIMONIAL_ADDONS[id].rate)})`)
    .join(" + ");

  const lineNote =
    quote.lines === 0
      ? `Up to ${quote.includedLines} lines are included in the package rate.`
      : quote.extraLines === 0
        ? `${quote.includedLines} lines included in the package rate.`
        : `${quote.extraLines} extra line${quote.extraLines === 1 ? "" : "s"} charged at 20% of the package rate each.`;

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
      `Community: ${community}`,
      `Scheme: ${quote.schemeLabel}`,
      `Ads booked: ${quote.paidAds} paid + ${quote.freeAds} free = ${quote.totalAds}`,
      `Selected package: ${booking.name}`,
      `Newspapers: ${booking.label}`,
      `Coverage: ${booking.cities}`,
      `Package: ${booking.unit}`,
      `Package rate (up to ${quote.includedLines} lines): ${formatInr(quote.baseRate * 100)}`,
      `No. of lines used: ${quote.lines} (${quote.extraLines} extra)`,
      quote.extraLines > 0
        ? `Extra lines (${quote.extraLines} × 20%): ${formatInr(quote.extraLineAmount * 100)}`
        : "",
      `Add-ons: ${addonSummary || "None"}`,
      quote.addonAmount > 0 ? `Add-on charge: ${formatInr(quote.addonAmount * 100)}` : "",
      `Per-ad rate (before scheme): ${formatInr(quote.perAdRate * 100)}`,
      `Ad rate (before tax): ${formatInr(pricing.basePaise)}`,
      `GST (5%): ${formatInr(pricing.gstPaise)}`,
      `Convenience fee (2.5% on rate + GST): ${formatInr(pricing.conveniencePaise)}`,
      `Total payable: ${formatInr(pricing.totalPaise)}`,
      `Release date: ${releaseDate}`,
      "",
      "Ad content:",
      content.trim(),
    ]
      .filter((line) => line !== "")
      .join("\n");

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
          content: content.trim(),
          addons: addonIds,
          scheme,
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
        <p className="mt-2 text-sm text-charcoal">
          The package rate covers the first {quote.includedLines} lines. Each extra line adds 20% of
          the package rate, so you pay for the wording you actually use.
        </p>

        <div className="mt-6 space-y-6">
          <section className="space-y-4">
            <Field label="Ad content" required>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={SAMPLE}
                maxLength={1000}
                rows={6}
                className={`${inputClass} resize-y`}
              />
              <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-line bg-paper-2/40 px-3 py-2">
                <span className="text-[13px] text-ink">
                  No. of lines used: <strong>{quote.lines}</strong>{" "}
                  <span className="text-charcoal">({quote.includedLines} included)</span>
                </span>
                <span className="text-[13px] font-semibold text-ink">
                  Estimated ad cost:{" "}
                  <span className="text-maroon">{formatInr(pricing.basePaise)}</span>{" "}
                  <span className="font-normal text-charcoal">before taxes</span>
                </span>
              </div>
              <span className="mt-1 block text-[12px] text-charcoal">
                {lineNote}
                {quote.addonAmount > 0
                  ? ` Wording ${formatInr(quote.wordingRate * 100)} + add-ons ${formatInr(quote.addonAmount * 100)}.`
                  : ""}
                {quote.totalAds > 1
                  ? ` Scheme ${quote.scheme} covers ${quote.totalAds} ads (${quote.paidAds} paid).`
                  : ""}
              </span>
            </Field>

            <Field label="Sample ads">
              <div className="flex flex-col gap-2 sm:flex-row">
                <select
                  value={sampleId}
                  onChange={(e) => {
                    const id = e.target.value;
                    setSampleId(id);
                    const picked = SAMPLES.find((row) => row.id === id);
                    if (picked) setContent(picked.text);
                  }}
                  className={inputClass}
                >
                  <option value="">Choose a sample wording</option>
                  {SAMPLES.map((row) => (
                    <option key={row.id} value={row.id}>
                      {row.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setContent((sample ?? SAMPLES[0]).text)}
                  className="shrink-0 rounded-lg border border-maroon px-3 py-2.5 text-xs font-bold uppercase tracking-[0.06em] text-maroon transition hover:bg-maroon hover:text-white"
                >
                  Copy &amp; paste
                </button>
              </div>
            </Field>
          </section>

          <section className="border border-line bg-white p-4 sm:p-5">
            <h3 className="font-display text-lg text-ink">
              Add-ons <span className="text-sm font-normal text-charcoal">(optional)</span>
            </h3>

            <div className="mt-4 space-y-4">
              <fieldset>
                <legend className="mb-2 text-[13px] font-bold text-ink">
                  Background colour:{" "}
                  <span className="font-normal text-maroon">20% extra</span>
                </legend>
                <div className="flex flex-wrap gap-2">
                  {BACKGROUNDS.map((option) => {
                    const selected = background === option.id;
                    return (
                      <label
                        key={option.id}
                        className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition ${
                          selected
                            ? "border-maroon bg-maroon/5 text-maroon"
                            : "border-line text-ink hover:border-maroon/40"
                        }`}
                      >
                        <input
                          type="radio"
                          name="background"
                          checked={selected}
                          onChange={() => setBackground(option.id)}
                          className="h-3.5 w-3.5 accent-maroon"
                        />
                        <span
                          aria-hidden
                          className="h-4 w-4 rounded-full border border-charcoal/20"
                          style={{ backgroundColor: option.value }}
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
                <div>
                  <p className="mb-1.5 text-[13px] font-bold text-ink">
                    Screen (border): <span className="font-normal text-maroon">12% extra</span>
                  </p>
                  <div className="flex gap-4 text-sm text-ink">
                    <Radio checked={border} onChange={() => setBorder(true)} label="Yes" />
                    <Radio checked={!border} onChange={() => setBorder(false)} label="No" />
                  </div>
                </div>

                <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tick}
                    onChange={(e) => setTick(e.target.checked)}
                    className="h-4 w-4 accent-maroon"
                  />
                  <span className="font-bold text-ink">Tick (✔)</span>
                  <span className="text-xs font-bold text-maroon">12% extra</span>
                </label>
              </div>
            </div>
          </section>

          <section>
            <h3 className="font-display text-lg text-ink">More details about your ad</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <Field label="Type" required>
                <select
                  value={adFor}
                  onChange={(e) => setAdFor(e.target.value as AdFor)}
                  className={inputClass}
                >
                  <option value="bride">Bride Wanted</option>
                  <option value="groom">Groom Wanted</option>
                </select>
              </Field>

              <Field label="Scheme">
                <select
                  value={scheme}
                  onChange={(e) => setScheme(e.target.value as MatrimonialSchemeId)}
                  className={inputClass}
                >
                  {MATRIMONIAL_SCHEME_IDS.map((id) => (
                    <option key={id} value={id}>
                      {MATRIMONIAL_SCHEMES[id].label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Category (community)" required>
                <select
                  value={community}
                  onChange={(e) => setCommunity(e.target.value)}
                  className={inputClass}
                >
                  {COMMUNITIES.map((row) => (
                    <option key={row} value={row}>
                      {row}
                    </option>
                  ))}
                </select>
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
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-charcoal">
              {scheme === "none"
                ? "One ad in this booking."
                : `${MATRIMONIAL_SCHEMES[scheme].paidAds} paid + ${MATRIMONIAL_SCHEMES[scheme].freeAds} free ads. The desk confirms the dates for the free insertions.`}
            </p>
            <p className="mt-1 text-[13px] leading-relaxed text-charcoal">
              Most matrimonial classifieds publish on Sunday.{" "}
              {releaseDate && !isSunday(releaseDate)
                ? "The date you picked is not a Sunday — the desk will confirm availability."
                : "Pick the Sunday you want the ad to appear."}
            </p>
          </section>

          <section>
            <h3 className="font-display text-lg text-ink">Your details</h3>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
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
            </div>
          </section>
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
            <div
              className="mt-2 px-4 py-4 text-[15px] leading-relaxed text-ink"
              style={{
                backgroundColor: backgroundValue,
                border: border ? "2px solid #1a1b1e" : "1px solid rgba(178,31,45,0.3)",
              }}
            >
              {content.trim() || SAMPLE}
              {tick ? <span className="ml-1 font-bold">✔</span> : null}
            </div>
            <p className="mt-1 text-[11px] text-charcoal">Preview updates as you type.</p>

            <dl className="mt-5 text-sm">
              <SummaryRow label="Package" value={booking.name} />
              <SummaryRow label="Newspapers" value={booking.label} />
              <SummaryRow label="Coverage" value={booking.cities} />
              <SummaryRow
                label="Lines used"
                value={`${quote.lines} / ${quote.includedLines} included${
                  quote.extraLines > 0 ? ` · ${quote.extraLines} extra` : ""
                }`}
              />
              <SummaryRow
                label={`Package rate (up to ${quote.includedLines} lines)`}
                value={formatInr(quote.baseRate * 100)}
              />
              {quote.extraLines > 0 ? (
                <SummaryRow
                  label={`Extra lines (${quote.extraLines} × 20%)`}
                  value={formatInr(quote.extraLineAmount * 100)}
                />
              ) : null}
              {quote.addons.length > 0 ? (
                <SummaryRow
                  label={`Add-ons (${percent(quote.addonPercent)})`}
                  value={formatInr(quote.addonAmount * 100)}
                />
              ) : null}
              <SummaryRow label="Scheme" value={quote.schemeLabel} />
              <SummaryRow label="Per-ad amount" value={formatInr(quote.perAdRate * 100)} />
              {quote.totalAds > 1 ? (
                <SummaryRow
                  label={`Scheme ads (${quote.paidAds} paid + ${quote.freeAds} free)`}
                  value={`${quote.totalAds} ads`}
                />
              ) : null}
              <SummaryRow label="Ad amount" value={formatInr(pricing.basePaise)} />
              <SummaryRow label="Release date" value={formatDate(releaseDate)} />
              <SummaryRow label="Name" value={name.trim() || "—"} />
              <SummaryRow label="Email" value={contact.email || "—"} />
              <SummaryRow label="Phone" value={contact.mobile || "—"} />
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
              <span className="font-semibold">Scheme:</span> {quote.schemeLabel}
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
          <h2 className="font-display text-xl text-ink">Wording pricing</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-charcoal">
            <li>
              <span className="font-semibold text-ink">Up to {quote.includedLines} lines:</span>{" "}
              package rate
            </li>
            <li>
              <span className="font-semibold text-ink">Each extra line:</span> +20% of the package
              rate
            </li>
            <li>
              <span className="font-semibold text-ink">Add-ons:</span> background 20%, border 12%,
              tick 12%
            </li>
            <li>
              <span className="font-semibold text-ink">Schemes:</span> 2+2 and 3+3 — pay for 2 or 3
              ads and get the same number free
            </li>
          </ul>
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
