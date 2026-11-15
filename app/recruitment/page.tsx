import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaCheckCircle, FaPhoneAlt } from "react-icons/fa";
import { JsonLd } from "@/components/JsonLd";
import { EnquiryButton } from "@/components/newspaper-classified/EnquiryButton";
import { RecruitmentCards } from "@/components/recruitment/RecruitmentCards";
import { getRecruitmentPackages } from "@/lib/recruitment";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  itemListJsonLd,
  pageMeta,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Recruitment Ads in Delhi — Book Online",
  description:
    "Book recruitment ads in Times of India, Navbharat Times, Dainik Jagran, Amar Ujala, Hindustan & The Hindu Delhi editions. Free drafting, e-paper proof.",
  path: "/recruitment",
  keywords: [
    "recruitment ad in newspaper Delhi",
    "hiring ad in newspaper Delhi",
    "recruitment advertisement Delhi",
    "walk-in interview ad Delhi",
    "Times of India recruitment ad",
    "Dainik Jagran recruitment ad",
    "Navbharat Times recruitment ad",
    "Hindustan recruitment ad",
    "recruitment classified ad price",
    "employee wanted ad newspaper Delhi",
  ],
});

const RECRUITMENT_FAQS = [
  {
    q: "Which Delhi newspaper is best for a recruitment ad?",
    a: "For senior and corporate roles, Times of India and Hindustan Times (English) work best. For high-volume local hiring — drivers, sales, office staff — Dainik Jagran, Navbharat Times, Amar Ujala and Hindustan (Hindi) reach more hands per rupee. The Hindu Delhi edition suits professional and industrial audiences, and Punjab Kesari is strong for the Delhi–Punjab corridor.",
  },
  {
    q: "How much does a recruitment ad cost in Delhi?",
    a: "See the cards above — Delhi & NCR packages run from ₹550 (The Hindu, 2 lines) to ₹13,500 (Times of India, All India 17-state weekday combo). Line-based packages include the first lines printed on the card and charge 20% of the package rate per extra line. 5% GST and 2.5% convenience fee are added at checkout — the exact amount is shown before you pay.",
  },
  {
    q: "What should a recruitment ad include?",
    a: "Post, eligibility, experience, salary (if you disclose it), last date to apply, and the address or email for applications. The desk drafts the ad in the wording that fits the paper's column width and your requirement — in Hindi, English or both.",
  },
  {
    q: "Can a walk-in interview ad run tomorrow in Delhi?",
    a: "Usually yes, if the booking is confirmed before the edition's cut-off — typically around 5 PM the previous day for most Delhi editions. Sunday and premium editions close earlier, so call the desk to confirm your exact deadline.",
  },
];

const RECRUITMENT_STEPS = [
  { name: "Select publication", text: "Pick the Delhi-edition paper that reaches your hiring audience." },
  { name: "Compose & approve", text: "Send the brief or handwritten matter — the desk drafts and translates it free." },
  { name: "Pay online", text: "Approve the proof, pay online, and we publish and send the e-paper page." },
];

