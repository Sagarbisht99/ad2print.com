import Link from "next/link";
import { FaArrowRight, FaWhatsapp } from "react-icons/fa";
import { NewspaperLogo } from "@/components/NewspaperWall";
import {
  CATEGORY_STEPS,
  type CategoryContent,
} from "@/lib/category-content";
import { getCategoryHref } from "@/lib/category-routes";
import {
  getCategories,
  getCities,
  getNewspapersByCity,
  slugifyCity,
  type Category,
} from "@/lib/data";
import { getLanguageCounts, getLanguageLabel, getPopularNewspapers } from "@/lib/newspaper-content";
import { SITE } from "@/lib/site";

type Props = {
  category: Category;
  content: CategoryContent;
  subtypes?: string[];
  faqs?: readonly { q: string; a: string }[];
  ctaHref?: string;
  ctaLabel?: string;
  ctaTitle?: string;
  ctaText?: string;
};

/**
 * The long-form sections shared by /categories/[slug] and the dedicated
 * landing pages (/matrimonial, /tender-notice, /change-my-name). Keeping one
 * implementation ensures every route shows the same formats, process,
 * newspapers, cities, FAQ and related-service components.
 */
export function CategoryDetailSections({
  category,
  content,
  subtypes,
  faqs,
  ctaHref = "/contact",
  ctaLabel = "Start booking",
  ctaTitle,
  ctaText,
}: Props) {
  const categories = getCategories();
  const related = content.related
    .map((relatedSlug) => categories.find((item) => item.slug === relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const papers = getPopularNewspapers(9);
  const cities = getCities().slice(0, 24);
  const languageCounts = getLanguageCounts().slice(0, 8);
  const displayFaqs = faqs ?? content.faqs;

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <section>
        <p className="section-kicker">Formats</p>
        <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
          How a {category.name.toLowerCase()} ad is published
        </h2>
        <div className="mt-7 grid gap-4 md:grid-cols-3">
          {content.formats.map((format) => (
            <div key={format.name} className="rounded-xl border border-line bg-white p-5">
              <h3 className="font-display text-lg text-ink">{format.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal">{format.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate">
          The newspaper confirms the minimum size and line count for this category. The desk checks
          it before sending the proof.
        </p>
      </section>

      {subtypes && subtypes.length > 0 ? (
        <section id="notice-types" className="mt-14 scroll-mt-24 border-t border-line pt-12">
          <p className="section-kicker">Notice types</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Common {category.name.toLowerCase()} formats
          </h2>
          <ul className="mt-7 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {subtypes.map((subtype) => (
              <li
                key={subtype}
                id={subtype.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                className="scroll-mt-28 rounded-lg border border-line bg-white px-4 py-3 text-sm text-charcoal"
              >
                {subtype}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-14 border-t border-line pt-12">
        <p className="section-kicker">Process</p>
        <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
          Four steps from wording to print
        </h2>
        <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORY_STEPS.map((step, index) => (
            <li key={step.name} className="rounded-xl border border-line bg-paper p-5">
              <span className="font-display text-3xl text-maroon/80">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-2 font-display text-lg text-ink">{step.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-charcoal">{step.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 border-t border-line pt-12">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="section-kicker">Newspapers</p>
            <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
              Popular papers for this ad
            </h2>
          </div>
          <Link
            href="/newspapers"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:underline"
          >
            All newspapers <FaArrowRight className="h-3 w-3" aria-hidden />
          </Link>
        </div>

        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map((paper) => (
            <Link
              key={paper.slug}
              href={`/newspapers/${paper.slug}`}
              className="group flex items-center gap-4 rounded-xl border border-line bg-white p-4 transition hover:border-maroon/35 hover:shadow-[0_12px_28px_rgba(26,26,26,0.07)]"
            >
              <span className="flex h-10 w-24 shrink-0 items-center">
                <NewspaperLogo paper={paper} />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold text-ink group-hover:text-maroon">
                  {paper.name}
                </span>
                <span className="mt-0.5 block text-[10px] uppercase tracking-[0.1em] text-charcoal">
                  {paper.language} · {paper.cities.length} editions
                </span>
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-charcoal">
          <span className="font-semibold text-ink">Available in:</span>
          {languageCounts.map(({ language, count }) => (
            <span key={language} className="rounded-full border border-line bg-white px-2.5 py-1">
              {getLanguageLabel(language)} ({count})
            </span>
          ))}
        </div>
      </section>

      <section className="mt-14 border-t border-line pt-12">
        <p className="section-kicker">Cities</p>
        <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
          Book this ad city by city
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal">
          City editions reach local readers at a lower rate than a national run. Open a city to see
          the newspapers available for it.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {cities.map((city) => (
            <Link
              key={city}
              href={
                category.slug === "change-of-name"
                  ? `/name-change/${slugifyCity(city)}`
                  : `/newspapers?q=${encodeURIComponent(city)}`
              }
              className="rounded-full border border-line bg-white px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
            >
              {city}
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs text-slate">
          Example: {getNewspapersByCity(cities[0] ?? "Delhi").length} newspapers list a{" "}
          {cities[0] ?? "Delhi"} edition.
        </p>
      </section>

      <section id="faq" className="mt-14 scroll-mt-24 border-t border-line pt-12">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <div>
            <p className="section-kicker">Questions</p>
            <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
              {category.name} newspaper ad FAQ
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal">
              Still unsure? Call the desk on{" "}
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="font-semibold text-maroon hover:underline"
              >
                {SITE.phone}
              </a>{" "}
              or send a WhatsApp message. We reply during desk hours.
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {displayFaqs.map((faq) => (
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

      {related.length > 0 ? (
        <section className="mt-14 border-t border-line pt-12">
          <p className="section-kicker">Related services</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Other ads people book together
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={getCategoryHref(item.slug)}
                className="group rounded-xl border border-line bg-white p-5 transition hover:border-maroon/35"
              >
                <span className="font-display text-lg text-ink group-hover:text-maroon">
                  {item.name}
                </span>
                <span className="mt-1 block text-xs leading-relaxed text-charcoal">
                  {item.short}
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mt-14 rounded-2xl bg-ink px-6 py-9 text-white sm:px-10 sm:py-11">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl">
              {ctaTitle ?? `Ready to book your ${category.name.toLowerCase()} ad?`}
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-paper/70">
              {ctaText ??
                "Send the wording and city. We will confirm the paper, edition, size and final rate including GST before anything goes to print."}
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-xl bg-maroon px-5 py-3 text-sm font-bold text-white transition hover:bg-maroon-deep"
            >
              {ctaLabel} <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
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
  );
}
