import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaPhoneAlt, FaShieldAlt, FaWhatsapp } from "react-icons/fa";
import { CategoryDetailSections } from "@/components/category/CategoryDetailSections";
import { JsonLd } from "@/components/JsonLd";
import { NewspaperLogo } from "@/components/NewspaperWall";
import { CATEGORY_CONTENT } from "@/lib/category-content";
import { getCategory } from "@/lib/data";
import { getTenderGroups } from "@/lib/tender";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
  offerCatalogJsonLd,
  pageMeta,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Tender, Court & Public Notice Ads",
  description:
    "Book tender, court, public, auction and recovery notices in Times of India, Hindustan Times, Hindustan, Navbharat Times and other leading papers.",
  path: "/tender-notice",
  keywords: [
    "public notice newspaper ad",
    "court notice newspaper ad",
    "tender notice in newspaper",
    "tender ad booking online",
    "e-tender newspaper advertisement",
    "tender notice times of india",
    "tender notice hindustan times",
    "newspaper tender advertisement rates",
    "auction notice newspaper ad",
    "recovery notice newspaper",
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
  {
    q: "Which newspapers should a court notice go in?",
    a: "The court order usually names the newspaper or the area of circulation. Follow that direction. If the order is unclear, confirm with your advocate before booking.",
  },
  {
    q: "Can the notice run in more than one city?",
    a: "Yes. Choose a package for each city edition, or send the complete requirement to the desk and we will quote a combined rate and a single publication schedule.",
  },
];

const ALL_FAQS = [...TENDER_FAQS, ...CATEGORY_CONTENT["court-notice"].faqs];

const NOTICE_TYPES = [
  {
    title: "Tender / e-tender",
    text: "Invitations for contracts, purchases, works and expressions of interest.",
    href: "/categories/statutory#tender-e-tender",
  },
  {
    title: "Court notice",
    text: "Published exactly as directed by the court, tribunal or your advocate.",
    href: "#packages",
  },
  {
    title: "Public notice",
    text: "Statutory, administrative and property notices for public record.",
    href: "#packages",
  },
  {
    title: "Auction notice",
    text: "Bank, lender and recovery auctions with the reserve details supplied.",
    href: "/categories/statutory#auction-demand-insolvency",
  },
  {
    title: "Recovery / demand",
    text: "Demand and recovery notices for lenders, societies and institutions.",
    href: "/categories/statutory#auction-demand-insolvency",
  },
  {
    title: "Company statutory",
    text: "AGM, results, lost shares, possession and other statutory formats.",
    href: "/categories/statutory",
  },
];

const TENDER_STEPS = [
  {
    name: "Send the approved wording",
    text: "Share the final notice text supplied by your organisation, court or advocate.",
  },
  {
    name: "Confirm the edition and size",
    text: "The desk checks the city edition, minimum size, publication date and final rate.",
  },
  {
    name: "Approve the proof",
    text: "Check the notice against the approved draft before it is released to the newspaper.",
  },
  {
    name: "Publish and collect proof",
    text: "Pay online, then receive the e-paper page and invoice for your records.",
  },
];

