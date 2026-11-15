import type { Metadata } from "next";
import Link from "next/link";
import {
  FaArrowRight,
  FaCheckCircle,
  FaFileAlt,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaRegNewspaper,
  FaWhatsapp,
} from "react-icons/fa";
import { CategoryDetailSections } from "@/components/category/CategoryDetailSections";
import { JsonLd } from "@/components/JsonLd";
import { CityImageGrid } from "@/components/name-change/CityImageGrid";
import { NewspaperLogo } from "@/components/NewspaperWall";
import { CATEGORY_CONTENT } from "@/lib/category-content";
import {
  getNameChangeCities,
  getNameChangePackages,
  getCategory,
  slugifyCity,
} from "@/lib/data";
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
  title: "Change Name in Newspaper Ad",
  description:
    "Change your name in the newspaper for passport, PAN, Aadhaar or Gazette records. Pick your city, choose one or two papers and get e-paper proof.",
  path: "/change-my-name",
  keywords: [
    "change my name in newspaper",
    "name change newspaper ad online",
    "name change notice for passport",
    "name change ad for PAN",
    "name change ad for Aadhaar",
    "gazette name change advertisement",
    "naam parivartan newspaper ad",
    "change of name classified ad",
  ],
  image: "/ads/hero.png",
  imageAlt: "Change of name newspaper ad booking with AD2PRINT",
});

const NAME_CHANGE_FAQS = [
  {
    q: "Do I need a newspaper ad to change my name?",
    a: "Many passport offices, banks, Aadhaar centres, schools and Gazette authorities ask for a printed name-change notice as part of the file. The exact requirement depends on the office handling your application, so confirm it before you book.",
  },
  {
    q: "Which newspapers should I choose for a name change?",
    a: "A common combination is one English daily and one regional-language daily from the state where you live. Tell the desk which office is asking and we will suggest a combination that is usually accepted.",
  },
  {
    q: "Is one newspaper enough, or do I need two?",
    a: "Some offices accept a single paper; others ask for two. If you are unsure, choose a two-paper package so both language requirements are covered in one booking.",
  },
  {
    q: "How many insertions do I need?",
    a: "Most name-change files use a single insertion per newspaper. A few authorities ask for the notice on two dates. Confirm the requirement first — the desk can schedule repeat insertions if needed.",
  },
  {
    q: "What details must the notice contain?",
    a: "Old name, new name, parent or spouse name, residential address and the affidavit date are the usual details. The exact wording can be adjusted to the format the newspaper and the receiving office accept.",
  },
  {
    q: "Do I need a Gazette notification as well?",
    a: "A newspaper notice and a Gazette notification are separate processes. Many applicants use the newspaper notice first and then apply to the Gazette. Ask the office handling your file whether both are required.",
  },
  {
    q: "How much does a name-change ad cost?",
    a: "The cost depends on the city, newspaper combination and number of lines. Two-paper packages start at a modest classified rate, and the full amount including GST is shown before you pay.",
  },
  {
    q: "Can the notice be published in Hindi or another language?",
    a: "Yes. Drafting and translation are included. We can prepare the same notice in English, Hindi, Marathi, Gujarati, Tamil, Telugu, Kannada, Malayalam, Bengali, Punjabi and other languages.",
  },
];

const ALL_FAQS = [...NAME_CHANGE_FAQS, ...CATEGORY_CONTENT["change-of-name"].faqs];

const NAME_CHANGE_STEPS = [
  {
    name: "Choose your city",
    text: "Open the city page to see the newspapers and name-change combinations available there.",
  },
  {
    name: "Pick one or two papers",
    text: "Choose an English daily, a regional-language daily, or a package that covers both.",
  },
  {
    name: "Send the details",
    text: "Share the old name, new name, parent name, address and affidavit date. We draft the standard wording.",
  },
  {
    name: "Approve, pay and collect proof",
    text: "Check the proof, pay online and receive the e-paper page after publication.",
  },
];

