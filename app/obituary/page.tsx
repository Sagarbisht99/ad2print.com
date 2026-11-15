import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaPhoneAlt } from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { EnquiryButton } from "@/components/newspaper-classified/EnquiryButton";
import { ObituaryCards } from "@/components/obituary/ObituaryCards";
import { getObituaryPackages } from "@/lib/obituary";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
  pageMeta,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Obituary Ads in Delhi — Book Online",
  description:
    "Book obituary ads in Times of India, Hindustan Times, Economic Times, Navbharat Times, The Hindu & Hindustan Delhi editions. Fixed sizes from ₹1,915. Free drafting, e-paper proof.",
  path: "/obituary",
  keywords: [
    "obituary ad in newspaper Delhi",
    "obituary notice in newspaper Delhi",
    "death announcement newspaper Delhi",
    "condolence ad newspaper Delhi",
    "obituary advertisement Delhi",
    "times of india obituary ad",
    "hindustan times obituary ad",
    "navbharat times obituary ad",
    "death notice newspaper Delhi",
    "obituary classified ad Delhi",
  ],
});

const OBITUARY_FAQS = [
  {
    q: "What size should an obituary ad be?",
    a: "The most economical option is The Hindu's 3.5 × 7 cm black & white format (₹1,915), ideal for a short death notice. For a fuller notice with dates, prayers and family names, book 3 × 7 cm or larger. Larger display formats (6 × 8 cm and above) suit multi-day or photo notices.",
  },
  {
    q: "Where do obituary ads appear?",
    a: "In the personal columns of the Delhi/NCR editions of Times of India, Hindustan Times, Economic Times, Navbharat Times and The Hindu. Hindi papers reach the widest reader base in the Hindi belt; The Hindu suits English readers.",
  },
  {
    q: "Do you draft the obituary?",
    a: "Yes. Send the details — name, date of death, age, family members, funeral details — and the desk drafts the notice in a respectful, print-ready format at no extra charge. You always approve the proof before print.",
  },
  {
    q: "How late can I book an obituary ad for tomorrow's paper?",
    a: "Most Delhi editions accept the ad confirmed before the publication cut-off, usually around 5 PM the previous day. Weekend editions close earlier, so call the desk to confirm your exact deadline.",
  },
  {
    q: "Will I get proof after the ad is published?",
    a: "Yes — the e-paper page for the correct date and edition, plus a GST invoice, are sent after publication. A physical newspaper cutting can be arranged on request for legal or filing purposes.",
  },
];

const OBITUARY_STEPS = [
  { name: "Choose paper & size", text: "Pick the Delhi-NCR edition and the display size that fits your notice." },
  { name: "Compose & approve", text: "Send the details — the desk drafts a respectful notice and translates it free." },
  { name: "Pay online", text: "Approve the proof, pay online, and we publish and send the e-paper page." },
];

export default function ObituaryPage() {
  const packages = getObituaryPackages();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Obituary ads in Delhi", path: "/obituary" },
          ]),
          webPageJsonLd({
            path: "/obituary",
            name: "Obituary ads in Delhi — book online",
            description:
              "Book obituary and condolence ads in Delhi-edition newspapers — Times of India, Hindustan Times, Economic Times, Navbharat Times, The Hindu and Hindustan Hindi.",
          }),
          serviceJsonLd({
            name: "Obituary newspaper advertisement booking in Delhi",
            description:
              "Online booking for obituary, condolence and remembrance ads in Delhi-edition newspapers — drafting, translation and e-paper proof included.",
            path: "/obituary",
            category: "Obituary",
            serviceType: "Obituary newspaper display advertising",
            areaServed: ["Delhi"],
          }),
          itemListJsonLd({
            name: "Obituary ad packages in Delhi",
            items: packages.map((pkg) => ({
              name: pkg.name,
              path: `/newspapers/${pkg.papers[0]?.slug}`,
            })),
          }),
          faqJsonLd(OBITUARY_FAQS),
        ]}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <nav aria-label="Breadcrumb" className="text-xs text-charcoal">
            <Link href="/" className="hover:text-maroon">
              Home
            </Link>
            <span className="mx-2 text-line">/</span>
            <span className="font-medium text-ink">Obituary ads in Delhi</span>
          </nav>

          <p className="section-kicker mt-4">Obituary &amp; condolence</p>
          <h1 className="mt-2 font-display text-3xl leading-[1.05] text-ink sm:text-5xl">
            Obituary ads in Delhi — book online
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
            Times of India, Hindustan Times, Economic Times, Navbharat Times, The Hindu and
            Hindustan Hindi — Delhi NCR editions. Fixed display sizes from ₹1,915 (B/w) to
            ₹54,720, with drafting, translation and e-paper proof after print. We handle these bookings
            with care and confirm everything before it prints.
          </p>
        </div>

        <div className="border-t border-line bg-paper">
          <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal sm:px-6 sm:text-xs">
            {OBITUARY_STEPS.map((step, index) => (
              <li key={step.name} className="inline-flex items-baseline gap-2">
                <span className="font-display text-base font-bold text-maroon">0{index + 1}</span>
                {step.name}
                {index < OBITUARY_STEPS.length - 1 ? (
                  <span className="text-maroon" aria-hidden>
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <ObituaryCards packages={packages} />
          <p className="mt-6 text-center text-xs leading-relaxed text-slate">
            Rates are fixed display sizes for Delhi NCR. 5% GST and 2.5% convenience fee are added at
            checkout — the full amount is shown before you pay.{" "}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="font-semibold text-maroon hover:underline"
            >
              {SITE.phone}
            </a>
            <br />
            Need a custom size or multiple inserts?{" "}
            <Link href="/contact" className="font-semibold text-maroon hover:underline">
              Call the desk — we book the size you need →
            </Link>
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="section-kicker">Questions</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Obituary ads in Delhi — FAQ
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {OBITUARY_FAQS.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-line bg-white p-5">
                <h3 className="font-display text-base text-ink">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{faq.a}</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal">
            {[
              "Respectful, print-ready drafting",
              "Next-day publication where available",
              "e-paper proof & GST invoice",
              "English & Hindi papers",
            ].map((point) => (
              <li key={point} className="inline-flex items-center gap-2">
                <FaCheckCircle className="h-4 w-4 text-maroon" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper-2/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-display text-2xl text-ink sm:text-4xl">
                Need to publish today? Call the desk.
              </h2>
              <p className="mt-1.5 text-sm text-charcoal">
                We understand the urgency — the desk is available on phone and WhatsApp during business
                hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <EnquiryButton
                className="inline-flex items-center gap-2 rounded-xl bg-maroon px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(200,16,46,0.22)] transition hover:-translate-y-0.5 hover:bg-maroon-deep"
                label="Book an obituary ad"
              >
                Book your obituary ad <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
              </EnquiryButton>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-ghost">
                <FaPhoneAlt className="h-3.5 w-3.5" aria-hidden /> {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
