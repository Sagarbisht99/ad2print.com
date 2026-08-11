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

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <WhyChooseUs />
      <div className="h-16 bg-white sm:h-20" aria-hidden />
      <WhoBooks />
      <AdFormats />
      <CategoriesGrid />
      <LanguagesCities />
      <NewspapersPreview />
      <HowItWorks />
      <GuideSection />
      <DeadlinesServices />
      <WhyFeatures />
      <Testimonials />
      <FaqSection limit={6} />
      <CtaBand />
    </>
  );
}
