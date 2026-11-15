import type { Metadata } from "next";
import Link from "next/link";
import {
  FaArrowRight,
  FaCheckCircle,
  FaPhoneAlt,
  FaRegCalendarAlt,
  FaWhatsapp,
} from "react-icons/fa";
import { CategoryDetailSections } from "@/components/category/CategoryDetailSections";
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
import { SITE } from "@/lib/site";

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
    a: "Every package rate covers up to 5 lines of ad matter. Each additional line adds 20% of the package rate. Add-ons such as background colour (20%), screen or border (12%) and tick (12%) are charged on top. The full amount is shown before you pay.",
  },
  {
    q: "What are the 2+2 and 3+3 schemes?",
    a: "2+2 means you pay for 2 ads and get 2 more free (4 ads total). 3+3 means you pay for 3 ads and get 3 more free (6 ads total). The same wording and add-ons are used for every insertion, and the desk confirms the dates for the free ads.",
  },
  {
    q: "Are the package rates inclusive of GST?",
    a: "No. The package rate is shown before taxes. A 5% GST and a 2.5% convenience fee on rate plus GST are added at checkout, and the full amount is shown before you pay.",
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
    text: "Pay online, then receive the e-paper page after the ad prints.",
  },
];

const AD_ESSENTIALS = [
  "Bride or groom wanted, and the age range",
  "Height, education and occupation",
  "Family background and community, if you want it printed",
  "City and the contact details that should appear",
  "Photo, if you are booking a photo boxed ad",
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
      path: `/matrimonial/book?pkg=${encodeURIComponent(pkg.id)}`,
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
              "Pick a matrimonial package from leading Indian newspapers and pay online. Bride wanted and groom wanted classifieds.",
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
              "Choose a package, send the bride or groom profile, approve the proof and pay online to publish the matrimonial ad.",
            url: absoluteUrl("/matrimonial"),
            steps: MATRIMONIAL_STEPS,
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
            <span className="font-medium text-ink">Matrimonial newspaper ads</span>
          </nav>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                {content.eyebrow}
              </p>
              <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.04] text-ink sm:text-6xl">
                Matrimonial ad in the newspaper
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-charcoal sm:text-lg">
                {content.intro[0]}
              </p>
              {content.intro[1] ? (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
                  {content.intro[1]}
                </p>
              ) : null}

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#packages" className="btn-primary">
                  Compare packages <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
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

              <div className="mt-9 rounded-xl border border-line bg-paper p-5">
                <h2 className="font-display text-lg text-ink">What to put in the ad</h2>
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {AD_ESSENTIALS.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-charcoal">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-maroon" aria-hidden />
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-4 text-xs leading-relaxed text-slate">
                  Keep it factual and brief. The desk can tighten the wording and translate it into
                  Hindi or another regional language at no extra charge.
                </p>
              </div>
            </div>

            <aside className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                At a glance
              </p>
              <dl className="mt-4 divide-y divide-line border-y border-line">
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Packages</dt>
                  <dd className="text-right text-xs font-semibold text-ink">{packageCount}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Best day</dt>
                  <dd className="text-right text-xs font-semibold text-ink">Sunday edition</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Lines included</dt>
                  <dd className="text-right text-xs font-semibold text-ink">Up to 5</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Schemes</dt>
                  <dd className="text-right text-xs font-semibold text-ink">2+2 &amp; 3+3</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Drafting</dt>
                  <dd className="text-right text-xs font-semibold text-ink">Free</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Proof</dt>
                  <dd className="text-right text-xs font-semibold text-ink">e-paper after print</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Taxes</dt>
                  <dd className="text-right text-xs font-semibold text-ink">5% GST extra</dd>
                </div>
              </dl>

              <p className="mt-4 flex items-center gap-2 text-xs leading-relaxed text-charcoal">
                <FaRegCalendarAlt className="h-3.5 w-3.5 shrink-0 text-maroon" aria-hidden />
                {SITE.cutoff}.
              </p>

              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0b6b37]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0b6b37] transition hover:border-[#0b6b37]/50"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden /> Ask about this package
              </a>
            </aside>
          </div>
        </div>
      </div>

      <div id="packages" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
          <div>
            <p className="section-kicker">Packages</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-4xl">
              Matrimonial ad packages
            </h2>
          </div>
          <p className="text-xs text-charcoal">
            {packageCount} packages · up to 5 lines included · rate + 5% GST
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
                            <Link
                              href={
                                pkg.rate
                                  ? `/matrimonial/book?pkg=${encodeURIComponent(pkg.id)}`
                                  : "/contact"
                              }
                              className="mt-2 block bg-maroon px-3 py-2 text-center text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:bg-maroon-deep"
                            >
                              Book now
                            </Link>
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
        ctaText="Send the profile details and the city. We will confirm the paper, Sunday date, package and final amount including GST before you pay."
      />
    </>
  );
}
