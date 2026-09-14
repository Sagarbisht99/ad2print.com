import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { EnquiryForm } from "@/components/EnquiryForm";
import { JsonLd } from "@/components/JsonLd";
import { NewspaperWall } from "@/components/NewspaperWall";
import { CityTextList } from "@/components/name-change/CityTextList";
import { NoticeBuilder } from "@/components/name-change/NoticeBuilder";
import { getNameChangeCities, getNewspapers } from "@/lib/data";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  howToJsonLd,
  pageMeta,
  serviceJsonLd,
  webPageJsonLd,
  absoluteUrl,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Name Change Newspaper Ad in India",
  description:
    "Publish a change of name notice in any Indian newspaper. Free English or Hindi drafting, edition booking, and print proof for passport, Aadhaar, PAN, bank and Gazette records.",
  path: "/name-change",
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
  ],
});

const DOCUMENTS = [
  {
    title: "Passport",
    body: "New or re-issue applications with a changed name",
    image: "https://i.pinimg.com/1200x/72/74/f1/7274f17aa6e09c71ecf38656a7ef407a.jpg",
    alt: "Indian passport — name change newspaper notice for passport update",
  },
  {
    title: "Aadhaar",
    body: "Name correction and update requests",
    image: "https://i.pinimg.com/736x/24/69/83/246983a725c33409cd88436fb3b609ea.jpg",
    alt: "Aadhaar card — newspaper ad required for Aadhaar name correction",
  },
  {
    title: "PAN & income tax",
    body: "Records that must match your bank name",
    image: "https://i.pinimg.com/1200x/42/31/96/423196b2f9e9e93b6b24953043e05cfd.jpg",
    alt: "PAN card — name change classified for income tax records",
  },
  {
    title: "Bank & insurance",
    body: "Account, policy, and nominee name updates",
    image: "https://i.pinimg.com/736x/bf/bf/c6/bfbfc6dd4ef41ebfcf95adeaba551b29.jpg",
    alt: "Bank passbook — newspaper notice for account name update",
  },
  {
    title: "School & university",
    body: "Marksheet, degree, and certificate corrections",
    image: "https://i.pinimg.com/736x/e9/d9/38/e9d938f87b330bf9115adc53465cb063.jpg",
    alt: "School certificate — name correction notice for marksheets and degrees",
  },
  {
    title: "Gazette of India",
    body: "Notification filings that ask for a paper cutting",
    image: "https://i.pinimg.com/736x/8d/c3/b6/8dc3b684887cd28f201d10d9ca5b9506.jpg",
    alt: "Gazette of India — newspaper cutting required with gazette name change",
  },
];

const SAMPLES = [
  {
    label: "English · single column",
    heading: "Change of Name",
    tone: "maroon" as const,
    text: "I, Rajesh Kumar, S/o Suresh Kumar, R/o Delhi, have changed my name to Rajesh Singh vide affidavit dated 18.06.2026 sworn before Notary, Delhi.",
  },
  {
    label: "Hindi · regional edition",
    heading: "नाम परिवर्तन",
    tone: "ink" as const,
    text: "मैं, राजेश कुमार, पुत्र सुरेश कुमार, निवासी दिल्ली, ने अपना नाम बदलकर राजेश सिंह रख लिया है। शपथ पत्र दिनांक 02.05.2026, नोटरी दिल्ली के समक्ष।",
  },
  {
    label: "English · minor's name",
    heading: "Change of Name",
    tone: "maroon" as const,
    text: "I, Arjun Mehta, F/o Master Ved Mehta, aged 9 years, R/o Sector 62, Noida, have changed my son's name to Ved Arjun Mehta vide affidavit dated 11.07.2026 sworn before Notary, Noida.",
  },
];

const CHECKLIST = [
  "Affidavit copy (or tell us — we guide you where to get one)",
  "Correct spelling of old and new name, exactly as in records",
  "Father's or husband's name and the address for the notice",
  "Which office asked for it — passport, bank, school, or gazette",
];

const FAQS = [
  {
    q: "How soon can my name change notice be published?",
    a: "Most editions accept material a day before printing. If we get your details and confirmation before the paper's cut-off, the notice usually runs the next publishing day.",
  },
  {
    q: "Do I need an affidavit before booking the ad?",
    a: "The notice normally refers to an affidavit date, so it is best to have it ready. If you do not have one yet, tell the desk and we will explain the order in which to do things.",
  },
  {
    q: "One newspaper or two?",
    a: "Many offices ask for one English and one regional language paper. Tell us which office requested it and we will suggest the safer combination so it is not rejected.",
  },
  {
    q: "What does a name change ad cost?",
    a: "It depends on the paper, the edition, and the number of lines. The desk confirms the amount on WhatsApp before anything is booked.",
  },
  {
    q: "Will I get proof that it was printed?",
    a: "Yes. We send the e-paper clipping with the date and page, and a hard copy on request, which is what most offices accept as proof.",
  },
  {
    q: "Can the notice be in Hindi or another language?",
    a: "Yes. Drafting and translation are included, so the same notice can run in Hindi, Marathi, Tamil, Telugu, or any language the paper prints in.",
  },
  {
    q: "Do I need a name change ad after marriage or divorce?",
    a: "Yes, if you are taking a spouse's surname or reverting to a previous name. Passport Seva, banks, and Aadhaar often ask for a newspaper cutting along with the marriage certificate or court order.",
  },
  {
    q: "What if the spelling on my documents is wrong?",
    a: "A spelling-error notice uses the same classified format. Send both spellings exactly as they appear, and we draft wording that the paper and the office will accept.",
  },
  {
    q: "Which newspapers are accepted for a Gazette name change?",
    a: "Gazette filings usually need one English daily and one regional-language paper from the state where you live. Tell us the state and we will suggest a combination that is commonly accepted.",
  },
];

