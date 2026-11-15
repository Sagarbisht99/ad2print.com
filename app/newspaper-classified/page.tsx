import type { Metadata } from "next";
import Link from "next/link";
import {
  FaArrowRight,
  FaCheckCircle,
  FaPhoneAlt,
  FaRegClock,
  FaWhatsapp,
} from "react-icons/fa";
import { CategoryIcon } from "@/components/CategoryIcon";
import { JsonLd } from "@/components/JsonLd";
import { Testimonials } from "@/components/home/Testimonials";
import { ClassifiedHero } from "@/components/newspaper-classified/ClassifiedHero";
import { EnquiryButton } from "@/components/newspaper-classified/EnquiryButton";
import { NewspaperLogo } from "@/components/NewspaperWall";
import { getCategoryHref } from "@/lib/category-routes";
import {
  getCategoriesOrdered,
  getCities,
  getNameChangeCities,
  getNameChangePackages,
  slugifyCity,
} from "@/lib/data";
import {
  getLanguageCounts,
  getLanguageLabel,
  getPopularNewspapers,
} from "@/lib/newspaper-content";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
  itemListJsonLd,
  pageMeta,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Newspaper Classified Ads — Book Online",
  description:
    "Book newspaper classified ads online in 280+ Indian papers — matrimonial, property, recruitment, lost & found, public notices. Free drafting & proof.",
  path: "/newspaper-classified",
  keywords: [
    "newspaper classified ads",
    "book classified ads online",
    "newspaper classified ad booking",
    "classified advertisement in newspaper",
    "text classified ad",
    "classified display ad",
    "newspaper classified rates",
    "book newspaper ad India",
    "matrimonial classified ad",
    "name change classified ad",
    "property classified ad newspaper",
    "public notice classified",
  ],
});

const CLASSIFIED_FAQS = [
  {
    q: "What is a newspaper classified ad?",
    a: "A classified ad is a short advertisement printed in the classified section of a newspaper under a category heading such as matrimonial, property, recruitment, name change or public notice. Text classifieds are priced by line, word or character, while classified display ads are priced by size.",
  },
  {
    q: "How much does a newspaper classified ad cost?",
    a: "The cost depends on the newspaper, city edition, category, number of lines and the day of publication. Text classifieds are the most economical; classified display and main-page display cost more because they use a box, logo, photo or larger artwork. The desk confirms the final amount including GST before you pay.",
  },
  {
    q: "Can I book a classified ad in more than one newspaper?",
    a: "Yes. You can add a national daily and a regional-language paper to one order, pay once and track the bookings together. This is common for passport name-change combinations, matrimonial ads and multi-city public notices.",
  },
  {
    q: "What is the difference between text classified and classified display?",
    a: "Text classified is plain text in the classified columns. Classified display is a boxed ad inside the classified pages, usually with a logo, photo, border or larger type. Main-page display appears alongside news and is priced by page, position, size and colour.",
  },
  {
    q: "Can AD2PRINT write or translate the classified ad for me?",
    a: "Yes. Send the basic details, even handwritten matter or a photo, and the desk will draft the wording and translate it into English, Hindi or another Indian language. You approve the proof before it goes to print.",
  },
  {
    q: "How late can I book a classified ad for tomorrow's paper?",
    a: "Most editions accept a classified ad confirmed before the publication cut-off, usually around 5 PM the previous day. Weekend, festival and premium editions close earlier, so call the desk to confirm the exact deadline for your paper and city.",
  },
  {
    q: "Do you provide proof after the ad is published?",
    a: "Yes. After the ad prints, we send the e-paper page for the correct date and edition, along with the GST invoice. A physical newspaper cutting can be arranged on request.",
  },
];

