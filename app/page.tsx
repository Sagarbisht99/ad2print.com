import type { Metadata } from "next";
import { AdFormats } from "@/components/home/AdFormats";
import { CategoriesGrid } from "@/components/home/CategoriesGrid";
import { FaqSection, CtaBand } from "@/components/home/FaqSection";
import { Hero } from "@/components/home/Hero";
import { LanguagesCities, NewspapersPreview } from "@/components/home/LanguagesCities";
import {
  DeadlinesServices,
  GuideSection,
  HowItWorks,
  WhoBooks,
  WhyFeatures,
} from "@/components/home/Sections";
import { StatsBar } from "@/components/home/StatsBar";
import { Testimonials } from "@/components/home/Testimonials";
import { WhyChooseUs } from "@/components/WhyChooseUs";
import { JsonLd } from "@/components/JsonLd";
import { FAQS } from "@/lib/content";
import { faqJsonLd, pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Book Newspaper Ads Online India",
  description:
    "Book classified and display ads in 280+ Indian newspapers. Name change, matrimonial, property, notices — live rates, free drafting, proof before print.",
  path: "/",
  keywords: [
    "book newspaper ads online",
    "classified ads India",
    "newspaper advertising",
    "matrimonial ads",
    "name change notice",
    "AD2PRINT",
  ],
});

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(FAQS)} />
      <Hero />
      <AdFormats />
      <CategoriesGrid />
      <StatsBar />
      <NewspapersPreview />
      <WhyChooseUs />
      <div className="h-16 bg-white sm:h-20" aria-hidden />
      <WhoBooks />
      <LanguagesCities />
      <HowItWorks />
      <GuideSection />
      <DeadlinesServices />
      <WhyFeatures />
      <Testimonials />
      <FaqSection />
      <CtaBand />
    </>
  );
}