export default function RecruitmentPage() {
  const packages = getRecruitmentPackages();

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Recruitment ads in Delhi", path: "/recruitment" },
          ]),
          webPageJsonLd({
            path: "/recruitment",
            name: "Recruitment ads in Delhi — book online",
            description:
              "Book recruitment ads in Delhi-edition newspapers — Times of India, Navbharat Times, Dainik Jagran, Amar Ujala, Hindustan, Punjab Kesari, The Hindu and Hindustan Times.",
          }),
          serviceJsonLd({
            name: "Recruitment newspaper advertisement booking in Delhi",
            description:
              "Online booking for recruitment and walk-in interview ads in Delhi-edition newspapers — drafting, translation and e-paper proof included.",
            path: "/recruitment",
            category: "Recruitment",
            serviceType: "Recruitment newspaper classified and display advertising",
            areaServed: ["Delhi"],
          }),
          itemListJsonLd({
            name: "Delhi-edition recruitment ad packages",
            items: packages.map((pkg) => ({
              name: pkg.name,
              path: `/newspapers/${pkg.papers[0]?.slug}`,
            })),
          }),
          faqJsonLd(RECRUITMENT_FAQS),
        ]}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
          <nav aria-label="Breadcrumb" className="text-xs text-charcoal">
            <Link href="/" className="hover:text-maroon">
              Home
            </Link>
            <span className="mx-2 text-line">/</span>
            <span className="font-medium text-ink">Recruitment ads in Delhi</span>
          </nav>

          <p className="section-kicker mt-4">Recruitment &amp; appointment</p>
          <h1 className="mt-2 font-display text-3xl leading-[1.05] text-ink sm:text-5xl">
            Recruitment ads in Delhi — book online
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
            26 Delhi &amp; NCR packages from ₹550 to ₹13,500 — Times of India, Navbharat Times,
            Dainik Jagran, Hindustan, Punjab Kesari, Amar Ujala, The Hindu and Hindustan Times.
            First 5 lines/words included · extra lines @20% · free drafting &amp; translation ·
            e-paper proof after print.
          </p>
        </div>

        <div className="border-t border-line bg-paper">
          <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-charcoal sm:px-6 sm:text-xs">
            {RECRUITMENT_STEPS.map((step, index) => (
              <li key={step.name} className="inline-flex items-baseline gap-2">
                <span className="font-display text-base font-bold text-maroon">0{index + 1}</span>
                {step.name}
                {index < RECRUITMENT_STEPS.length - 1 ? (
                  <span className="text-maroon" aria-hidden>
                    →
                  </span>
                ) : null}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <RecruitmentCards packages={packages} />
          <p className="mt-6 text-center text-xs leading-relaxed text-slate">
            Package rates cover the first lines/words shown on each card; extra lines are billed at
            20% per line on line-based packages. 5% GST and 2.5% convenience fee are added at
            checkout — the full amount is shown before you pay.{" "}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="font-semibold text-maroon hover:underline"
            >
              {SITE.phone}
            </a>
            <br />
            For the recruitment FAQ, browse the{" "}
            <Link href="/categories" className="font-semibold text-maroon hover:underline">
              full category guide →
            </Link>
          </p>
        </div>
      </section>

      <section className="border-b border-line bg-paper">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <p className="section-kicker">Questions</p>
          <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
            Recruitment ads in Delhi — FAQ
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {RECRUITMENT_FAQS.map((faq) => (
              <div key={faq.q} className="rounded-xl border border-line bg-white p-5">
                <h3 className="font-display text-base text-ink">{faq.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{faq.a}</p>
              </div>
            ))}
          </div>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-charcoal">
            {[
              "Free drafting & translation",
              "Next-day publication where available",
              "e-paper proof & GST invoice",
              "English & Hindi newspapers",
            ].map((point) => (
              <li key={point} className="inline-flex items-center gap-2">
                <FaCheckCircle className="h-4 w-4 text-maroon" aria-hidden />
                {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-paper-2/60">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <h2 className="font-display text-2xl text-ink sm:text-4xl">
                Hiring now? Get rate in minutes.
              </h2>
              <p className="mt-1.5 text-sm text-charcoal">
                Tell us the post and the paper — we confirm the Delhi-edition rate and publication
                date before you pay.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <EnquiryButton
                className="inline-flex items-center gap-2 rounded-xl bg-maroon px-6 py-3.5 text-sm font-bold text-white shadow-[0_8px_20px_rgba(200,16,46,0.22)] transition hover:-translate-y-0.5 hover:bg-maroon-deep"
                label="Book a recruitment ad"
              >
                Book your recruitment ad <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
              </EnquiryButton>
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="btn-ghost">
                <FaPhoneAlt className="h-3.5 w-3.5" aria-hidden /> {SITE.phone}
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