const CLASSIFIED_STEPS = [
  {
    name: "Choose the category and city",
    text: "Pick from name change, matrimonial, property, recruitment, lost & found, public notice or another classified category, then choose the city edition.",
  },
  {
    name: "Select the newspaper",
    text: "Compare English and regional-language papers. The desk confirms the edition, format and available publication date.",
  },
  {
    name: "Send or draft the wording",
    text: "Type the ad, upload a document or ask the desk to draft and translate it for free.",
  },
  {
    name: "Approve, pay and collect proof",
    text: "Check the proof, pay online and receive the e-paper page and GST invoice after publication.",
  },
];

const FORMAT_ROWS = [
  {
    format: "Text classified",
    charged: "Per line, word or character",
    bestFor: "Name change, matrimonial, lost & found, public notices",
    note: "Plain text in the classified columns — the most economical option.",
  },
  {
    format: "Classified display",
    charged: "Per square centimetre",
    bestFor: "Property, recruitment, business offers, education",
    note: "A boxed ad with a logo, photo, border or larger type inside the classified pages.",
  },
  {
    format: "Main-page display",
    charged: "Per square centimetre, page and position",
    bestFor: "Launches, festivals, brand campaigns, large public notices",
    note: "A larger ad alongside news, priced by page, position, size and colour.",
  },
];

const SEARCH_LINKS = [
  { href: "/change-my-name", label: "Name change ad" },
  { href: "/matrimonial", label: "Matrimonial ad" },
  { href: "/tender-notice", label: "Public / court notice" },
  { href: "/categories/statutory#lost-share-certificate", label: "Lost share certificate" },
  { href: "/categories/property", label: "Property for sale / rent" },
  { href: "/categories/recruitment", label: "Recruitment ad" },
  { href: "/categories/lost-and-found", label: "Lost document notice" },
  { href: "/categories/obituary", label: "Obituary & remembrance" },
  { href: "/categories/announcement", label: "Announcement ad" },
  { href: "/categories/business", label: "Business display ad" },
  { href: "/categories/education", label: "Education ad" },
  { href: "/categories/vehicles", label: "Vehicle classified" },
];

