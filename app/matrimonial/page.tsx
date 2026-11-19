import type { Metadata } from "next";
import Link from "next/link";
import { CategoryDetailSections } from "@/components/category/CategoryDetailSections";
import { BookEnquiryButton } from "@/components/BookEnquiryButton";
import { JsonLd } from "@/components/JsonLd";
import { NewspaperLogo } from "@/components/NewspaperWall";
import { CATEGORY_CONTENT } from "@/lib/category-content";
import { getCategory } from "@/lib/data";
import { getMatrimonialGroups } from "@/lib/matrimonial";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
  offerCatalogJsonLd,
  pageMeta,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "Matrimonial Newspaper Ads — Book Online",
  description:
    "Book bride wanted / groom wanted matrimonial ads in Times of India, Hindustan Times, Dainik Jagran and other leading papers. Free drafting, Sunday editions.",
  path: "/matrimonial",
  keywords: [
    "matrimonial ad in newspaper",
    "book matrimonial ad online",
    "bride wanted newspaper ad",
    "groom wanted newspaper ad",
    "times of india matrimonial ad",
    "hindustan times matrimonial ad",
    "matrimony advertisement Delhi",
    "matrimonial classified ad India",
    "Sunday matrimonial classified",
  ],
});

const MATRIMONIAL_FAQS = [
  {
    q: "When do matrimonial ads get published?",
    a: "Most newspapers publish matrimonial classifieds in their Sunday edition. The desk confirms the exact publishing date for your chosen paper before the ad is booked.",
  },
  {
    q: "What should the matrimonial ad contain?",
    a: "Write one or two lines about the bride or groom: age, height, education, occupation, family background and the contact details you want printed. We can also help draft the wording for you.",
  },
  {
    q: "How is the matrimonial ad price calculated on wording?",
    a: "Every package rate covers up to 5 lines of ad matter. Each additional line adds 20% of the package rate. Add-ons such as background colour (20%), screen or border (12%) and tick (12%) are charged on top. The desk confirms the final amount on WhatsApp before publication.",
  },
  {
    q: "What are the 2+2 and 3+3 schemes?",
    a: "2+2 means you pay for 2 ads and get 2 more free (4 ads total). 3+3 means you pay for 3 ads and get 3 more free (6 ads total). The same wording and add-ons are used for every insertion, and the desk confirms the dates for the free ads.",
  },
  {
    q: "Are the package rates inclusive of GST?",
    a: "No. The package rate is shown before taxes. GST is added and the desk confirms the final amount on WhatsApp before publication.",
  },
  {
    q: "Can I book more than one newspaper together?",
    a: "Yes. Packages marked as a pair cover two papers in one booking, which is usually better value than booking each paper separately.",
  },
];

const ALL_FAQS = [...MATRIMONIAL_FAQS, ...CATEGORY_CONTENT.matrimonial.faqs];

