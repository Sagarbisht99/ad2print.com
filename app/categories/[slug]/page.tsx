import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { Suspense } from "react";
import { FaArrowRight, FaCheckCircle, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { CategoryCityHint } from "@/components/CategoryCityHint";
import { CategoryDetailSections } from "@/components/category/CategoryDetailSections";
import { CategoryIcon } from "@/components/CategoryIcon";
import { JsonLd } from "@/components/JsonLd";
import { CATEGORY_CONTENT, CATEGORY_STEPS, type CategoryContent } from "@/lib/category-content";
import { getCategoryRoute } from "@/lib/category-routes";
import { getCategories, getCategory } from "@/lib/data";
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

export async function generateStaticParams() {
  return getCategories()
    .filter((category) => !getCategoryRoute(category.slug))
    .map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Newspaper ad category" };
  const content = getCategoryContent(slug);
  const route = getCategoryRoute(slug);

  return pageMeta({
    title: content?.metaTitle ?? `${category.name} Newspaper Ads`,
    description: content?.metaDescription ?? category.description,
    path: route?.href ?? `/categories/${category.slug}`,
    keywords: content?.keywords ?? [
      `${category.name} newspaper ad`,
      `${category.name} classifieds India`,
      "AD2PRINT",
    ],
    noIndex: Boolean(route),
  });
}

function getCategoryContent(slug: string) {
  return CATEGORY_CONTENT[slug];
}

function fallbackContent(name: string, description: string): CategoryContent {
  return {
    metaTitle: `${name} Newspaper Ads`,
    metaDescription: description,
    h1: `${name} Newspaper Ads`,
    eyebrow: "Newspaper advertising",
    intro: [description],
    priceNote:
      "The rate depends on the newspaper, edition and ad size. Send the wording and city and the desk will confirm the live rate including GST.",
    highlights: [
      "English and regional language papers",
      "Free drafting and translation",
      "Proof after publication",
      "GST invoice included",
    ],
    formats: [
      { name: "Text classified", text: "A short text notice in the classified columns." },
      { name: "Classified display", text: "A boxed ad with a logo, photo or larger type." },
      { name: "Main-page display", text: "A larger display ad alongside news." },
    ],
    faqs: [
      {
        q: `How do I book a ${name.toLowerCase()} newspaper ad?`,
        a: "Choose the newspaper and city, send the wording, approve the proof and pay online. The desk confirms the rate before you pay.",
      },
    ],
    keywords: [`${name} newspaper ad`, `${name} classifieds India`, "AD2PRINT"],
    related: [],
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const route = getCategoryRoute(slug);
  if (route) permanentRedirect(route.href);

  const category = getCategory(slug);
  if (!category) notFound();

  const content = getCategoryContent(slug) ?? fallbackContent(category.name, category.description);
  const subtypes = "subtypes" in category ? (category.subtypes as string[] | undefined) : undefined;
  const path = `/categories/${category.slug}`;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Categories", path: "/categories" },
            { name: `${category.name} newspaper ads`, path },
          ]),
          webPageJsonLd({
            path,
            name: `${category.name} newspaper ads`,
            description: content.metaDescription,
          }),
          serviceJsonLd({
            name: `${category.name} newspaper advertisement`,
            description: content.metaDescription,
            path,
            category: category.name,
            serviceType: `${category.name} newspaper classified and display advertising`,
          }),
          faqJsonLd(content.faqs),
          howToJsonLd({
            name: `How to book a ${category.name.toLowerCase()} newspaper ad`,
            description: content.metaDescription,
            url: absoluteUrl(path),
            steps: CATEGORY_STEPS,
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
            <Link href="/categories" className="hover:text-maroon">
              Categories
            </Link>
            <span className="mx-2 text-line">/</span>
            <span className="font-medium text-ink">{category.name}</span>
          </nav>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ background: `${category.tint}18`, color: category.tint }}
                >
                  <CategoryIcon name={category.icon} className="h-6 w-6" />
                </span>
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                  {content.eyebrow}
                </p>
              </div>

              <h1 className="mt-5 font-display text-4xl leading-[1.04] text-ink sm:text-6xl">
                {content.h1}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal sm:text-lg">
                {content.intro[0]}
              </p>
              {content.intro[1] ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
                  {content.intro[1]}
                </p>
              ) : null}

              <Suspense fallback={null}>
                <CategoryCityHint categoryName={category.name} />
              </Suspense>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/contact" className="btn-primary">
                  Start this booking <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="btn-ghost"
                >
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
            </div>

            <aside className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                What it costs
              </p>
              <p className="mt-3 text-sm leading-relaxed text-charcoal">{content.priceNote}</p>

              <div className="mt-6 border-t border-line pt-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate">
                  At a glance
                </p>
                <dl className="mt-3 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-xs text-charcoal">Formats</dt>
                    <dd className="text-right text-xs font-semibold text-ink">
                      Classified, display &amp; more
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-xs text-charcoal">Languages</dt>
                    <dd className="text-right text-xs font-semibold text-ink">15 Indian languages</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-xs text-charcoal">Drafting</dt>
                    <dd className="text-right text-xs font-semibold text-ink">Free</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-xs text-charcoal">Proof</dt>
                    <dd className="text-right text-xs font-semibold text-ink">e-paper after print</dd>
                  </div>
                  <div className="flex items-start justify-between gap-4">
                    <dt className="text-xs text-charcoal">GST invoice</dt>
                    <dd className="text-right text-xs font-semibold text-ink">Included</dd>
                  </div>
                </dl>
              </div>

              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0b6b37]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0b6b37] transition hover:border-[#0b6b37]/50"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden /> Ask for the live rate
              </a>
            </aside>
          </div>
        </div>
      </div>

      <CategoryDetailSections
        category={category}
        content={content}
        subtypes={subtypes}
        ctaHref={getCategoryRoute(category.slug)?.href ?? "/contact"}
        ctaLabel={getCategoryRoute(category.slug)?.label ?? "Start booking"}
      />
    </>
  );
}
