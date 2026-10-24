import type { Metadata } from "next";
import { FaqSection, CtaBand } from "@/components/home/FaqSection";
// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Hero kept in code, will be re-enabled later
import { Hero } from "@/components/home/Hero";
import { DeadlinesServices } from "@/components/home/Sections";
import { StatsBar } from "@/components/home/StatsBar";
import { Testimonials } from "@/components/home/Testimonials";
import { JsonLd } from "@/components/JsonLd";
import { NameChangeBanner } from "@/components/name-change/NameChangeBanner";
import {
  NameChangeHome,
  NAME_CHANGE_FAQS,
  NAME_CHANGE_HOW_TO_STEPS,
} from "@/components/name-change/NameChangeHome";
import { FAQS } from "@/lib/content";
import { faqJsonLd, howToJsonLd, pageMeta, serviceJsonLd, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Book Newspaper Ads Online India",
  description:
    "Book classified and display ads in 280+ Indian newspapers. Name change, matrimonial, property, notices — free drafting, proof after print.",
  path: "/",
  image: "/ads/name-change-banner.png",
  imageAlt:
    "Change of name ad in newspaper: choose your city, choose newspaper, fill your details, pay online. Need help, call 79829 36243. For Gazette of India, passport, Aadhaar and PAN.",
  keywords: [
    "name change newspaper ad",
    "change of name notice India",
    "name change advertisement for passport",
    "Aadhaar name change newspaper ad",
    "PAN name change classified",
    "gazette name change newspaper notice",
    "naam parivartan newspaper ad",
    "book name change ad online",
    "name change classified AD2PRINT",
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
      <JsonLd
        data={[
          faqJsonLd(FAQS),
          serviceJsonLd({
            name: "Change of Name newspaper advertisement",
            description:
              "Book a name change classified in national and regional Indian newspapers, with drafting and publication proof.",
            path: "/",
          }),
          howToJsonLd({
            name: "How to publish a name change newspaper ad",
            description:
              "Draft a change of name notice online and publish it in an Indian newspaper for passport, Aadhaar, PAN, bank or gazette records.",
            url: absoluteUrl("/"),
            steps: NAME_CHANGE_HOW_TO_STEPS,
          }),
          faqJsonLd(NAME_CHANGE_FAQS),
        ]}
      />
      {/* Hero kept in code, hidden for now */}
      {/* <Hero /> */}
      <NameChangeBanner />
      <NameChangeHome />
      <StatsBar />
      <DeadlinesServices />
      <Testimonials />
      <FaqSection />
      <CtaBand />
    </>
  );
}
