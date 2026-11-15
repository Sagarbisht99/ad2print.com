import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { NewspaperDirectory } from "@/components/home/NewspaperDirectory";
import { getNewspapers } from "@/lib/data";
import {
  getLanguageCounts,
  getLanguageLabel,
  getPopularNewspapers,
} from "@/lib/newspaper-content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMeta,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = {
  searchParams: Promise<{ q?: string | string[]; language?: string | string[] }>;
};

export const metadata: Metadata = pageMeta({
  title: "All Newspapers — Book Ads in 280+ Indian Papers",
  description:
    "Browse newspaper ad booking pages by title and language. See editions, available ad formats and how to book classified or display ads in each Indian newspaper.",
  path: "/newspapers",
  keywords: [
    "list of Indian newspapers",
    "newspaper ad booking",
    "English newspapers ads",
    "Hindi newspaper ads",
    "regional newspaper advertising",
    "newspaper rates by title",
    "book ads in newspaper",
  ],
});

const NEWSPAPER_FAQS = [
  {
    q: "How do I choose the right newspaper for my ad?",
    a: "Start with the reader you need to reach. A city edition is usually best for property, local business and public notices. National English papers add prestige and wider reach; regional-language papers often deliver stronger local responses for matrimonial, property and recruitment ads.",
  },
  {
    q: "Can I book more than one newspaper at once?",
    a: "Yes. Add a national and a regional paper to one order, pay once and track the bookings together. This is common for passport name-change combinations and multi-city notices.",
  },
  {
    q: "Are all editions of a newspaper available?",
    a: "Availability depends on the title and the city. Each newspaper page lists the editions we currently know about. If your city is missing, send it to the desk and we will confirm whether the paper publishes there.",
  },
  {
    q: "What is the difference between text classified and display?",
    a: "Text classified is a few lines of plain text in the classified columns. Classified display is a boxed ad, often with a logo or photo, inside the classified pages. Main-page display appears alongside news and is priced by page, position, size and colour.",
  },
  {
    q: "Do you provide proof after publication?",
    a: "Yes. After the ad prints, we send the e-paper page for the correct date and edition, plus the GST invoice. A physical cutting can be arranged on request.",
  },
];

export default async function NewspapersPage({ searchParams }: Props) {
  const resolved = await searchParams;
  const rawQuery = Array.isArray(resolved.q) ? resolved.q[0] : resolved.q;
  const rawLanguage = Array.isArray(resolved.language) ? resolved.language[0] : resolved.language;
  const query = rawQuery?.trim() ?? "";
  const language = rawLanguage && rawLanguage !== "All" ? rawLanguage : "All";

  const papers = [...getNewspapers()].sort((a, b) => a.name.localeCompare(b.name));
  const languages = getLanguageCounts();
  const popular = getPopularNewspapers(12);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Newspapers", path: "/newspapers" },
          ]),
          webPageJsonLd({
            path: "/newspapers",
            name: "Indian newspapers for ad booking",
            description:
              "Directory of Indian newspapers with edition counts, languages, ad formats and booking links.",
          }),
          faqJsonLd(NEWSPAPER_FAQS),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Newspapers for advertising in India",
            url: absoluteUrl("/newspapers"),
            mainEntity: {
              "@type": "ItemList",
              numberOfItems: papers.length,
              itemListElement: papers.map((paper, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: paper.name,
                url: absoluteUrl(`/newspapers/${paper.slug}`),
              })),
            },
          },
        ]}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-xs text-charcoal">
            <Link href="/" className="hover:text-maroon">
              Home
            </Link>
            <span className="mx-2 text-line">/</span>
            <span className="font-medium text-ink">Newspapers</span>
          </nav>

          <p className="section-kicker mt-8">Newspaper directory</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.04] text-ink sm:text-6xl">
            Book ads in any Indian newspaper
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-charcoal sm:text-lg">
            Browse the {papers.length} titles listed here across {languages.length} languages. Our
            wider booking network covers 280+ newspapers and 15 Indian languages. Open a paper to
            see its city editions, accepted ad formats and the route to a confirmed rate. Need a
            title that is not listed? Call the desk — we can usually still book it.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="btn-primary"
            >
              Call the desk
            </a>
            <Link href="/categories" className="btn-ghost">
              Browse categories <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <NewspaperDirectory
          papers={papers}
          initialQuery={query}
          initialLanguage={language}
        />

        <section className="mt-16 border-t border-line pt-12">
          <p className="section-kicker">By language</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Choose a newspaper language
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal">
            Regional and language dailies are where many local ads actually convert. A
            regional-language paper can be more effective than an English-only booking for
            matrimonial, property, recruitment and public notices.
          </p>
          <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {languages.map(({ language: item, count }) => (
              <Link
                key={item}
                href={`/newspapers?language=${encodeURIComponent(item)}`}
                className="flex items-center justify-between rounded-xl border border-line bg-white px-4 py-3 text-sm transition hover:border-maroon/35 hover:text-maroon"
              >
                <span className="font-semibold text-ink">
                  {getLanguageLabel(item)} newspapers
                </span>
                <span className="text-xs text-charcoal">{count} titles →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-line pt-12">
          <p className="section-kicker">Popular titles</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Most-booked newspapers
          </h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {popular.map((paper) => (
              <Link
                key={paper.slug}
                href={`/newspapers/${paper.slug}`}
                className="rounded-full border border-line bg-white px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
              >
                {paper.name}
              </Link>
            ))}
            <Link
              href="/categories"
              className="rounded-full border border-maroon/30 bg-maroon/[0.04] px-3.5 py-2 text-xs font-semibold text-maroon"
            >
              Browse ad categories
            </Link>
          </div>
        </section>

        <section className="mt-16 border-t border-line pt-12">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="section-kicker">Questions</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
                Newspaper booking FAQ
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal">
                Desk hours: {SITE.hours}. {SITE.cutoff}.
              </p>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {NEWSPAPER_FAQS.map((faq) => (
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
      </div>
    </>
  );
}
