import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { CtaBand, FaqSection } from "@/components/home/FaqSection";
import { HomeHero } from "@/components/home/HomeHero";
import {
  CategoryGrid,
  CostAndTiming,
  HomeCategoryLinks,
  HowItWorks,
  RatesCta,
  ServiceHighlights,
  StatutoryNotices,
  WhyChoose,
  WhyFeatures,
} from "@/components/home/HomeSections";
import { NewspaperDirectory } from "@/components/home/NewspaperDirectory";
import { PaperRanking } from "@/components/home/PaperRanking";
import { StatsBar } from "@/components/home/StatsBar";
import { Testimonials } from "@/components/home/Testimonials";
import { getCategoriesOrdered, getCities, getNewspapers } from "@/lib/data";
import { getCategoryHref } from "@/lib/category-routes";
import { buildRankingCatalog } from "@/lib/paper-ranking";
import { FAQS } from "@/lib/content";
import {
  absoluteUrl,
  faqJsonLd,
  howToJsonLd,
  pageMeta,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Book Newspaper Ads Online — 280+ Indian Newspapers",
  description:
    "Book classified and display ads in 280+ Indian newspapers online — matrimonial, name change, property, recruitment and public notices.",
  path: "/",
  image: "/og/ad2print-1200x630.png",
  imageAlt:
    "Book newspaper ads online with AD2PRINT — choose a category, newspaper and city, then publish with proof.",
  keywords: [
    "book newspaper ads online",
    "newspaper advertisement booking India",
    "classified ads online",
    "newspaper ad rates",
    "name change newspaper ad",
    "matrimonial newspaper ad",
    "property classified ad",
    "recruitment newspaper ad",
    "statutory notice newspaper",
    "public notice newspaper",
    "regional language newspaper ads",
    "AD2PRINT",
  ],
});

const HOME_HOW_TO_STEPS = [
  {
    name: "Choose a category",
    text: "Pick name change, matrimonial, property, recruitment, a statutory notice or another newspaper ad category.",
  },
  {
    name: "Pick the newspaper and city",
    text: "Choose the national or regional paper and the city edition that reaches the readers you need.",
  },
  {
    name: "Draft or upload the matter",
    text: "Write the ad yourself, upload a document, or ask the desk to draft and translate it for free.",
  },
  {
    name: "Approve, pay and publish",
    text: "Approve the proof, confirm the date and pay online. The ad prints after editorial approval and you get the e-paper proof.",
  },
];

export default function HomePage() {
  const categories = getCategoriesOrdered();
  const cities = getCities();
  const papers = [...getNewspapers()].sort((a, b) => a.name.localeCompare(b.name));
  const rankingCatalog = buildRankingCatalog();

  return (
    <>
      <JsonLd
        data={[
          webPageJsonLd({
            path: "/",
            name: "Book Newspaper Ads Online in India",
            description:
              "Book classified and display ads in 280+ Indian newspapers with free drafting, live rates and publication proof.",
          }),
          faqJsonLd(FAQS),
          serviceJsonLd({
            name: "Newspaper advertisement booking",
            description:
              "Online booking for classified, classified display and main-page display ads in national and regional Indian newspapers, with drafting, translation and publication proof.",
            path: "/",
          }),
          howToJsonLd({
            name: "How to book a newspaper ad online",
            description:
              "Choose a category, newspaper and city, draft the matter, approve the proof and pay online to publish your newspaper advertisement.",
            url: absoluteUrl("/"),
            steps: HOME_HOW_TO_STEPS,
          }),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Newspaper advertising categories",
            itemListElement: categories.map((category, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${category.name} newspaper ads`,
              url: absoluteUrl(getCategoryHref(category.slug)),
            })),
          },
        ]}
      />

      <HomeHero
        categories={categories.map(({ slug, name }) => ({ slug, name }))}
        cities={cities}
      />

      <StatsBar />

      <CategoryGrid />

      <CostAndTiming />

      <PaperRanking catalog={rankingCatalog} />

      <ServiceHighlights />

      <StatutoryNotices />

      <section id="newspapers" className="scroll-mt-24 border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="section-kicker">280 newspapers · 15 languages</p>
              <h2 className="mt-3 font-display text-3xl text-ink sm:text-5xl">
                Book any paper — national or regional
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
                Regional and language dailies are where most local ads actually convert. Search
                yours, filter by language, or open a paper to see its editions and formats.
              </p>
            </div>
            <Link
              href="/newspapers"
              className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-maroon hover:underline"
            >
              All newspapers <FaArrowRight className="h-3 w-3" aria-hidden />
            </Link>
          </div>

          <div className="mt-8">
            <NewspaperDirectory papers={papers} scrollable maxHeight={620} />
          </div>
        </div>
      </section>

      <WhyFeatures />

      <HowItWorks />

      <WhyChoose />

      <RatesCta />

      <Testimonials />

      <FaqSection />

      <CtaBand />

      <HomeCategoryLinks categories={categories} />
    </>
  );
}
