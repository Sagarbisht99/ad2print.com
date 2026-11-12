import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { NewspaperLogo } from "@/components/NewspaperWall";
import { getTenderGroups } from "@/lib/tender";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  pageMeta,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Book Tender & Public Notice Ad in Newspaper",
  description:
    "Book tender notices, e-tender notices and public notices in Times of India, Hindustan Times, Hindustan, Navbharat Times and other leading newspapers. Fixed minimum-size rates and online payment.",
  path: "/tender-notice",
  keywords: [
    "tender notice in newspaper",
    "tender ad booking online",
    "public notice newspaper ad",
    "e-tender newspaper advertisement",
    "tender notice times of india",
    "tender notice hindustan times",
    "newspaper tender advertisement rates",
    "auction notice newspaper ad",
  ],
});

const TENDER_FAQS = [
  {
    q: "What is a tender notice advertisement?",
    a: "A tender notice is a public advertisement inviting bids or quotations for a contract, purchase or work. Government departments, companies and institutions publish it in newspapers so the process is open and on record.",
  },
  {
    q: "How is the price calculated?",
    a: "Rates below are for the minimum ad size shown on each package. If your matter needs a bigger size, the price increases — the desk confirms the final amount before publishing.",
  },
  {
    q: "Can I send my own tender wording?",
    a: "Yes. Send the approved matter exactly as it should appear. We can also help format the details, but the content must be approved by your organisation before booking.",
  },
  {
    q: "Are taxes included in the package rate?",
    a: "No. The package rate is before taxes. A 5% GST and a 2.5% convenience fee on rate plus GST are added at checkout, and the total is shown before payment.",
  },
];

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function TenderNoticePage() {
  const groups = getTenderGroups();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Tender & public notice ads", path: "/tender-notice" },
          ]),
          webPageJsonLd({
            path: "/tender-notice",
            name: "Book Tender & Public Notice Ad in Newspaper",
            description:
              "Fixed-price tender and public notice ad packages in leading Indian newspapers, with online payment.",
          }),
          serviceJsonLd({
            name: "Tender and public notice newspaper advertisement",
            description:
              "Book tender, e-tender, auction and public notices in leading Indian newspapers with publication proof.",
            path: "/tender-notice",
          }),
          faqJsonLd(TENDER_FAQS),
        ]}
      />

      <h1 className="sr-only">Book tender and public notice ads in newspapers</h1>

      {groups.length > 0 ? (
        <nav aria-label="Tender ad cities" className="border-b border-line bg-white/70">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-4 sm:px-6">
            <span className="mr-1 text-xs font-bold uppercase tracking-[0.14em] text-charcoal">
              Jump to
            </span>
            {groups.map((group) => (
              <a
                key={group.city}
                href={`#${group.slug}`}
                className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-maroon/45 hover:text-maroon"
              >
                {group.title}
              </a>
            ))}
          </div>
        </nav>
      ) : null}

      <div id="packages" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-14">
          {groups.map((group) => (
            <section key={group.city} id={group.slug} className="scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                <div>
                  <p className="section-kicker">Rates</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-4xl">
                    Tender &amp; public notice ads in {group.title}
                  </h2>
                </div>
                <p className="text-xs text-charcoal">
                  {group.packages.length} package{group.packages.length === 1 ? "" : "s"} · rate +
                  5% GST
                </p>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.packages.map((pkg) => (
                  <article
                    key={pkg.id}
                    className="flex h-full flex-col rounded-xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-maroon/40 hover:shadow-[0_16px_36px_rgba(26,27,30,0.08)]"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {pkg.bestSeller ? (
                        <span className="bg-maroon px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                          Best seller
                        </span>
                      ) : null}
                      {pkg.tag ? (
                        <span className="border border-maroon/40 bg-maroon/8 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-maroon">
                          {pkg.tag}
                        </span>
                      ) : null}
                    </div>

                    <h3 className="mt-3 font-display text-lg leading-snug text-ink">{pkg.label}</h3>

                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {pkg.papers.map((paper) => (
                        <span
                          key={paper.slug}
                          className="inline-flex h-9 w-28 shrink-0 items-center justify-center overflow-hidden"
                        >
                          <NewspaperLogo paper={paper} className="h-9 w-28 object-contain" />
                        </span>
                      ))}
                    </div>

                    <p className="mt-3 text-xs text-charcoal">
                      Minimum size: <span className="font-semibold text-ink">{pkg.size}</span> ·{" "}
                      {pkg.unit}
                    </p>

                    <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal">
                          Total rate
                        </p>
                        <p className="font-display text-2xl font-semibold text-maroon">
                          {pkg.rate ? inr(pkg.rate) : "On request"}
                        </p>
                      </div>
                      <Link
                        href={
                          pkg.rate
                            ? `/tender-notice/book?city=${encodeURIComponent(pkg.city)}&papers=${pkg.slugs.join(",")}`
                            : "/contact"
                        }
                        className="btn-primary px-4 py-2 text-sm"
                      >
                        Book now
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      <section className="border-y border-line bg-white/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="section-kicker">Please note</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Before you book a tender notice
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "5% GST is extra on every rate shown above.",
              "The price changes if your ad size is larger than the minimum shown.",
              "Send the approved tender matter exactly as it should appear in print.",
              "The desk confirms the final size, edition and publishing date before print.",
            ].map((item) => (
              <li
                key={item}
                className="flex gap-3 border-l-2 border-maroon bg-paper px-4 py-3 text-sm leading-relaxed text-charcoal"
              >
                <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-maroon" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="section-kicker">Questions</p>
        <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">Tender ad booking FAQ</h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {TENDER_FAQS.map((faq) => (
            <details key={faq.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-ink sm:text-base [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="mt-0.5 shrink-0 text-maroon transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-relaxed text-charcoal">{faq.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-sm text-charcoal">
          Need a newspaper that is not listed? Call the desk on{" "}
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-maroon">
            {SITE.phone}
          </a>{" "}
          or{" "}
          <Link href="/contact" className="font-semibold text-maroon hover:underline">
            send an enquiry
          </Link>
          . {SITE.hours}.
        </p>
      </section>
    </>
  );
}