const HOW_TO_STEPS = [
  {
    name: "Draft the notice",
    text: "Enter the old name, new name, father or husband name, address and affidavit date. The classified wording updates live in English or Hindi.",
  },
  {
    name: "Send details to the desk",
    text: "Share your mobile and email. AD2PRINT confirms the paper, edition, line count and booking details before anything is booked.",
  },
  {
    name: "Approve and publish",
    text: "Once you approve the proof, the notice runs in the chosen newspaper. You receive the e-paper clipping and a hard copy on request.",
  },
];

export default function NameChangePage() {
  const cities = getNameChangeCities();
  const papers = getNewspapers();
  const topPapers = [...papers].sort((a, b) => a.name.localeCompare(b.name)).slice(0, 8);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Categories", path: "/categories" },
            { name: "Name change newspaper ad", path: "/name-change" },
          ]),
          webPageJsonLd({
            path: "/name-change",
            name: "Name Change Newspaper Ad in India",
            description:
              "Publish a change of name notice in any Indian newspaper. Drafting included. Proof after print.",
            image: "/ads/name-change-banner.png",
          }),
          serviceJsonLd({
            name: "Change of Name newspaper advertisement",
            description:
              "Book a name change classified in national and regional Indian newspapers, with drafting and publication proof.",
            path: "/name-change",
          }),
          howToJsonLd({
            name: "How to publish a name change newspaper ad",
            description:
              "Draft a change of name notice online and publish it in an Indian newspaper for passport, Aadhaar, PAN, bank or gazette records.",
            url: absoluteUrl("/name-change"),
            steps: HOW_TO_STEPS,
          }),
          faqJsonLd(FAQS),
        ]}
      />

      <nav
        aria-label="Breadcrumb"
        className="border-b border-line bg-white/70"
      >
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-4 py-3 text-xs text-charcoal sm:px-6 sm:text-sm">
          <li>
            <Link href="/" className="hover:text-maroon">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-line">
            /
          </li>
          <li>
            <Link href="/categories" className="hover:text-maroon">
              Categories
            </Link>
          </li>
          <li aria-hidden className="text-line">
            /
          </li>
          <li className="font-medium text-ink">
            <span aria-current="page">Name change newspaper ad</span>
          </li>
        </ol>
      </nav>

      <section className="overflow-hidden border-b border-line bg-white">
        <div className="relative mx-auto max-w-7xl">
          <Image
            src="/ads/name-change-banner.png"
            alt="Change of name newspaper ad: choose your city, choose newspaper, fill your details, pay online. Need help, call 79829 36243. For Gazette of India, passport, Aadhaar and PAN."
            width={1024}
            height={188}
            priority
            className="h-auto w-full object-contain object-left"
          />
          <h1 className="sr-only">Name Change Newspaper Ad in India</h1>
        </div>
        <div className="border-t border-line bg-paper px-4 py-3 sm:px-6">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-ink sm:flex-row sm:items-center sm:justify-between">
            <p className="font-medium">
              Need help? Call{" "}
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="font-semibold text-maroon hover:underline"
              >
                {SITE.phone}
              </a>
            </p>
            <p className="text-charcoal">
              Steps: Choose your city → Choose newspaper → Fill your details → Pay online
            </p>
          </div>
        </div>
      </section>

      <CityTextList cities={cities} />

      <section className="border-b border-line bg-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 sm:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <div className="flex min-w-0 flex-col">
            <p className="section-kicker">Change of Name</p>
            <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
              Book a name change newspaper notice
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-charcoal sm:text-base">
              Publish a change of name notice for passport, Aadhaar, PAN, bank and Gazette of India
              records. We draft the classified in English or Hindi and send print proof after it
              runs.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href="#cities" className="btn-primary w-full sm:w-auto">
                Choose your city
              </Link>
              <Link href="#draft" className="btn-ghost w-full sm:w-auto">
                Compose the notice
              </Link>
            </div>

            <ol className="mt-8 grid gap-3 sm:grid-cols-2">
              {[
                { n: "01", t: "Choose city", d: "Pick the edition your office asked for." },
                { n: "02", t: "Pick newspapers", d: "English + regional pair when needed." },
                { n: "03", t: "Fill the notice", d: "Old name, new name, address, date." },
                { n: "04", t: "Confirm & print", d: "Pay after the desk confirms the amount." },
              ].map((step) => (
                <li key={step.n} className="border border-line bg-white px-4 py-3">
                  <p className="text-[11px] font-bold tracking-[0.14em] text-maroon">{step.n}</p>
                  <p className="mt-1 font-semibold text-ink">{step.t}</p>
                  <p className="mt-0.5 text-sm text-charcoal">{step.d}</p>
                </li>
              ))}
            </ol>

            <ul className="mt-6 space-y-2.5 text-sm text-ink">
              {[
                "English and Hindi drafting included",
                "Amount confirmed on WhatsApp before booking",
                "E-paper proof after publication",
                "Accepted for passport, Aadhaar, PAN and Gazette",
              ].map((item) => (
                <li key={item} className="flex gap-2.5">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-maroon" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="border border-line bg-white p-4 sm:p-6">
            <p className="section-kicker">Quick enquiry</p>
            <h2 className="mt-2 font-display text-xl text-ink sm:text-2xl">
              Book your name change ad
            </h2>
            <p className="mt-1.5 mb-4 text-sm text-charcoal">
              We send the wording and paper on WhatsApp.
            </p>
            <EnquiryForm
              compact
              categoryName="Change of Name"
              source="category"
              submitLabel="Send enquiry"
              defaultMessage="I need a name change notice published. Please share the wording and paper."
            />
          </div>
        </div>
      </section>

      <section id="draft" className="scroll-mt-24 border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
          <NoticeBuilder cities={cities} />
        </div>
      </section>

      <section className="border-b border-line bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="section-kicker">Why it is asked for</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Where a name change newspaper notice is needed
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
            Offices ask for a printed classified so the old name and the new name are on public
            record. The same notice is used for passport, Aadhaar, PAN, bank, school certificates
            and Gazette of India filings.
          </p>
          <div className="mt-8 grid gap-3 sm:mt-10 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DOCUMENTS.map((doc) => (
              <article
                key={doc.title}
                className="group overflow-hidden border border-line bg-white transition hover:-translate-y-0.5 hover:border-maroon/40 hover:shadow-[0_16px_36px_rgba(26,27,30,0.08)]"
              >
                <div className="relative aspect-video overflow-hidden bg-paper-2">
                  <Image
                    src={doc.image}
                    alt={doc.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                    className="object-cover transition duration-300 group-hover:scale-[1.04]"
                  />
                </div>
                <div className="px-4 py-4 sm:px-5">
                  <h3 className="font-display text-base text-ink sm:text-lg">{doc.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-charcoal">{doc.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="section-kicker">Most booked papers</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl">
            Papers people choose for name change
          </h2>
          <div className="mt-6 border border-line bg-white p-2 sm:p-4">
            <NewspaperWall papers={topPapers} maxHeight={360} />
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-white/70">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="section-kicker">Sample notices</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Name change ad wording that papers accept
          </h2>
          <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
            {SAMPLES.map((sample) => (
              <figure key={sample.label} className="border border-line bg-paper-2 p-3">
                <div className="bg-white">
                  <div
                    className={`px-3 py-2 ${sample.tone === "maroon" ? "bg-maroon" : "bg-ink"}`}
                  >
                    <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-white">
                      {sample.heading}
                    </p>
                  </div>
                  <p
                    className="px-4 py-4 text-[13px] leading-[1.65] text-ink"
                    style={{ textAlign: "justify", fontFamily: "Georgia, 'Times New Roman', serif" }}
                  >
                    {sample.text}
                  </p>
                </div>
                <figcaption className="mt-2.5 text-xs text-charcoal">{sample.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <p className="section-kicker">Before you book</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
                What we need from you
              </h2>
              <ul className="mt-8 space-y-4">
                {CHECKLIST.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink sm:text-base">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-maroon" aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-8 text-sm text-charcoal">
                Desk hours {SITE.hours}. Send the draft any time — we reply the same working day.
              </p>
            </div>

            <div>
              <p className="section-kicker">Questions</p>
              <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
                Name change newspaper ad FAQ
              </h2>
              <div className="mt-8 divide-y divide-line border-y border-line">
                {FAQS.map((faq) => (
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
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-6 px-4 py-12 sm:px-6 sm:py-14 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-display text-2xl text-white sm:text-4xl">
              Still unsure about the wording?
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-paper/70 sm:text-base">
              Send us what the office asked for. We will draft the name change notice, confirm the
              paper, and book it after you approve.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
            <Link href="#draft" className="btn-primary w-full sm:w-auto">
              Draft my notice
            </Link>
            <Link
              href="/contact"
              className="inline-flex w-full items-center justify-center rounded-sm border-2 border-white/35 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5 sm:w-auto"
            >
              Talk to the desk
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
