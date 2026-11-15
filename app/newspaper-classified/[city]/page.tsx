import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  FaArrowRight,
  FaCheckCircle,
  FaPhoneAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { NewspaperLogo } from "@/components/NewspaperWall";
import {
  getNameChangeCities,
  getNameChangeCityFromSlug,
  getNewspapersByCity,
  slugifyCity,
} from "@/lib/data";
import { cityDisplayName } from "@/lib/city-images";
import { getLanguageLabel } from "@/lib/newspaper-content";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
  pageMeta,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ city: string }> };

export async function generateStaticParams() {
  return getNameChangeCities().map((city) => ({ city: slugifyCity(city) }));
}

export const dynamicParams = false;

const POPULAR_CLASSIFIED_CATEGORIES = [
  { name: "Name change notice", path: "/change-my-name" },
  { name: "Matrimonial ads", path: "/matrimonial" },
  { name: "Property sale / rent", path: "/categories/property" },
  { name: "Recruitment / jobs", path: "/categories/recruitment" },
  { name: "Lost & found / documents", path: "/categories/lost-and-found" },
  { name: "Court & tender notices", path: "/tender-notice" },
  { name: "Announcements", path: "/categories/announcement" },
  { name: "Vehicles classified", path: "/categories/vehicles" },
];

function cityFaqs(city: string, paperCount: number, sample: string[]) {
  const sampleList = sample.slice(0, 3).join(", ");
  return [
    {
      q: `How much does a newspaper classified ad cost in ${city}?`,
      a: `The rate depends on the newspaper, the ${city} edition, the ad format and the number of lines. Tell the AD2PRINT desk the paper, category and wording and you will get the exact rate including GST before you pay — never after.`,
    },
    {
      q: `Which newspapers cover ${city}?`,
      a: `${paperCount} newspapers publish a ${city} edition or accept bookings for ${city}, including ${sampleList}. English and regional-language editions are both available; browse the full list above or call the desk for availability.`,
    },
    {
      q: `What classified formats can I book in ${city}?`,
      a: `Text classified (priced per line, word or character), classified display (a boxed ad with logo or photo, priced per square centimetre) and main-page display (priced by page, position, size and colour). The desk confirms which format the paper accepts for your category.`,
    },
    {
      q: `Can my classified ad run in ${city} tomorrow?`,
      a: `Most editions accept a classified confirmed before the publication cut-off, usually around 5 PM the previous day. Weekend and premium editions close earlier, so call the desk to confirm the exact deadline for your paper and category.`,
    },
    {
      q: `Do you draft or translate the ad for ${city}?`,
      a: `Yes. Send the details — even handwritten matter or a photo — and the desk will draft the wording and translate it into English, Hindi or another Indian language at no extra charge. You approve the proof before it prints.`,
    },
    {
      q: `How will I know the ad has been published?`,
      a: `After publication we send the e-paper page for the correct date and edition along with the GST invoice. A physical newspaper cutting can be arranged on request for legal or filing purposes.`,
    },
  ];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getNameChangeCityFromSlug(slug);
  if (!city) return { title: "Classified ads in your city" };

  const papers = getNewspapersByCity(city);
  const examples = papers.slice(0, 2).map((paper) => paper.name).join(", ");
  const description = `Book newspaper classified ads online in ${city}. ${papers.length} papers incl. ${examples}. Name change, matrimonial, property & recruitment ads. Free drafting & e-paper proof.`;

  return pageMeta({
    title: `Classified Ads in ${city} — Book Online`,
    description: description.length > 160 ? `Book newspaper classified ads online in ${city}. ${papers.length} papers incl. ${examples}. Matrimonial, property & public notices. Free drafting.` : description,
    path: `/newspaper-classified/${slug}`,
    keywords: [
      `classified ads in ${city}`,
      `newspaper ad in ${city}`,
      `classified advertisement ${city}`,
      `book newspaper ad online ${city}`,
      `matrimonial ad ${city}`,
      `name change ad ${city}`,
      `property classified ${city}`,
      `public notice ${city}`,
    ],
  });
}

