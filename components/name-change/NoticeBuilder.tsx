"use client";

import { useMemo, useState } from "react";
import { NewspaperLogo } from "@/components/NewspaperWall";
import type { Newspaper } from "@/lib/data";
import { postEnquiry } from "@/lib/enquiry-api";
import { parseEnquiry, type EnquiryFieldErrors } from "@/lib/enquiry-schema";
import { SITE } from "@/lib/site";

export type NameChangeBooking = {
  city: string;
  papers: Newspaper[];
  label: string;
  unit: string;
};

type Gender = "male" | "female";
type GuardianKind = "father" | "mother" | "husband";
type Lang = "english" | "hindi";

const SAMPLE = {
  oldName: "Rajesh Kumar",
  newName: "Rajesh Singh",
  guardian: "Suresh Kumar",
  address: "Delhi",
};

const inputClass =
  "w-full border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-maroon/60 focus:ring-2 focus:ring-maroon/20";

function formatDate(value: string) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return "";
  return `${d}.${m}.${y}`;
}

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

export function NoticeBuilder({
  cities,
  booking,
}: {
  cities: string[];
  booking?: NameChangeBooking;
}) {
  const [lang, setLang] = useState<Lang>("english");
  const [gender, setGender] = useState<Gender>("male");
  const [guardianKind, setGuardianKind] = useState<GuardianKind>("father");
  const [oldName, setOldName] = useState("");
  const [guardian, setGuardian] = useState("");
  const [newName, setNewName] = useState("");
  const [address, setAddress] = useState("");
  const [affidavit, setAffidavit] = useState("");
  const [place, setPlace] = useState("");
  const [city, setCity] = useState(booking?.city ?? "");
  const [forMinor, setForMinor] = useState(false);
  const [documentName, setDocumentName] = useState("");

  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState({ name: "", mobile: "", email: "" });
  const [fieldErrors, setFieldErrors] = useState<EnquiryFieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const rel = relationLabel(gender, guardianKind, lang);
  const hasDraft = Boolean(oldName.trim() || newName.trim() || guardian.trim() || address.trim());

  const notice = useMemo(() => {
    const oldN = oldName.trim() || SAMPLE.oldName;
    const guard = guardian.trim() || SAMPLE.guardian;
    const newN = newName.trim() || SAMPLE.newName;
    const addr = address.trim() || booking?.city || SAMPLE.address;
    const date = formatDate(affidavit);
    const notary = place.trim() || booking?.city || SAMPLE.address;

    if (lang === "hindi") {
      const dateBit = date
        ? ` शपथ पत्र दिनांक ${date}${notary ? `, नोटरी ${notary} के समक्ष` : ""}।`
        : " सभी प्रयोजनों के लिए।";
      return `मैं, ${oldN}, ${rel.short} ${guard}, निवासी ${addr}, ने अपना नाम बदलकर ${newN} रख लिया है।${dateBit}`;
    }

    const dateBit = date
      ? ` vide affidavit dated ${date}${notary ? ` sworn before Notary, ${notary}` : ""}`
      : " for all purposes";
    return `I, ${oldN}, ${rel.short} ${guard}, R/o ${addr}, have changed my name to ${newN}${dateBit}.`;
  }, [
    lang,
    rel.short,
    oldName,
    guardian,
    newName,
    address,
    affidavit,
    place,
    booking?.city,
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

    if (booking) {
      if (!oldName.trim() || !newName.trim() || !guardian.trim() || !address.trim()) {
        setError("Please fill old name, new name, relation name and address.");
        return;
      }
    }

    const details = {
      oldName: oldName.trim(),
      guardian: guardian.trim(),
      newName: newName.trim(),
      address: address.trim(),
      place: place.trim() || booking?.city || "",
      date: formatDate(affidavit),
    };

    const message = [
      "Name change notice request",
      "",
      booking ? `City: ${booking.city}` : "",
      booking ? `Selected paper: ${booking.label}` : "",
      booking ? `Package: ${booking.unit}` : "",
      `Old name: ${details.oldName}`,
      `New name: ${details.newName}`,
      `Gender: ${gender === "female" ? "Female" : "Male"}`,
      `Relation: ${rel.short} ${details.guardian} (${guardianFieldLabel(guardianKind)})`,
      `Address: ${details.address}`,
      details.date ? `Release / affidavit date: ${details.date}` : "",
      details.place ? `Notary place: ${details.place}` : "",
      `Language: ${lang === "hindi" ? "Hindi" : "English"}`,
      !booking && city ? `Preferred edition: ${city}` : "",
      forMinor ? "Booking for a minor (below 18 years)" : "",
      documentName ? `Attached document name: ${documentName}` : "",
      "",
      "Draft notice:",
      notice,
    ]
      .filter((line) => line !== "")
      .join("\n");

    const payload = {
      name: booking ? oldName.trim() : contact.name,
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

    setFieldErrors({});
    setLoading(true);
    try {
      const { ok, data } = await postEnquiry(payload);
      if (!ok) {
        setFieldErrors(data.fields ?? {});
        setError(data.error || "Could not send. Please try again.");
        return;
      }
      setSent(true);
    } catch {
      setError("Could not send. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (booking) {
    return (
      <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Compose your advertisement</h2>

          <div className="mt-6 space-y-4">
            <Field label="Old name" required>
              <input
                value={oldName}
                onChange={(e) => setOldName(e.target.value)}
                placeholder={SAMPLE.oldName}
                maxLength={80}
                className={inputClass}
              />
            </Field>
            <Field label="New name" required>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={SAMPLE.newName}
                maxLength={80}
                className={inputClass}
              />
            </Field>

            <fieldset>
              <legend className="mb-1.5 text-sm font-semibold text-ink">
                Gender <span className="text-maroon">*</span>
              </legend>
              <div className="flex flex-wrap gap-5 text-sm text-ink">
                <Radio checked={gender === "male"} onChange={() => setGenderAndKind("male")} label="Male" />
                <Radio checked={gender === "female"} onChange={() => setGenderAndKind("female")} label="Female" />
              </div>
            </fieldset>

            <fieldset>
              <legend className="sr-only">Relation</legend>
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
                <Radio
                  checked={guardianKind === "husband"}
                  onChange={() => setGuardianKind("husband")}
                  label="Husband's name"
                  disabled={gender === "male"}
                />
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
                placeholder={booking.city || SAMPLE.address}
                maxLength={200}
                rows={4}
                className={`${inputClass} resize-y`}
              />
            </Field>

            <Field label="Release date (प्रकाशन की तारीख)" required>
              <input
                type="date"
                value={affidavit}
                onChange={(e) => setAffidavit(e.target.value)}
                className={inputClass}
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

            <Field label="Upload any document (affidavit, PAN, Aadhaar, etc)">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.webp"
                onChange={(e) => setDocumentName(e.target.files?.[0]?.name ?? "")}
                className="block w-full text-sm text-charcoal file:mr-3 file:border file:border-line file:bg-paper-2 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-ink"
              />
              {documentName ? (
                <p className="mt-1.5 text-xs text-charcoal">Selected: {documentName}</p>
              ) : (
                <p className="mt-1.5 text-xs text-charcoal">
                  Optional. The desk can also collect this on WhatsApp.
                </p>
              )}
            </Field>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-charcoal">
            For urgent bookings, call {SITE.phone}. We may be able to book an earlier date.
          </p>

          <label className="mt-4 flex items-start gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={forMinor}
              onChange={(e) => setForMinor(e.target.checked)}
              className="mt-0.5 h-4 w-4 accent-maroon"
            />
            <span>Please select if booking an ad for a minor child (below 18 years)</span>
          </label>

          {error ? <p className="mt-4 text-sm text-maroon">{error}</p> : null}

          {sent ? (
            <div className="mt-6 border border-maroon/30 bg-white p-6 text-center">
              <p className="font-display text-xl text-maroon">Draft received</p>
              <p className="mt-2 text-sm text-charcoal">
                Our desk will confirm the wording, paper, and publishing date on WhatsApp.
              </p>
            </div>
          ) : (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                disabled={loading}
                onClick={() => void submit()}
                className="btn-primary w-full sm:w-auto disabled:opacity-60"
              >
                {loading ? "Sending…" : "Proceed to book ad →"}
              </button>
            </div>
          )}
        </div>

        <aside className="min-w-0 space-y-5 lg:sticky lg:top-24 lg:self-start">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-ink">
              Preview
            </p>
            <p className="mt-1 text-xs text-charcoal">
              {hasDraft
                ? "Updates as you type. Final wording is confirmed by the desk."
                : "Sample preview — start typing to see your own notice."}
            </p>
            <div className="mt-3 border border-maroon/40 bg-white px-4 py-4 text-sm leading-relaxed text-ink">
              {notice}
            </div>
            <div className="mt-2 flex items-center justify-between gap-3">
              <div className="flex border border-line bg-white">
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
              <button type="button" onClick={() => void copyNotice()} className="text-xs font-semibold text-maroon hover:underline">
                {copied ? "Copied" : "Copy text"}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-charcoal">{words} words</p>
          </div>

          <div className="border border-maroon/40 bg-white p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-ink">
              Your selected paper
            </p>
            <p className="mt-3 text-sm text-ink">
              <span className="font-semibold">Paper name:</span> {booking.label}
            </p>
            <p className="mt-1 text-sm text-ink">
              <span className="font-semibold">Package:</span> {booking.unit}
            </p>
            <p className="mt-1 text-sm text-ink">
              <span className="font-semibold">Edition:</span> {booking.city}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              {booking.papers.map((paper) => (
                <span key={paper.slug} className="inline-flex h-8 items-center">
                  <NewspaperLogo paper={paper} />
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-ink">Contact us</p>
            <p className="mt-2 text-sm text-ink">
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
          </div>
        </aside>
      </div>
    );
  }

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[1fr_0.95fr] lg:gap-10">
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-charcoal">
            Notice language
          </span>
          <div className="flex border border-line bg-white">
            {(["english", "hindi"] as const).map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setLang(value)}
                className={`px-4 py-1.5 text-sm font-semibold transition ${
                  lang === value ? "bg-maroon text-white" : "text-charcoal hover:text-maroon"
                }`}
              >
                {value === "english" ? "English" : "हिन्दी"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block text-sm sm:col-span-2">
            <span className="mb-1.5 block font-semibold text-ink">Relation</span>
            <div className="flex flex-wrap gap-5 text-sm text-ink">
              <Radio checked={gender === "male"} onChange={() => setGenderAndKind("male")} label="Male" />
              <Radio checked={gender === "female"} onChange={() => setGenderAndKind("female")} label="Female" />
            </div>
            <div className="mt-3 flex flex-wrap gap-5 text-sm text-ink">
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
              <Radio
                checked={guardianKind === "husband"}
                onChange={() => setGuardianKind("husband")}
                label="Husband's name"
                disabled={gender === "male"}
              />
            </div>
          </label>

          <Field label="Old name (as in records)">
            <input
              value={oldName}
              onChange={(e) => setOldName(e.target.value)}
              placeholder={SAMPLE.oldName}
              maxLength={80}
              className={inputClass}
            />
          </Field>
          <Field label="New name">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder={SAMPLE.newName}
              maxLength={80}
              className={inputClass}
            />
          </Field>
          <Field label={guardianFieldLabel(guardianKind)}>
            <input
              value={guardian}
              onChange={(e) => setGuardian(e.target.value)}
              placeholder={SAMPLE.guardian}
              maxLength={80}
              className={inputClass}
            />
          </Field>
          <Field label="Address in the notice">
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder={SAMPLE.address}
              maxLength={120}
              className={inputClass}
            />
          </Field>
          <Field label="Affidavit date">
            <input type="date" value={affidavit} onChange={(e) => setAffidavit(e.target.value)} className={inputClass} />
          </Field>
          <Field label="Notary place">
            <input value={place} onChange={(e) => setPlace(e.target.value)} maxLength={80} className={inputClass} />
          </Field>
          <Field label="Preferred edition (optional)">
            <select value={city} onChange={(e) => setCity(e.target.value)} className={inputClass}>
              <option value="">Let the desk suggest</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <p className="mt-4 text-xs leading-relaxed text-charcoal">
          Nothing is submitted while you type. The preview updates live so you can check spellings
          before the notice goes to print.
        </p>
      </div>

      <div className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="border border-line bg-paper-2 p-3 shadow-[0_18px_40px_rgba(26,27,30,0.07)]">
          <div className="bg-white">
            <div className="bg-maroon px-4 py-2">
              <p className="text-center text-[11px] font-bold uppercase tracking-[0.18em] text-white">
                {lang === "hindi" ? "नाम परिवर्तन" : "Change of Name"}
              </p>
            </div>
            <p
              className="px-4 py-4 text-[13.5px] leading-[1.65] text-ink"
              style={{ textAlign: "justify", fontFamily: "Georgia, 'Times New Roman', serif" }}
            >
              {notice}
            </p>
            <div className="flex items-center justify-between border-t border-dashed border-line px-4 py-2 text-[10px] uppercase tracking-[0.12em] text-charcoal">
              <span>Classified column</span>
              <span>{words} words</span>
            </div>
          </div>
        </div>

        {!hasDraft ? (
          <p className="mt-3 text-xs text-charcoal">
            Showing a sample: Rajesh Kumar to Rajesh Singh. Start typing to see yours.
          </p>
        ) : null}

        <div className="mt-5 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap">
          <button type="button" onClick={() => void copyNotice()} className="btn-ghost w-full sm:w-auto">
            {copied ? "Copied" : "Copy notice text"}
          </button>
          {!showContact && !sent ? (
            <button type="button" onClick={() => setShowContact(true)} className="btn-primary w-full sm:w-auto">
              Send draft to desk
            </button>
          ) : null}
        </div>

        {sent ? (
          <div className="mt-5 border border-maroon/30 bg-white p-6 text-center">
            <p className="font-display text-xl text-maroon">Draft received</p>
            <p className="mt-2 text-sm text-charcoal">
              Our desk will confirm the wording, paper, and publishing date on WhatsApp.
            </p>
          </div>
        ) : null}

        {showContact && !sent ? (
          <div className="mt-5 border border-line bg-white p-5">
            <p className="font-display text-lg text-ink">Where should we send the quote?</p>
            <div className="mt-4 space-y-3.5">
              <Field label="Your name" error={fieldErrors.name}>
                <input
                  value={contact.name}
                  onChange={(e) => {
                    setContact((c) => ({ ...c, name: e.target.value }));
                    setFieldErrors((f) => ({ ...f, name: undefined }));
                  }}
                  autoComplete="name"
                  maxLength={80}
                  className={`${inputClass} ${fieldErrors.name ? "border-maroon" : ""}`}
                />
              </Field>
              <Field label="Mobile" error={fieldErrors.mobile}>
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
              <Field label="Email" error={fieldErrors.email}>
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
            {error && !Object.values(fieldErrors).some(Boolean) ? (
              <p className="mt-3 text-sm text-maroon">{error}</p>
            ) : null}
            <button
              type="button"
              disabled={loading}
              onClick={() => void submit()}
              className="btn-primary mt-5 w-full disabled:opacity-60"
            >
              {loading ? "Sending…" : "Send to desk"}
            </button>
            <p className="mt-3 text-center text-xs text-charcoal">Your draft notice is attached automatically.</p>
          </div>
        ) : null}
      </div>
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
      {label}
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
      <span className="mb-1.5 block font-semibold text-ink">
        {label}
        {required ? <span className="text-maroon"> *</span> : null}
      </span>
      {children}
      {error ? <span className="mt-1.5 block text-xs text-maroon">{error}</span> : null}
    </label>
  );
}
