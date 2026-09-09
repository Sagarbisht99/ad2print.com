"use client";

import { useMemo, useState } from "react";
import { postEnquiry } from "@/lib/enquiry-api";
import { parseEnquiry, type EnquiryFieldErrors } from "@/lib/enquiry-schema";

type Relation = "son" | "daughter" | "wife";
type Lang = "english" | "hindi";

const RELATIONS: { value: Relation; label: string; short: string; hindi: string }[] = [
  { value: "son", label: "Son of", short: "S/o", hindi: "पुत्र" },
  { value: "daughter", label: "Daughter of", short: "D/o", hindi: "पुत्री" },
  { value: "wife", label: "Wife of", short: "W/o", hindi: "पत्नी" },
];

const SAMPLE = {
  oldName: "Rajesh Kumar",
  guardian: "Suresh Kumar",
  newName: "Rajesh Aswal",
  address: "Indirapuram, Ghaziabad",
  place: "Ghaziabad",
};

const inputClass =
  "w-full border border-line bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-maroon/60 focus:ring-2 focus:ring-maroon/20";

function formatDate(value: string) {
  if (!value) return "";
  const [y, m, d] = value.split("-");
  if (!y || !m || !d) return "";
  return `${d}.${m}.${y}`;
}

export function NoticeBuilder({ cities }: { cities: string[] }) {
  const [lang, setLang] = useState<Lang>("english");
  const [relation, setRelation] = useState<Relation>("son");
  const [oldName, setOldName] = useState("");
  const [guardian, setGuardian] = useState("");
  const [newName, setNewName] = useState("");
  const [address, setAddress] = useState("");
  const [affidavit, setAffidavit] = useState("");
  const [place, setPlace] = useState("");
  const [city, setCity] = useState("");

  const [showContact, setShowContact] = useState(false);
  const [contact, setContact] = useState({ name: "", mobile: "", email: "" });
  const [fieldErrors, setFieldErrors] = useState<EnquiryFieldErrors>({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const filled = {
    oldName: oldName.trim() || SAMPLE.oldName,
    guardian: guardian.trim() || SAMPLE.guardian,
    newName: newName.trim() || SAMPLE.newName,
    address: address.trim() || SAMPLE.address,
    place: place.trim() || SAMPLE.place,
    date: formatDate(affidavit) || "24.08.2026",
  };

  const isSample = !oldName.trim() && !newName.trim();
  const rel = RELATIONS.find((r) => r.value === relation) ?? RELATIONS[0];

  const notice = useMemo(() => {
    if (lang === "hindi") {
      return `मैं, ${filled.oldName}, ${rel.hindi} ${filled.guardian}, निवासी ${filled.address}, ने अपना नाम बदलकर ${filled.newName} रख लिया है। शपथ पत्र दिनांक ${filled.date}, नोटरी ${filled.place} के समक्ष।`;
    }
    return `I, ${filled.oldName}, ${rel.short} ${filled.guardian}, R/o ${filled.address}, have changed my name to ${filled.newName} vide affidavit dated ${filled.date} sworn before Notary, ${filled.place}.`;
  }, [lang, rel, filled.oldName, filled.guardian, filled.newName, filled.address, filled.date, filled.place]);

  const words = notice.trim().split(/\s+/).length;

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
    const message = [
      "Name change notice request",
      "",
      `Old name: ${filled.oldName}`,
      `New name: ${filled.newName}`,
      `Relation: ${rel.short} ${filled.guardian}`,
      `Address: ${filled.address}`,
      `Affidavit date: ${filled.date}`,
      `Notary place: ${filled.place}`,
      `Language: ${lang === "hindi" ? "Hindi" : "English"}`,
      city ? `Preferred edition: ${city}` : "",
      "",
      "Draft notice:",
      notice,
    ]
      .filter((line) => line !== "")
      .join("\n");

    const payload = {
      name: contact.name,
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
            <div className="flex flex-wrap gap-2">
              {RELATIONS.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => setRelation(item.value)}
                  className={`border px-3.5 py-2 text-sm font-medium transition ${
                    relation === item.value
                      ? "border-maroon bg-maroon/8 text-maroon"
                      : "border-line bg-white text-charcoal hover:border-maroon/40"
                  }`}
                >
                  {item.label} <span className="text-xs opacity-70">({item.short})</span>
                </button>
              ))}
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
          <Field label={`${rel.label} (father / husband name)`}>
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
            <input
              type="date"
              value={affidavit}
              onChange={(e) => setAffidavit(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Notary place">
            <input
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              placeholder={SAMPLE.place}
              maxLength={80}
              className={inputClass}
            />
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

        {isSample ? (
          <p className="mt-3 text-xs text-charcoal">
            Showing a sample notice — start typing to see yours.
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
              Our desk will confirm the wording, paper, rate, and publishing date on WhatsApp.
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
              {loading ? "Sending…" : "Get my rate"}
            </button>
            <p className="mt-3 text-center text-xs text-charcoal">
              Your draft notice is attached automatically.
            </p>
          </div>
        ) : null}
      </div>
    </div>
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