const DOCUMENT_USES = [
  {
    title: "Passport",
    text: "Passport offices commonly ask for a newspaper notice along with the affidavit and other name-change documents.",
  },
  {
    title: "PAN card",
    text: "A printed notice supports the application when the name on the PAN record is being corrected or changed.",
  },
  {
    title: "Aadhaar",
    text: "Aadhaar update centres may ask for a published notice as supporting proof of the name change.",
  },
  {
    title: "Bank & KYC",
    text: "Banks often want a public record before updating the name on accounts, cards and locker records.",
  },
  {
    title: "School & university",
    text: "Boards and universities may ask for a newspaper notice when correcting a name on certificates.",
  },
  {
    title: "Gazette of India",
    text: "The newspaper notice is usually published first, followed by the Gazette notification process.",
  },
];

const NOTICE_CHECKLIST = [
  "Old name and the new name, spelt exactly as required",
  "Parent or spouse name",
  "Residential address to be printed",
  "Affidavit date and the place where it was sworn",
  "City and the newspaper combination you need",
];

const FEATURED_CITIES = ["Delhi", "Mumbai", "Bangalore"];

const SAMPLE_NOTICE =
  "I, [Old Name], son/daughter of [Parent Name], resident of [Address], have changed my name to [New Name] and will be known as [New Name] for all purposes. Affidavit sworn on [date] before the Notary Public, [City].";

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function ChangeMyNamePage() {
  const category = getCategory("change-of-name");
  const content = CATEGORY_CONTENT["change-of-name"];
  const cities = getNameChangeCities();
  const featured = FEATURED_CITIES.map((city) => ({
    city,
    slug: slugifyCity(city),
    packages: getNameChangePackages(city).slice(0, 3),
  })).filter((item) => item.packages.length > 0);
  const offers = cities
    .flatMap((city) =>
      getNameChangePackages(city)
        .filter((pkg) => typeof pkg.rate === "number" && pkg.rate > 0)
        .map((pkg) => ({
          name: `${pkg.label} — ${city}`,
          price: pkg.rate ?? 0,
          path: `/name-change/${slugifyCity(city)}/compose?papers=${pkg.slugs.join(",")}`,
          description: `Change of name classified in ${city} · ${pkg.unit}`,
        })),
    )
    .slice(0, 60);

  if (!category) return null;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Change my name in the newspaper", path: "/change-my-name" },
          ]),
          webPageJsonLd({
            path: "/change-my-name",
            name: "Change My Name in Newspaper",
            description:
              "Book a change of name notice in Indian newspapers for passport, PAN, Aadhaar, bank and Gazette records.",
            image: "/ads/hero.png",
          }),
          serviceJsonLd({
            name: "Change of name newspaper advertisement",
            description:
              "Book a name-change classified notice in one or two Indian newspapers, with standard drafting and publication proof.",
            path: "/change-my-name",
            category: "Change of Name",
            serviceType: "Name change newspaper classified advertising",
          }),
          faqJsonLd(ALL_FAQS),
          offerCatalogJsonLd({
            name: "Change of name newspaper ad packages",
            offers,
          }),
          howToJsonLd({
            name: "How to change your name in the newspaper",
            description:
              "Choose your city and newspapers, send the old and new name details, approve the notice and pay online.",
            url: absoluteUrl("/change-my-name"),
            steps: NAME_CHANGE_STEPS,
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
            <span className="font-medium text-ink">Change my name</span>
          </nav>

          <div className="mt-7 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start lg:gap-14">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                {content.eyebrow}
              </p>
              <h1 className="mt-5 max-w-3xl font-display text-4xl leading-[1.04] text-ink sm:text-6xl">
                Change my name in the newspaper
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
                <Link href="#cities" className="btn-primary">
                  Choose your city <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-ghost">
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

              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-line bg-paper p-5">
                  <h2 className="flex items-center gap-2 font-display text-lg text-ink">
                    <FaFileAlt className="h-4 w-4 text-maroon" aria-hidden />
                    Details to send
                  </h2>
                  <ul className="mt-3 space-y-2">
                    {NOTICE_CHECKLIST.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-sm text-charcoal">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-maroon" aria-hidden />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-line bg-paper p-5">
                  <h2 className="flex items-center gap-2 font-display text-lg text-ink">
                    <FaRegNewspaper className="h-4 w-4 text-maroon" aria-hidden />
                    Standard notice wording
                  </h2>
                  <p className="mt-3 text-sm italic leading-relaxed text-charcoal">
                    &ldquo;{SAMPLE_NOTICE}&rdquo;
                  </p>
                  <p className="mt-3 text-[11px] leading-relaxed text-slate">
                    Sample only. The desk fits the final wording to the newspaper and to the
                    requirement of the office receiving your application.
                  </p>
                </div>
              </div>
            </div>

            <aside className="rounded-2xl border border-line bg-paper p-6 sm:p-7">
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                At a glance
              </p>
              <dl className="mt-4 divide-y divide-line border-y border-line">
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Cities covered</dt>
                  <dd className="text-right text-xs font-semibold text-ink">{cities.length}</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Papers</dt>
                  <dd className="text-right text-xs font-semibold text-ink">One or two</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Drafting</dt>
                  <dd className="text-right text-xs font-semibold text-ink">Free</dd>
                </div>
                <div className="flex items-start justify-between gap-4 py-3">
                  <dt className="text-xs text-charcoal">Languages</dt>
                  <dd className="text-right text-xs font-semibold text-ink">English + regional</dd>
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

              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0b6b37]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0b6b37] transition hover:border-[#0b6b37]/50"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden /> Ask which papers you need
              </a>
              <p className="mt-3 text-[11px] leading-relaxed text-slate">
                {SITE.hours}. {SITE.cutoff}.
              </p>
            </aside>
          </div>
        </div>
      </div>

      {featured.length > 0 ? (
        <section className="border-b border-line bg-paper">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="section-kicker">Popular combinations</p>
                <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
                  Name-change packages in major cities
                </h2>
              </div>
              <Link
                href="#cities"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:underline"
              >
                All cities <FaArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>

            <div className="mt-7 grid gap-4 lg:grid-cols-3">
              {featured.map(({ city, slug, packages }) => (
                <div key={city} className="rounded-xl border border-line bg-white p-5">
                  <h3 className="flex items-center gap-2 font-display text-lg text-ink">
                    <FaMapMarkerAlt className="h-4 w-4 text-maroon" aria-hidden />
                    {city}
                  </h3>
                  <ul className="mt-4 divide-y divide-line border-y border-line">
                    {packages.map((pkg) => (
                      <li key={pkg.id} className="flex items-start gap-3 py-3">
                        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
                          {pkg.papers.map((paper) => (
                            <span key={paper.slug} className="inline-flex h-6 w-20 items-center">
                              <NewspaperLogo paper={paper} className="h-6 w-20 object-contain" />
                            </span>
                          ))}
                          <span className="w-full text-[11px] leading-relaxed text-charcoal">
                            {pkg.label}
                          </span>
                        </div>
                        <span className="shrink-0 font-display text-sm font-semibold text-maroon">
                          {pkg.rate ? inr(pkg.rate) : "On request"}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/name-change/${slug}`}
                    className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:underline"
                  >
                    Book in {city} <FaArrowRight className="h-3 w-3" aria-hidden />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CityImageGrid
        cities={cities}
        title="Choose your city to start the notice"
        description="Each city page lists the newspapers available for a name-change classified, along with the standard one-paper and two-paper combinations."
      />

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="section-kicker">Where it is used</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Documents that ask for a name-change notice
          </h2>
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENT_USES.map((item) => (
              <div key={item.title} className="rounded-xl border border-line bg-white p-5">
                <h3 className="font-display text-lg text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{item.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs leading-relaxed text-slate">
            Requirements vary by office and state. Confirm the exact newspaper, language and number
            of insertions with the authority before booking.
          </p>
        </div>
      </section>

      <CategoryDetailSections
        category={category}
        content={content}
        faqs={ALL_FAQS}
        ctaHref="#cities"
        ctaLabel="Choose your city"
        ctaTitle="Ready to publish your name-change notice?"
        ctaText="Pick your city and newspapers, send the old and new name details, and the desk will confirm the wording, rate and publication date before you pay."
      />
    </>
  );
}