const AT_A_GLANCE = [
  { value: "280+", label: "Newspapers", note: "National and regional, one booking window" },
  { value: "Per line", label: "Text classified", note: "Priced by line, word or character" },
  { value: "Per sq cm", label: "Classified display", note: "Boxed ads with logo, photo or colour" },
  { value: "Next-day", label: "Publication", note: "Book before the edition cut-off" },
  { value: "5%", label: "GST", note: "Shown in the total before you pay" },
  { value: "Free", label: "Drafting & translation", note: "English, Hindi and regional languages" },
];

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function NewspaperClassifiedPage() {
  const categories = getCategoriesOrdered();
  const cities = getCities();
  const popularPapers = getPopularNewspapers(10);
  const languages = getLanguageCounts().slice(0, 8);
  const packageRates = getNameChangeCities().flatMap((city) =>
    getNameChangePackages(city)
      .map((pkg) => pkg.rate)
      .filter((rate): rate is number => typeof rate === "number" && rate > 0),
  );
  const lowestPackageRate = packageRates.length > 0 ? Math.min(...packageRates) : 399;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Newspaper classified ads", path: "/newspaper-classified" },
          ]),
          webPageJsonLd({
            path: "/newspaper-classified",
            name: "Newspaper classified ads booking",
            description:
              "Book newspaper classified ads online in 280+ Indian papers, with per-line and per-square-centimetre rates, free drafting and e-paper proof.",
            image: "/og/ad2print-1200x630.png",
          }),
          serviceJsonLd({
            name: "Newspaper classified advertisement booking",
            description:
              "Online booking for text classified, classified display and main-page display ads in national and regional Indian newspapers.",
            path: "/newspaper-classified",
            category: "Newspaper classified advertising",
            serviceType: "Newspaper classified and display advertising",
          }),
          itemListJsonLd({
            name: "Newspaper classified ad categories",
            items: categories.map((category) => ({
              name: `${category.name} classified ads`,
              path: getCategoryHref(category.slug),
            })),
          }),
          faqJsonLd(CLASSIFIED_FAQS),
          howToJsonLd({
            name: "How to book a newspaper classified ad online",
            description:
              "Choose the category and city, select the newspaper, send the wording, approve the proof and pay online.",
            url: absoluteUrl("/newspaper-classified"),
            steps: CLASSIFIED_STEPS,
          }),
        ]}
      />

      <div className="border-b border-line bg-white">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 py-3 text-xs text-charcoal sm:px-6">
          <Link href="/" className="hover:text-maroon">
            Home
          </Link>
          <span className="mx-2 text-line">/</span>
          <span className="font-medium text-ink">Newspaper classified ads</span>
        </nav>
      </div>

      <ClassifiedHero
        categories={categories.map(({ slug, name }) => ({ slug, name }))}
        cities={cities}
      />

      <section className="border-b border-line bg-paper-2/50">
        <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.18em] text-charcoal sm:text-[11px]">
            Trusted to book in 280+ newspapers — national &amp; every regional language
          </p>
          <div className="mt-5 grid grid-cols-2 items-center gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
            {popularPapers.map((paper) => (
              <Link
                key={paper.slug}
                href={`/newspapers/${paper.slug}`}
                className="flex h-9 items-center justify-center opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                aria-label={`Book an ad in ${paper.name}`}
              >
                <NewspaperLogo paper={paper} className="max-h-8 max-w-[8.5rem] object-contain" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="scroll-mt-24 border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <p className="section-kicker">Select your ad category</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-5xl">
              What type of classified ad are you placing?
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal sm:text-base">
              Pick the category that matches your purpose. Each page shows the formats newspapers
              accept, the wording that works and the route to a confirmed rate.
            </p>
          </div>

          <div className="mt-9 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={getCategoryHref(category.slug)}
                className="group relative flex flex-col items-start rounded-xl border border-line bg-white p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-maroon/45 hover:shadow-[0_16px_36px_rgba(178,31,45,0.1)] sm:p-5"
              >
                {category.popular ? (
                  <span className="absolute right-3 top-3 text-[9px] font-bold uppercase tracking-[0.14em] text-maroon sm:text-[10px]">
                    Popular
                  </span>
                ) : null}
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-lg transition duration-200 group-hover:scale-105 sm:h-12 sm:w-12"
                  style={{ background: `${category.tint}18`, color: category.tint }}
                >
                  <CategoryIcon name={category.icon} className="h-5 w-5 sm:h-6 sm:w-6" />
                </span>
                <span className="mt-4 font-display text-[15px] leading-snug text-ink group-hover:text-maroon sm:text-lg">
                  {category.name}
                </span>
                <span className="mt-1.5 line-clamp-2 text-[11px] leading-relaxed text-charcoal sm:text-sm">
                  {category.short}
                </span>
                <span className="mt-auto pt-4 text-[11px] font-semibold text-maroon sm:text-sm">
                  View formats &amp; book
                  <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-line bg-white p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate">
              Classified ads by city
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {getNameChangeCities().map((city) => (
                <Link
                  key={city}
                  href={`/newspaper-classified/${slugifyCity(city)}`}
                  className="rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
                >
                  {city}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-xl border border-line bg-paper p-5 sm:p-6">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate">
              Popular classified searches
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SEARCH_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-line bg-white px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
            <div className="min-w-0">
              <p className="section-kicker">Classified formats</p>
              <h2 className="mt-3 font-display text-3xl leading-[1.05] text-ink sm:text-5xl">
                Which classified format should you book?
              </h2>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal sm:text-base">
                The format decides how the ad is priced and how much space it gets. Text
                classifieds suit short notices; display formats are better when you need a logo,
                photo, map or a larger offer.
              </p>

              <div className="mt-7 overflow-x-auto rounded-xl border border-line bg-white">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Newspaper classified ad formats, how they are charged and what they are best
                    for
                  </caption>
                  <thead>
                    <tr className="border-b border-line bg-paper-2/60 text-[10px] uppercase tracking-[0.12em] text-charcoal">
                      <th scope="col" className="px-4 py-3 font-bold">
                        Format
                      </th>
                      <th scope="col" className="px-4 py-3 font-bold">
                        Charged by
                      </th>
                      <th scope="col" className="px-4 py-3 font-bold">
                        Best for
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {FORMAT_ROWS.map((row) => (
                      <tr key={row.format} className="align-top">
                        <th scope="row" className="px-4 py-4 font-display text-base text-ink">
                          {row.format}
                          <span className="mt-1 block text-[11px] font-normal leading-relaxed text-charcoal">
                            {row.note}
                          </span>
                        </th>
                        <td className="px-4 py-4 text-xs text-charcoal">{row.charged}</td>
                        <td className="px-4 py-4 text-xs text-charcoal">{row.bestFor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-slate">
                Indicative pricing only. The exact rate is finalised per newspaper, edition, size
                and publication date. Rates exclude 5% GST unless stated.
              </p>
            </div>

            <aside className="h-fit min-w-0 rounded-2xl border border-line bg-white p-6 shadow-[0_16px_40px_rgba(26,27,30,0.06)] sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-maroon">
                At a glance
              </p>
              <div className="mt-5 divide-y divide-line border-t border-line">
                {AT_A_GLANCE.map((item) => (
                  <div key={item.label} className="flex gap-4 py-4">
                    <p className="w-24 shrink-0 font-display text-xl text-ink sm:text-2xl">
                      {item.value}
                    </p>
                    <div>
                      <p className="text-sm font-bold text-ink">{item.label}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-charcoal">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-[11px] leading-relaxed text-slate">
                Classified packages start from {inr(lowestPackageRate)} in selected cities. The
                desk confirms the final amount before payment.
              </p>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-[#0b6b37]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0b6b37] transition hover:border-[#0b6b37]/50"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden /> Ask for the live rate
              </a>
            </aside>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
            <div>
              <p className="section-kicker">Newspaper classifieds</p>
              <h2 className="mt-3 max-w-2xl font-display text-3xl leading-[1.05] text-ink sm:text-5xl">
                Why book your newspaper classified through{" "}
                <span className="text-maroon">AD2PRINT.</span>
              </h2>
              <p className="mt-5 max-w-2xl font-display text-lg font-medium leading-relaxed text-slate-deep sm:text-xl">
                A classified ad is usually bought for a reason, not a campaign. An office asks for
                a published notice, a family starts looking for a match, a flat needs a tenant, a
                shop needs a driver.
              </p>
              <p className="mt-5 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
                That makes the questions very practical: which newspaper will the right people
                actually see, what will a few printed lines cost, and can it run tomorrow? AD2PRINT
                answers all three in one place. You see the per-line or per-square-centimetre rate
                for your category, newspaper and edition before you pay; you choose the date it
                appears; and you book online without a phone call or a visit to the newspaper
                office.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
                Matrimonial, property and recruitment matter can be drafted and translated free.
                Name-change and public-notice ads are published exactly as you compose them, because
                their wording and spelling are what the receiving office checks. Every booking
                includes a proof before print and the e-paper page after publication.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "One window for national and regional papers",
                  "Free drafting and translation",
                  "Rate confirmed before payment",
                  "e-paper proof and GST invoice",
                ].map((item) => (
                  <p key={item} className="flex items-start gap-2.5 text-sm text-charcoal">
                    <FaCheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-maroon" aria-hidden />
                    {item}
                  </p>
                ))}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="#categories" className="btn-primary">
                  Pick a category <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
                </Link>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-ghost">
                  <FaPhoneAlt className="h-3.5 w-3.5" aria-hidden /> {SITE.phone}
                </a>
              </div>
            </div>

            <aside className="rounded-2xl border border-line bg-paper p-6 sm:p-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-maroon">
                Languages we book
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {languages.map(({ language, count }) => (
                  <span
                    key={language}
                    className="rounded-full border border-line bg-white px-3 py-1.5 text-xs font-medium text-charcoal"
                  >
                    {getLanguageLabel(language)} ({count})
                  </span>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-charcoal">
                The wider booking network covers 280+ newspapers and 15 Indian languages. If your
                title is not listed, call the desk — we can usually still book it.
              </p>

              <div className="mt-6 border-t border-line pt-5">
                <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal">
                  <FaRegClock className="h-3.5 w-3.5 text-maroon" aria-hidden />
                  Publication cut-off
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{SITE.cutoff}.</p>
                <p className="mt-3 text-xs leading-relaxed text-slate">{SITE.hours}.</p>
              </div>

              <Link
                href="/newspapers"
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:underline"
              >
                Browse all newspapers <FaArrowRight className="h-3 w-3" aria-hidden />
              </Link>            </aside>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="section-kicker">How it works</p>
          <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink sm:text-5xl">
            Four steps from wording to print
          </h2>
          <ol className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {CLASSIFIED_STEPS.map((step, index) => (
              <li key={step.name} className="rounded-xl border border-line bg-white p-5">
                <span className="font-display text-3xl text-maroon/80">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-lg text-ink">{step.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <Testimonials />

      <section id="faq" className="scroll-mt-24 border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
            <div>
              <p className="section-kicker">Questions</p>
              <h2 className="mt-3 font-display text-3xl text-ink sm:text-5xl">
                Newspaper classified ad FAQ
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-charcoal">
                Still unsure which paper or format to choose? Call the desk on{" "}
                <a
                  href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                  className="font-semibold text-maroon hover:underline"
                >
                  {SITE.phone}
                </a>{" "}
                or send a WhatsApp message. We reply during desk hours.
              </p>
              <EnquiryButton
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:underline"
                label="Open the newspaper ad enquiry form"
              >
                Send an enquiry <FaArrowRight className="h-3 w-3" aria-hidden />
              </EnquiryButton>
            </div>
            <div className="divide-y divide-line border-y border-line">
              {CLASSIFIED_FAQS.map((faq) => (
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
        </div>
      </section>

      <section className="bg-paper-2/60">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-7 rounded-2xl border border-[#eadfc7] bg-[#f7f1e4] px-6 py-8 sm:px-10 sm:py-10 lg:flex-row lg:items-center">
            <div>
              <p className="section-kicker">Ready to book</p>
              <h2 className="mt-2 font-display text-2xl text-ink sm:text-4xl">
                Book your newspaper classified today.
              </h2>
              <p className="mt-2 text-sm text-charcoal sm:text-base">
                Real rate before you pay · free drafting · e-paper proof after print.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <EnquiryButton
                className="inline-flex items-center gap-2 rounded-xl bg-maroon px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(200,16,46,0.22)] transition hover:-translate-y-0.5 hover:bg-maroon-deep"
                label="Start a newspaper classified ad booking"
              >
                Start booking <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
              </EnquiryButton>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-maroon/40 bg-white px-6 py-3.5 text-sm font-bold text-ink transition hover:border-maroon hover:text-maroon"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden /> Talk to us
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate">
            Related newspaper ad services
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/newspapers"
              className="rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
            >
              All newspapers
            </Link>
            <Link
              href="/change-my-name"
              className="rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
            >
              Name change newspaper ad
            </Link>
            <Link
              href="/matrimonial"
              className="rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
            >
              Matrimonial packages
            </Link>
            <Link
              href="/tender-notice"
              className="rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
            >
              Tender &amp; court notices
            </Link>
            <Link
              href="/categories"
              className="rounded-full border border-line bg-paper px-3.5 py-2 text-xs font-medium text-charcoal transition hover:border-maroon/40 hover:text-maroon"
            >
              All ad categories
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
