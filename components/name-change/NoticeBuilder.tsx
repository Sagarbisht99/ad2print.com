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
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const rel = relationLabel(gender, guardianKind, lang);
  const hasDraft = Boolean(
    oldName.trim() || newName.trim() || guardian.trim() || address.trim(),
  );
  const edition = booking?.city;
  const isMinor = ageGroup === "minor";

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

  return (
    <div className="grid min-w-0 gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
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
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-ink">Preview</p>
          <p className="mt-1 text-xs text-charcoal">
            {hasDraft
              ? "Updates as you type. Final wording is confirmed by the desk."
              : "Sample preview — start typing to see your own notice."}
          </p>
          <div className="mt-3 border border-maroon/40 bg-white px-4 py-4 text-sm leading-relaxed text-ink">
            {notice}
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex border border-line bg-white rounded-xl">
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

        {booking ? (
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
        ) : null}

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
