import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaPhoneAlt } from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { EnquiryButton } from "@/components/newspaper-classified/EnquiryButton";
import { LostFoundCards } from "@/components/lost-found/LostFoundCards";
import { getLostFoundPackages } from "@/lib/lost-found";
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
  title: "Lost & Found Ads in Newspaper — Book Online",
  description:
    "Book lost & found ads in 28 city editions — Delhi-NCR, Mumbai, Chennai, Hyderabad, Kolkata, Pune and more. Rates from ₹100. Free drafting, e-paper proof after print.",
  path: "/lost-and-found",
  keywords: [
    "lost and found ad in newspaper",
    "lost document ad Delhi",
    "lost share certificate notice newspaper",
    "marksheet lost newspaper ad",
    "lost deed advertisement newspaper",
    "lost and found classified ad",
    "book lost ad online",
    "lost document notice ad price",
  ],
});

const LOST_FOUND_FAQS = [
  {
    q: "When should I publish a lost & found ad?",
    a: "Whenever a bank, university, registrar, police or company asks for a public notice — lost share certificates, marksheets, deeds, bonds, licenses and identity documents usually need one. The desk confirms the exact wording the receiving office expects.",
  },
  {
    q: "How much does a lost & found ad cost?",
    a: "From ₹100 (Loksatta Pune) to ₹2,000 (Prajavani All Editions, Mysore) for the first 5 lines. The desk shows the full amount including GST and convenience fee before publication — never after.",
  },
  {
    q: "What should the ad mention?",
    a: "Document type, serial/reference number if any, date of loss, the area it was lost in, and a contact number for the finder. The desk drafts the notice to fit the edition's column width — in English, Hindi or any regional language.",
  },
  {
    q: "Can my ad run tomorrow?",
    a: "Most editions accept a lost & found ad confirmed before the 5 PM cut-off the previous day. Weekend editions close earlier — call the desk to confirm your deadline.",
  },
  {
    q: "How will I prove the ad ran?",
    a: "After publication we send the e-paper page for the correct date and edition, plus a GST invoice. A physical cutting can be arranged on request for legal or filing purposes.",
  },
];

const LOST_FOUND_STEPS = [
  { name: "Choose city & paper", text: "Pick one of 28 city editions and the newspaper the office asked for." },
  { name: "Compose & approve", text: "Send the document details — the desk drafts a print-ready notice free." },
  { name: "Publish and collect proof", text: "Approve the proof, we publish & send the e-paper page." },
];

export default function LostAndFoundPage() {
  const packages = getLostFoundPackages();
  const cities = [...new Set(packages.map((pkg) => pkg.city))];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Lost & found ads", path: "/lost-and-found" },
          ]),
          webPageJsonLd({
            path: "/lost-and-found",
            name: "Lost & found ads in newspapers — book online",
            description:
              "Book lost & found ads in 28 city editions — Delhi-NCR, Mumbai, Chennai, Hyderabad, Kolkata, Pune and more. Rates from ₹100.",
          }),
          serviceJsonLd({
            name: "Lost & found newspaper advertisement booking",
            description:
              "Online booking for lost & found notices — marksheets, deeds, share certificates, licenses — in 28 city editions across India.",
            path: "/lost-and-found",
            category: "Lost & Found",
            serviceType: "Lost & found newspaper classified advertising",
            areaServed: cities,
          }),
          itemListJsonLd({
            name: "Lost & found ad packages",
            items: packages.map((pkg) => ({
              name: pkg.name,
              path: `/newspapers/${pkg.papers[0]?.slug}`,
            })),
          }),
          faqJsonLd(LOST_FOUND_FAQS),
        ]}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <nav aria-label="Breadcrumb" className="text-xs text-charcoal">
            <Link href="/" className="hover:text-maroon">
              Home
            </Link>
            <span className="mx-2 text-line">/</span>
            <span className="font-medium text-ink">Lost &amp; found ads</span>
          </nav>

          <p className="section-kicker mt-4">Lost &amp; found · documents &amp; certificates</p>
          <h1 className="mt-2 font-display text-3xl leading-[1.05] text-ink sm:text-5xl">
            Lost &amp; found ads in newspapers — book online
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
            {packages.length} packages across {cities.length} city editions — Delhi-NCR, Mumbai,
            Chennai, Hyderabad, Kolkata, Pune, Ahmedabad, Jaipur and more. Marksheets, deeds, share
            certificates, licenses, bonds. Free drafting, rate confirmed on WhatsApp, e-paper
            proof after print.
          </p>
        </div>

        <div className="border-t border-line bg-paper">
          <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal sm:px-6 sm:text-xs">
            {LOST_FOUND_STEPS.map((step, index) => (
              <li key={step.name} className="inline-flex items-baseline gap-2">
                <span className="font-display text-base font-bold text-maroon">0{index + 1}</span>
                {step.name}
                {index < LOST_FOUND_STEPS.length - 1 ? (
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
          <LostFoundCards packages={packages} />
          <p className="mt-6 text-center text-xs leading-relaxed text-slate">
            Rates shown cover the first 5 lines of text; extra lines are billed at 20% of the package
            rate. GST is added and the total is confirmed on WhatsApp before publication.{" "}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="font-semibold text-maroon hover:underline"
            >
              {SITE.phone}
            </a>
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="section-kicker">Questions</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Lost &amp; found ads — FAQ
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {LOST_FOUND_FAQS.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-line bg-white p-5">
                <h3 className="font-display text-base text-ink">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{faq.a}</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal">
            {[
              "Free drafting & translation",
              "Next-day publication where available",
              "e-paper proof & GST invoice",
              "28 city editions · English & regional",
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
                Lost your documents? Book the notice today.
              </h2>
              <p className="mt-1.5 text-sm text-charcoal">
                Tell us the document and the city — we confirm the edition, date and rate including
                GST before publication.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <EnquiryButton
                className="inline-flex items-center gap-2 rounded-xl bg-maroon px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(200,16,46,0.22)] transition hover:-translate-y-0.5 hover:bg-maroon-deep"
                label="Book a lost & found ad"
              >
                Book your lost &amp; found ad <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
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
