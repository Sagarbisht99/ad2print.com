import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaPhoneAlt } from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { EnquiryButton } from "@/components/newspaper-classified/EnquiryButton";
import { PropertyCards } from "@/components/property/PropertyCards";
import { getPropertyPackages } from "@/lib/property";
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
  title: "Property Ads in Newspapers — Book Online",
  description:
    "Book property ads in Times of India, Dainik Jagran, Navbharat Times, Hindustan Times & Economic Times — Delhi, Mumbai, Bangalore, Kolkata, Chennai & Hyderabad. Free drafting, e-paper proof.",
  path: "/property",
  keywords: [
    "property ad in newspaper",
    "property classified ad Delhi",
    "property for sale ad newspaper",
    "flat for sale newspaper ad",
    "property to let ad newspaper",
    "property ad book online",
    "times of india property ad",
    "property classified ad price",
    "property ad booking Mumbai",
    "property ad booking Bangalore",
  ],
});

const PROPERTY_FAQS = [
  {
    q: "Which newspapers are best for property ads?",
    a: "Times of India dominates property readers across Delhi, Mumbai, Bangalore, Kolkata, Chennai and Hyderabad. Hindustan Times and Dainik Jagran are strong in the Hindi belt; Economic Times reaches investors. The multi-paper combos above (incl. Property Times on Saturdays) maximise reach in a single booking.",
  },
  {
    q: "How much does a property ad cost?",
    a: "From ₹750 (Times of India — Hyderabad, 5 lines) to ₹10,500 (Dainik Jagran — All Editions, 37 cities). Multi-paper packages cover 3–6 titles in one rate. Extra lines are billed at 20% of the package rate per line; 5% GST and 2.5% convenience fee are added at checkout — the total is shown before you pay.",
  },
  {
    q: "What should a property ad include?",
    a: "Property type (sale / rent / to-let), BHK, area in sq ft/sq yd, locality/landmark, price (or 'on request'), contact details, and possession status. The desk drafts the ad to fit the edition's column width — in English, Hindi or your language of choice.",
  },
  {
    q: "Can I book a property ad for tomorrow's paper?",
    a: "Usually yes — most editions accept property classifieds confirmed before the 5 PM cut-off the previous day. Saturday property supplements (Property Times) close earlier, so call the desk to confirm your exact deadline.",
  },
];

const PROPERTY_STEPS = [
  { name: "Choose package", text: "Pick the city or the multi-paper combo matching your budget." },
  { name: "Compose & approve", text: "Send the details — the desk drafts the ad free and confirms before print." },
  { name: "Pay online", text: "Approve the proof, pay online, and we publish & send the e-paper page." },
];

export default function PropertyPage() {
  const packages = getPropertyPackages();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Property ads", path: "/property" },
          ]),
          webPageJsonLd({
            path: "/property",
            name: "Property ads in newspapers — book online",
            description:
              "Book property classifieds in Delhi, Mumbai, Bangalore, Kolkata, Chennai and Hyderabad editions of Times of India, Dainik Jagran, Navbharat Times, Hindustan Times and Economic Times.",
          }),
          serviceJsonLd({
            name: "Property newspaper advertisement booking",
            description:
              "Online booking for property sale, rent and to-let ads in Delhi, Mumbai, Bangalore, Kolkata, Chennai and Hyderabad newspapers — drafting, translation and e-paper proof included.",
            path: "/property",
            category: "Property",
            serviceType: "Property newspaper classified and display advertising",
            areaServed: ["Delhi", "Mumbai", "Bangalore", "Kolkata", "Chennai", "Hyderabad"],
          }),
          itemListJsonLd({
            name: "Property ad packages",
            items: packages.map((pkg) => ({
              name: pkg.name,
              path: `/newspapers/${pkg.papers[0]?.slug}`,
            })),
          }),
          faqJsonLd(PROPERTY_FAQS),
        ]}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <nav aria-label="Breadcrumb" className="text-xs text-charcoal">
            <Link href="/" className="hover:text-maroon">
              Home
            </Link>
            <span className="mx-2 text-line">/</span>
            <span className="font-medium text-ink">Property ads</span>
          </nav>

          <p className="section-kicker mt-4">Property classifieds</p>
          <h1 className="mt-2 font-display text-3xl leading-[1.05] text-ink sm:text-5xl">
            Property ads in newspapers — book online
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
            Times of India, Dainik Jagran, Navbharat Times, Hindustan Times, Economic Times &amp;
            Mirror — Delhi, Mumbai, Bangalore, Kolkata, Chennai &amp; Hyderabad. Flat &amp; plot sale,
            rent, to-let &amp; investment ads. Free drafting, rate confirmed before payment, e-paper
            proof after print.
          </p>
        </div>

        <div className="border-t border-line bg-paper">
          <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal sm:px-6 sm:text-xs">
            {PROPERTY_STEPS.map((step, index) => (
              <li key={step.name} className="inline-flex items-baseline gap-2">
                <span className="font-display text-base font-bold text-maroon">0{index + 1}</span>
                {step.name}
                {index < PROPERTY_STEPS.length - 1 ? (
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
          <PropertyCards packages={packages} />
          <p className="mt-6 text-center text-xs leading-relaxed text-slate">
            Package rates cover the first 5 lines; extra lines are billed at 20% of the package rate.
            5% GST and 2.5% convenience fee are added at checkout — the total is shown before you pay.{" "}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="font-semibold text-maroon hover:underline"
            >
              {SITE.phone}
            </a>
            <br />
            Property Times (Saturday supplement) &amp; rent-only packages are clearly marked; call the
            desk for the current edition rate.
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="section-kicker">Questions</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Property ads — FAQ
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {PROPERTY_FAQS.map((faq) => (
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
              "English & Hindi newspapers",
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
                Selling or renting out? Get rate in minutes.
              </h2>
              <p className="mt-1.5 text-sm text-charcoal">
                Tell us the property, locality and budget — we confirm the edition, date and rate
                including GST before you pay.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <EnquiryButton
                className="inline-flex items-center gap-2 rounded-xl bg-maroon px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(200,16,46,0.22)] transition hover:-translate-y-0.5 hover:bg-maroon-deep"
                label="Book a property ad"
              >
                Book your property ad <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
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