export default async function ClassifiedCityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = getNameChangeCityFromSlug(slug);
  if (!city) notFound();

  const papers = getNewspapersByCity(city);
  const displayCity = cityDisplayName(city);
  const languages = new Set(papers.map((paper) => paper.language));
  const faqItems = cityFaqs(city, papers.length, papers.map((paper) => paper.name));
  const shownPapers = papers.slice(0, 15);
  const popularNameChangeHref = `/name-change/${slug}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Newspaper classified ads", path: "/newspaper-classified" },
            { name: `Classified ads in ${city}`, path: `/newspaper-classified/${slug}` },
          ]),
          webPageJsonLd({
            path: `/newspaper-classified/${slug}`,
            name: `Classified ads in ${city}`,
            description: `Book newspaper classified ads in ${city} — ${papers.length} papers covering the city across ${languages.size} languages.`,
          }),
          serviceJsonLd({
            name: `Newspaper classified advertisement booking in ${city}`,
            description: `Online booking for text classified, classified display and main-page display ads in ${city} newspapers.`,
            path: `/newspaper-classified/${slug}`,
            category: "Newspaper classified advertising",
            serviceType: "Newspaper classified and display advertising",
            areaServed: [city],
          }),
          itemListJsonLd({
            name: `Newspapers covering ${city}`,
            items: papers.map((paper) => ({
              name: paper.name,
              path: `/newspapers/${paper.slug}`,
            })),
          }),
          faqJsonLd(faqItems),
        ]}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-xs text-charcoal sm:text-sm">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-maroon">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-line">
                /
              </li>
              <li>
                <Link href="/newspaper-classified" className="hover:text-maroon">
                  Newspaper classified ads
                </Link>
              </li>
              <li aria-hidden className="text-line">
                /
              </li>
              <li className="font-medium text-ink">Classified ads in {displayCity}</li>
            </ol>
          </nav>
        </div>
      </div>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <p className="section-kicker">Newspaper classifieds · {displayCity}</p>
          <h1 className="mt-3 font-display text-3xl leading-[1.05] text-ink sm:text-5xl">
            Classified ads in {displayCity}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-charcoal sm:text-lg">
            Book a classified advertisement in {displayCity}&apos;s English and regional newspapers —
            name change, matrimonial, property, recruitment, obituary, lost &amp; found, court and
            public notices. {papers.length} papers publish {displayCity} editions; the desk confirms
            the per-line or per-square-centimetre rate, GST and publication date before you pay.
          </p>

          <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal">
            <span className="inline-flex items-center gap-1.5">
              <FaCheckCircle className="h-4 w-4 text-maroon" aria-hidden />
              {papers.length} papers covering {displayCity}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaCheckCircle className="h-4 w-4 text-maroon" aria-hidden />
              {languages.size} languages · free drafting &amp; translation
            </span>
            <span className="inline-flex items-center gap-1.5">
              <FaCheckCircle className="h-4 w-4 text-maroon" aria-hidden />
              e-paper proof and GST invoice after print
            </span>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-primary">
              <FaPhoneAlt className="h-3.5 w-3.5" aria-hidden /> Get the live rate
            </a>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              <FaWhatsapp className="h-3.5 w-3.5" aria-hidden /> WhatsApp the desk
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="section-kicker">Newspapers in {displayCity}</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Papers you can book for {displayCity}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal">
            {papers.length} titles publish {displayCity} editions or accept bookings for {displayCity}.
            The desk confirms the exact edition, rate and next available date for each paper.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {shownPapers.map((paper) => (
              <Link
                key={paper.slug}
                href={`/newspapers/${paper.slug}`}
                className="group flex flex-col items-center justify-center gap-2 rounded-xl border border-line bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-maroon/40 hover:shadow-[0_14px_30px_rgba(200,16,46,0.1)]"
              >
                <NewspaperLogo
                  paper={paper}
                  className="h-9 max-w-[6.5rem] object-contain opacity-80 transition group-hover:opacity-100"
                />
                <span className="text-[11px] font-medium leading-tight text-charcoal group-hover:text-maroon">
                  {paper.name}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-slate">
                  {getLanguageLabel(paper.language)}
                </span>
              </Link>
            ))}
          </div>

          {papers.length > shownPapers.length ? (
            <Link
              href={`/newspapers?q=${encodeURIComponent(city)}`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:underline"
            >
              See all {papers.length} papers covering {displayCity}{" "}
              <FaArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          ) : (
            <Link
              href={`/newspapers?q=${encodeURIComponent(city)}`}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:underline"
            >
              Browse {displayCity} papers in the directory{" "}
              <FaArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          )}
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="section-kicker">What people book in {displayCity}</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Popular classified categories in {displayCity}
          </h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            {POPULAR_CLASSIFIED_CATEGORIES.map((category) => (
              <Link
                key={category.path + category.name}
                href={category.name === "Name change notice" ? popularNameChangeHref : category.path}
                className="rounded-full border border-line bg-paper px-4 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon sm:text-sm"
              >
                {category.name}
              </Link>
            ))}
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              "Compare papers covering " + displayCity,
              "Send or draft the wording",
              "Approve the proof & pay",
              "Ad prints — e-paper proof",
            ].map((step, index) => (
              <div
                key={step}
                className="rounded-xl border border-line bg-paper p-4 text-sm font-medium text-charcoal"
              >
                <span className="font-display text-lg text-maroon/80">0{index + 1}</span>
                <p className="mt-1.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper-2/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-display text-xl text-ink sm:text-3xl">
                Ready to book an ad in {displayCity}?
              </h2>
              <p className="mt-1.5 text-sm text-charcoal">
                Real rate before you pay · free drafting · {papers.length} papers available in{" "}
                {displayCity}.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={popularNameChangeHref} className="btn-primary">
                Change my name ad <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
              <Link href="/newspaper-classified" className="btn-ghost">
                All classified formats <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="section-kicker">FAQ</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Classified ads in {displayCity} — questions
          </h2>
          <div className="mt-6 divide-y divide-line border-y border-line">
            {faqItems.map((faq) => (
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
    </>
  );
}