const MATRIMONIAL_STEPS = [
  {
    name: "Pick a package",
    text: "Choose a Times of India or Hindustan Times package and check which newspapers and cities it covers.",
  },
  {
    name: "Send the profile details",
    text: "Share age, height, education, occupation, family background and the contact details to print.",
  },
  {
    name: "Approve the proof",
    text: "The desk drafts the profile, confirms the publishing date and sends the proof for your approval.",
  },
  {
    name: "Pay and publish",
    text: "Confirm the wording and date on WhatsApp, then receive the e-paper page after the ad prints.",
  },
];

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function MatrimonialPage() {
  const groups = getMatrimonialGroups();
  const category = getCategory("matrimonial");
  const content = CATEGORY_CONTENT.matrimonial;
  const packageCount = groups.reduce((total, group) => total + group.packages.length, 0);
  const offers = groups
    .flatMap((group) => group.packages)
    .filter((pkg) => typeof pkg.rate === "number" && pkg.rate > 0)
    .slice(0, 60)
    .map((pkg) => ({
      name: `${pkg.name} — ${pkg.papers.map((paper) => paper.name).join(" + ")}`,
      price: pkg.rate ?? 0,
      path: "/matrimonial",
      description: `${pkg.label} · ${pkg.cities} · up to 5 lines`,
    }));

  if (!category) return null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Matrimonial newspaper ads", path: "/matrimonial" },
          ]),
          webPageJsonLd({
            path: "/matrimonial",
            name: "Book Matrimonial Ad in Newspaper Online",
            description:
              "Pick a matrimonial package from leading Indian newspapers — the desk confirms wording and publication date. Bride wanted and groom wanted classifieds.",
          }),
          serviceJsonLd({
            name: "Matrimonial newspaper advertisement",
            description:
              "Book bride wanted or groom wanted classified ads in leading Indian newspapers, with drafting help and publication proof.",
            path: "/matrimonial",
            category: "Matrimonial",
            serviceType: "Matrimonial newspaper classified advertising",
          }),
          faqJsonLd(ALL_FAQS),
          offerCatalogJsonLd({
            name: "Matrimonial newspaper ad packages",
            offers,
          }),
          howToJsonLd({
            name: "How to book a matrimonial newspaper ad",
            description:
              "Choose a package, send the bride or groom profile, approve the proof and the desk publishes the matrimonial ad.",
            url: absoluteUrl("/matrimonial"),
            steps: MATRIMONIAL_STEPS,
          }),
        ]}
      />

      <div id="packages" className="mx-auto max-w-7xl scroll-mt-24 px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-10">
        <nav aria-label="Breadcrumb" className="text-xs text-charcoal">
          <Link href="/" className="hover:text-maroon">
            Home
          </Link>
          <span className="mx-2 text-line">/</span>
          <span className="font-medium text-ink">Matrimonial newspaper ads</span>
        </nav>

        <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
          <div>
            <p className="section-kicker">Matrimonial newspaper ads</p>
            <h1 className="mt-2 font-display text-2xl font-bold text-ink sm:text-4xl">
              Book a bride wanted / groom wanted ad
            </h1>
            <p className="mt-2 max-w-xl text-xs leading-relaxed text-charcoal sm:text-sm">
              Sunday &amp; weekday editions · free drafting &amp; translation · 2+2 and 3+3 schemes ·
              e-paper proof after print · GST extra
            </p>
          </div>
          <p className="text-xs text-charcoal">
            {packageCount} packages · up to 5 lines included · GST extra
          </p>
        </div>

        <div className="mt-6 space-y-10">
          {groups.map((group) => (
            <section key={group.id} aria-labelledby={`matrimonial-group-${group.id}`}>
              <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-[0_10px_30px_rgba(26,27,30,0.05)]">
                <div className="border-b border-line bg-paper px-4 py-3 sm:px-5">
                  <h3
                    id={`matrimonial-group-${group.id}`}
                    className="font-display text-base font-bold text-maroon sm:text-lg"
                  >
                    {group.title}
                  </h3>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 bg-charcoal/90 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-white sm:px-5">
                  <span>Select a package</span>
                  <span className="text-white/70">
                    {group.packages.length} package{group.packages.length === 1 ? "" : "s"}
                  </span>
                </div>

                <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-3">
                  {group.packages.map((pkg) => (
                    <article
                      key={pkg.id}
                      className={`relative flex h-full flex-col overflow-hidden rounded-lg border transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(26,27,30,0.1)] ${
                        pkg.bestSeller
                          ? "border-[#E3A64A] bg-[#FFF8EC] hover:border-[#C98A2A]"
                          : "border-line bg-white hover:border-maroon/40"
                      }`}
                    >
                      {pkg.bestSeller ? (
                        <span
                          aria-hidden
                          className="pointer-events-none absolute -right-9 top-3 z-10 w-32 rotate-45 bg-maroon py-1 text-center text-[9px] font-bold uppercase tracking-[0.12em] text-white shadow-sm"
                        >
                          Best seller
                        </span>
                      ) : null}

                      <h4 className="bg-maroon px-3 py-2.5 text-center font-display text-sm font-bold uppercase leading-snug tracking-[0.08em] text-white sm:text-[15px]">
                        {pkg.name}
                      </h4>

                      <div className="flex flex-1 flex-col px-3 pb-3 pt-4">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {pkg.papers.map((paper) => (
                            <span
                              key={paper.slug}
                              className="inline-flex h-8 w-24 shrink-0 items-center justify-center overflow-hidden"
                            >
                              <NewspaperLogo paper={paper} className="h-8 w-24 object-contain" />
                            </span>
                          ))}
                        </div>

                        <p className="mt-3 text-center text-[13px] font-semibold leading-relaxed text-ink">
                          {pkg.label}
                        </p>
                        <p className="mt-1.5 text-center text-[12px] font-medium leading-relaxed text-slate-deep">
                          {pkg.cities}
                        </p>

                        <div className="mt-auto pt-4">
                          <div className="rounded-md border border-line bg-white px-3 pb-3 pt-2 text-center">
                            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-deep">
                              Cost (up to 5 lines)
                            </p>
                            <p className="mt-0.5 font-display text-xl font-semibold text-maroon">
                              {pkg.rate ? inr(pkg.rate) : "On request"}
                            </p>
                            {pkg.rate ? (
                              <BookEnquiryButton
                                message={`I want to book ${pkg.name} — ${pkg.label} (${inr(pkg.rate)}). Please share the next steps.`}
                                className="mt-2 block w-full bg-maroon px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-maroon-deep"
                              >
                                Book now
                              </BookEnquiryButton>
                            ) : (
                              <Link
                                href="/contact"
                                className="mt-2 block bg-maroon px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-maroon-deep"
                              >
                                Book now
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>
      </div>

      <CategoryDetailSections
        category={category}
        content={content}
        faqs={ALL_FAQS}
        ctaHref="/contact"
        ctaLabel="Book a matrimonial ad"
        ctaTitle="Ready to place your matrimonial ad?"
        ctaText="Send the profile details and the city. We will confirm the paper, Sunday date, package and final amount including GST before publication."
      />
    </>
  );
}
