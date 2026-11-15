import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { CategoryIcon } from "@/components/CategoryIcon";
import { JsonLd } from "@/components/JsonLd";
import { getCategoryHref } from "@/lib/category-routes";
import { getCategories } from "@/lib/data";
import { breadcrumbJsonLd, absoluteUrl, pageMeta, webPageJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Newspaper Ad Categories — All Services",
  description:
    "Browse every newspaper ad category AD2PRINT books — name change, matrimonial, property, recruitment, obituary, lost & found, court and statutory notices.",
  path: "/categories",
  keywords: [
    "newspaper ad categories",
    "types of newspaper advertisements",
    "matrimonial newspaper ad",
    "name change notice",
    "property classifieds",
    "recruitment newspaper ad",
    "statutory notice newspaper",
    "public notice categories",
  ],
});

const CHOOSE_FACTORS = [
  {
    title: "What the receiver needs",
    text: "A passport office, bank, registrar or court often specifies the notice type and the language. Start from that requirement, not from the cheapest format.",
  },
  {
    title: "Who you want to reach",
    text: "A local buyer reads the city edition. A family looking for a matrimonial match may read the Sunday paper. Match the category and edition to the audience.",
  },
  {
    title: "How much space you need",
    text: "Text classifieds suit short notices. Classified display and main-page display are better when you need a logo, photograph, map or detailed offer.",
  },
];

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Categories", path: "/categories" },
          ]),
          webPageJsonLd({
            path: "/categories",
            name: "Newspaper ad categories and services",
            description:
              "Browse all newspaper advertising categories, formats and notice types available through AD2PRINT.",
          }),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Newspaper Ad Categories",
            url: absoluteUrl("/categories"),
            hasPart: categories.map((category) => ({
              "@type": "WebPage",
              name: `${category.name} newspaper ads`,
              url: absoluteUrl(getCategoryHref(category.slug)),
            })),
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
            <span className="font-medium text-ink">Categories</span>
          </nav>

          <p className="section-kicker mt-8">Services &amp; categories</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl leading-[1.04] text-ink sm:text-6xl">
            Every newspaper ad category, in one place
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-charcoal sm:text-lg">
            Choose a category to see the formats newspapers accept, how the ad is priced, which
            editions work best and the questions advertisers ask before booking. Every category can
            run in English or a regional language, with drafting and publication proof included.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/newspapers" className="btn-primary">
              Browse newspapers <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
            <Link href="/contact" className="btn-ghost">
              Ask the desk
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
        <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={getCategoryHref(cat.slug)}
              className="group relative flex flex-col items-start rounded-xl border border-line bg-white p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-maroon/45 hover:shadow-[0_16px_36px_rgba(178,31,45,0.1)] sm:p-5"
            >
              {cat.popular ? (
                <span className="absolute right-3 top-3 text-[9px] font-bold uppercase tracking-[0.14em] text-maroon sm:text-[10px]">
                  Popular
                </span>
              ) : null}
              <span
                className="flex h-12 w-12 items-center justify-center rounded-lg transition duration-200 group-hover:scale-105 sm:h-14 sm:w-14"
                style={{ background: `${cat.tint}18`, color: cat.tint }}
              >
                <CategoryIcon name={cat.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <span className="mt-4 font-display text-base leading-snug text-ink group-hover:text-maroon sm:text-lg">
                {cat.name}
              </span>
              <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-charcoal sm:text-sm">
                {cat.short}
              </span>
              <span className="mt-auto pt-4 text-xs font-semibold text-maroon sm:text-sm">
                View formats &amp; book
                <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-16 grid gap-10 border-t border-line pt-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="section-kicker">How to choose</p>
            <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
              Pick the category that fits the purpose
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal sm:text-base">
              Most bookings are decided by three things: what the receiving office will accept, who
              needs to see the notice, and how much space the message needs. If you are unsure, send
              the requirement to the desk — we will suggest a category, paper and edition before you
              pay.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-charcoal">
              Desk hours: {SITE.hours}. {SITE.cutoff}.
            </p>
          </div>
          <div className="space-y-4">
            {CHOOSE_FACTORS.map((factor) => (
              <div key={factor.title} className="rounded-xl border border-line bg-white p-5">
                <h3 className="font-display text-lg text-ink">{factor.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{factor.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
