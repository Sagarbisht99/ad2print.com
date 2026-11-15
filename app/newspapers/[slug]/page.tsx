import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowRight, FaCheckCircle, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { CategoryIcon } from "@/components/CategoryIcon";
import { JsonLd } from "@/components/JsonLd";
import { NewspaperLogo } from "@/components/NewspaperWall";
import { getCategoryHref } from "@/lib/category-routes";
import { getCategoriesOrdered, getNewspaper, getNewspapers, getRelatedNewspapers, type Newspaper } from "@/lib/data";
import {
  getAdTypesForPaper,
  getLanguageLabel,
  getLanguageNote,
  getNewspaperFaqs,
  getNewspaperMetaDescription,
  getNewspaperMetaTitle,
} from "@/lib/newspaper-content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
  pageMeta,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

const NEWSPAPER_BOOKING_STEPS = [
  "Tell us the city edition, ad format and the wording or brief.",
  "We confirm the rate, size and available publication date including GST.",
  "You approve the proof and pay online.",
  "The ad prints after editorial approval; we send the e-paper page and invoice.",
];

export async function generateStaticParams() {
  return getNewspapers().map((paper) => ({ slug: paper.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const paper = getNewspaper(slug);
  if (!paper) return { title: "Newspaper ad booking" };

  return pageMeta({
    title: getNewspaperMetaTitle(paper),
    description: getNewspaperMetaDescription(paper),
    path: `/newspapers/${paper.slug}`,
    keywords: [
      `${paper.name} ad booking`,
      `${paper.name} classified ad`,
      `${paper.name} newspaper ad rates`,
      `${paper.name} display ad`,
      `${paper.language} newspaper advertising`,
      `advertise in ${paper.name}`,
    ],
  });
}

export default async function NewspaperDetailPage({ params }: Props) {
  const { slug } = await params;
  const paper = getNewspaper(slug);
  if (!paper) notFound();

  const faqs = getNewspaperFaqs(paper);
  const formats = getAdTypesForPaper(paper);
  const categories = getCategoriesOrdered();
  const related = getRelatedNewspapers(paper.slug, 8);
  const path = `/newspapers/${paper.slug}`;
  const languageArticle = /^[aeiou]/i.test(paper.language) ? "an" : "a";

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Newspapers", path: "/newspapers" },
            { name: paper.name, path },
          ]),
          webPageJsonLd({
            path,
            name: `${paper.name} newspaper ad booking`,
            description: getNewspaperMetaDescription(paper),
          }),
          serviceJsonLd({
            name: `Newspaper advertising in ${paper.name}`,
            description: `Book classified, classified display and display ads in ${paper.name}, ${paper.language}, with ${paper.cities.length} editions.`,
            path,
            category: `${paper.name} newspaper advertising`,
            serviceType: "Newspaper classified and display advertising",
            areaServed: paper.cities,
          }),
          howToJsonLd({
            name: `How to book an ad in ${paper.name}`,
            description: `Choose the ${paper.name} city edition, ad format and wording, approve the proof and pay online.`,
            url: absoluteUrl(path),
            steps: NEWSPAPER_BOOKING_STEPS.map((text, index) => ({
              name: `Step ${index + 1}`,
              text,
            })),
          }),
          faqJsonLd(faqs),
        ]}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <nav aria-label="Breadcrumb" className="text-xs text-charcoal">
            <Link href="/" className="hover:text-maroon">
              Home
            </Link>
            <span className="mx-2 text-line">/</span>
            <Link href="/newspapers" className="hover:text-maroon">
              Newspapers
            </Link>
            <span className="mx-2 text-line">/</span>
            <span className="font-medium text-ink">{paper.name}</span>
          </nav>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
            <div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex h-14 w-36 items-center">
                  <NewspaperLogo paper={paper} />
                </span>
                <span className="rounded-full border border-line bg-paper px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal">
                  {paper.language} · {paper.region}
                </span>
              </div>

              <h1 className="mt-6 font-display text-4xl leading-[1.04] text-ink sm:text-6xl">
                Book an ad in {paper.name}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal sm:text-lg">
                {paper.name} is a {paper.language}-language newspaper with{" "}
                {paper.cities.length} {paper.cities.length === 1 ? "edition" : "editions"} listed,
                reaching readers across {paper.region.toLowerCase()} India. Book a text classified,
                classified display or main-page display ad through AD2PRINT and get the published
                page as proof.
              </p>

              <ul className="mt-7 grid gap-2.5 sm:grid-cols-2">
                {[
                  `${formats.map((format) => format.name).join(", ")}`,
                  `${paper.cities.length} city editions available for booking`,
                  `Drafting and translation in ${paper.language}`,
                  "GST invoice and e-paper proof after publication",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-charcoal">
                    <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-maroon" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  Get the live rate <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-ghost">
                  <FaPhoneAlt className="h-3.5 w-3.5" aria-hidden /> {SITE.phone}
                </a>
                <Link href="/newspaper-classified" className="btn-ghost">
                  Classified ad guide <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
              </div>
            </div>

            <aside className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                Newspaper facts
              </p>
              <dl className="mt-4 divide-y divide-line border-t border-line">
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Language</dt>
                  <dd className="text-right text-xs font-semibold text-ink">
                    {getLanguageLabel(paper.language)}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Region</dt>
                  <dd className="text-right text-xs font-semibold text-ink">{paper.region}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Editions listed</dt>
                  <dd className="text-right text-xs font-semibold text-ink">{paper.cities.length}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Ad formats</dt>
                  <dd className="text-right text-xs font-semibold text-ink">
                    {formats.map((format) => format.name).join(", ")}
                  </dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Proof</dt>
                  <dd className="text-right text-xs font-semibold text-ink">e-paper page</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">GST invoice</dt>
                  <dd className="text-right text-xs font-semibold text-ink">Included</dd>
                </div>
              </dl>
              <p className="mt-4 text-[11px] leading-relaxed text-slate">
                Rates are confirmed per edition, format and size. Ask the desk for today&apos;s rate
                and cut-off before booking.
              </p>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0b6b37]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0b6b37] transition hover:border-[#0b6b37]/50"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden /> Ask about {paper.name}
              </a>
            </aside>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <section>
          <p className="section-kicker">Editions</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            {paper.name} editions and cities
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal">
            Choose the city edition that covers the readers you need. A local edition is usually
            cheaper than a national run and can respond faster for property, recruitment and public
            notices.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {paper.cities.map((city) => (
              <Link
                key={city}
                href={`/newspapers?q=${encodeURIComponent(city)}`}
                className="rounded-full border border-line bg-white px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
              >
                {city}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-line pt-12">
          <p className="section-kicker">Formats</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Ad formats available in {paper.name}
          </h2>
          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {formats.map((format) => (
              <div key={format.slug} className="rounded-xl border border-line bg-white p-5">
                <h3 className="font-display text-lg text-ink">{format.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">
                  {format.slug === "text-classified"
                    ? "A few lines of plain text in the classified columns. The most economical option for notices, matrimonial and property ads."
                    : format.slug === "classified-display"
                      ? "A boxed ad with a logo, photo or larger type inside the classified pages. Good for offers, property and recruitment."
                      : "A larger display ad alongside news, priced by page, position, size and colour. Best for launches and brand campaigns."}
                </p>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-maroon hover:underline"
                >
                  Ask for this format <FaArrowRight className="h-3 w-3" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-line pt-12">
          <p className="section-kicker">Categories</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            What people advertise in {paper.name}
          </h2>
          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={getCategoryHref(category.slug)}
                className="group flex flex-col items-start rounded-xl border border-line bg-white p-4 transition hover:border-maroon/35"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-lg"
                  style={{ background: `${category.tint}18`, color: category.tint }}
                >
                  <CategoryIcon name={category.icon} className="h-4 w-4" />
                </span>
                <span className="mt-3 text-sm font-bold text-ink group-hover:text-maroon">
                  {category.name}
                </span>
                <span className="mt-1 line-clamp-2 text-xs leading-relaxed text-charcoal">
                  {category.short}
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-14 border-t border-line pt-12">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="section-kicker">Why this language</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
                Advertising in {languageArticle} {paper.language} newspaper
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal sm:text-base">
                {getLanguageNote(paper.language)}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-charcoal">
                {paper.name} is listed as a {paper.region.toLowerCase()} title with editions in{" "}
                {paper.cities.slice(0, 6).join(", ")}
                {paper.cities.length > 6 ? " and more cities" : ""}. If you need a different city or
                a companion English paper, the desk can confirm both in one order.
              </p>
            </div>
            <div>
              <p className="section-kicker">Process</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
                How to book a {paper.name} ad
              </h2>
              <ol className="mt-5 space-y-4">
                {NEWSPAPER_BOOKING_STEPS.map((step, index) => (
                  <li key={step} className="flex gap-3 text-sm leading-relaxed text-charcoal">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-maroon text-[10px] font-bold text-white">
                      {index + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {related.length > 0 ? (
          <section className="mt-14 border-t border-line pt-12">
            <p className="section-kicker">Related papers</p>
            <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
              Other {paper.language} newspapers
            </h2>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/newspapers/${item.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-line bg-white p-4 transition hover:border-maroon/35"
                >
                  <span className="flex h-9 w-20 shrink-0 items-center">
                    <NewspaperLogo paper={item as Newspaper} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold text-ink group-hover:text-maroon">
                      {item.name}
                    </span>
                    <span className="mt-0.5 block text-[10px] uppercase tracking-[0.1em] text-charcoal">
                      {item.region} · {item.cities.length} editions
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        <section className="mt-14 border-t border-line pt-12">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="section-kicker">Questions</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
                {paper.name} ad booking FAQ
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal">
                Call{" "}
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="font-semibold text-maroon hover:underline"
                >
                  {SITE.phone}
                </a>{" "}
                for the current edition cut-off. Desk hours: {SITE.hours}.
              </p>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {faqs.map((faq) => (
                <details key={faq.q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-ink sm:text-base [&::-webkit-details-marker]:hidden">
                    {faq.q}
                    <span className="mt-0.5 shrink-0 text-maroon transition group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 pr-8 text-sm leading-relaxed text-charcoal">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-14 rounded-2xl bg-ink px-6 py-9 text-white sm:px-10 sm:py-11">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl">
                Book your {paper.name} ad with the desk
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/70">
                Send the edition, format and wording. We will confirm the size, rate and next
                available date before you pay.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl bg-maroon px-5 py-3 text-sm font-bold text-white transition hover:bg-maroon-deep"
              >
                Start booking <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:border-white/60"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden /> WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