const NOTICE_CHECKLIST = [
  "Approved notice draft, exactly as it should print",
  "Court order or tender reference number, if any",
  "Newspaper name and city edition specified by the authority",
  "Publication date or deadline",
  "Billing details and GSTIN, if you need a tax invoice",
];

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function TenderNoticePage() {
  const groups = getTenderGroups();
  const category = getCategory("court-notice");
  const content = CATEGORY_CONTENT["court-notice"];
  const packageCount = groups.reduce((total, group) => total + group.packages.length, 0);
  const offers = groups
    .flatMap((group) => group.packages)
    .filter((pkg) => typeof pkg.rate === "number" && pkg.rate > 0)
    .slice(0, 80)
    .map((pkg) => ({
      name: `${pkg.label} — ${pkg.city}`,
      price: pkg.rate ?? 0,
      path: `/tender-notice/book?city=${encodeURIComponent(pkg.city)}&papers=${pkg.slugs.join(",")}`,
      description: `${pkg.size} minimum · ${pkg.unit} · ${pkg.city}`,
    }));

  if (!category) return null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Public / court & tender notice ads", path: "/tender-notice" },
          ]),
          webPageJsonLd({
            path: "/tender-notice",
            name: "Book Public, Court & Tender Notice Ad in Newspaper",
            description:
              "Fixed-price public, court, tender and e-tender notice ad packages in leading Indian newspapers, with online payment.",
          }),
          serviceJsonLd({
            name: "Public, court and tender notice newspaper advertisement",
            description:
              "Book public, court, tender, e-tender, auction and recovery notices in leading Indian newspapers with publication proof.",
            path: "/tender-notice",
            category: "Public / Court Notice",
            serviceType: "Tender, court and public notice newspaper advertising",
          }),
          faqJsonLd(ALL_FAQS),
          offerCatalogJsonLd({
            name: "Tender, court and public notice ad packages",
            offers,
          }),
          howToJsonLd({
            name: "How to publish a tender or court notice in a newspaper",
            description:
              "Send the approved notice, confirm the edition and size, approve the proof and pay online before publication.",
            url: absoluteUrl("/tender-notice"),
            steps: TENDER_STEPS,
          }),
        ]}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="text-xs text-charcoal">
            <Link href="/" className="hover:text-maroon">
              Home
            </Link>
            <span className="mx-2 text-line">/</span>
            <span className="font-medium text-ink">Tender, court &amp; public notices</span>
          </nav>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
            <div>
              <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                <FaShieldAlt className="h-3.5 w-3.5" aria-hidden />
                {content.eyebrow}
              </p>
              <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.04] text-ink sm:text-6xl">
                Tender, court &amp; public notice ads
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal sm:text-lg">
                {content.intro[0]}
              </p>
              {content.intro[1] ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
                  {content.intro[1]}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#packages" className="btn-primary">
                  See city-wise rates <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-ghost">
                  <FaPhoneAlt className="h-3.5 w-3.5" aria-hidden /> {SITE.phone}
                </a>
              </div>

              <ul className="mt-9 grid gap-2.5 sm:grid-cols-2">
                {content.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal">
                    <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-maroon" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-9 rounded-xl border border-line bg-paper p-5">
                <h2 className="font-display text-lg text-ink">What to send with the booking</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {NOTICE_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-charcoal">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-maroon" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-slate">
                  Court and legal notices should not be edited. Send the final approved draft and
                  the desk will publish it as supplied.
                </p>
              </div>
            </div>

            <aside className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                At a glance
              </p>
              <dl className="mt-4 divide-y divide-line border-y border-line">
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">City packages</dt>
                  <dd className="text-right text-xs font-semibold text-ink">{packageCount}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Pricing</dt>
                  <dd className="text-right text-xs font-semibold text-ink">Minimum-size rate</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Wording</dt>
                  <dd className="text-right text-xs font-semibold text-ink">Published as approved</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Proof</dt>
                  <dd className="text-right text-xs font-semibold text-ink">e-paper after print</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Invoice</dt>
                  <dd className="text-right text-xs font-semibold text-ink">GST invoice</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Taxes</dt>
                  <dd className="text-right text-xs font-semibold text-ink">5% GST extra</dd>
                </div>
              </dl>

              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0b6b37]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0b6b37] transition hover:border-[#0b6b37]/50"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden /> Send the notice for a quote
              </a>
              <p className="mt-3 text-[11px] leading-relaxed text-slate">
                {SITE.hours}. {SITE.cutoff}.
              </p>
            </aside>
          </div>
        </div>
      </div>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <p className="section-kicker">Notice types</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Every notice an authority asks for
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {NOTICE_TYPES.map((type) => (
              <Link
                key={type.title}
                href={type.href}
                className="group rounded-xl border border-line bg-white p-4 transition hover:border-maroon/35 hover:shadow-[0_12px_28px_rgba(26,26,26,0.07)]"
              >
                <h3 className="font-display text-base text-ink group-hover:text-maroon">
                  {type.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-charcoal">{type.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

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

      <div id="packages" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16">
        <div className="space-y-14">
          {groups.map((group) => (
            <section key={group.city} id={group.slug} className="scroll-mt-24">
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
                <div>
                  <p className="section-kicker">Rates</p>
                  <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-4xl">
                    Public, court &amp; tender notice ads in {group.title}
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
            Before you book a tender or court notice
          </h2>
          <ul className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              "5% GST is extra on every rate shown above.",
              "The price changes if your ad size is larger than the minimum shown.",
              "Send the approved tender or court matter exactly as it should appear in print.",
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

      <CategoryDetailSections
        category={category}
        content={content}
        faqs={ALL_FAQS}
        ctaHref="/contact"
        ctaLabel="Send your notice"
        ctaTitle="Need a tender or court notice published?"
        ctaText="Send the approved wording, newspaper and city. We will confirm the minimum size, final rate including GST and the publication date before you pay."
      />
    </>
  );
}
