import type { Metadata } from "next";
import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { NewspaperLogo } from "@/components/NewspaperWall";
import { getMatrimonialGroups } from "@/lib/matrimonial";
import {
  breadcrumbJsonLd,
  faqJsonLd,
  pageMeta,
  serviceJsonLd,
  webPageJsonLd,
} from "@/lib/seo";
import { SITE } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Book Matrimonial Ad in Newspaper Online",
  description:
    "Book a bride wanted or groom wanted matrimonial ad in Times of India, Hindustan Times, Hindustan, Dainik Jagran and other leading newspapers. Pick a package, write your ad and pay online.",
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
    q: "Are the package rates inclusive of GST?",
    a: "No. The package rate is shown before taxes. A 5% GST and a 2.5% convenience fee on rate plus GST are added at checkout, and the full amount is shown before you pay.",
  },
  {
    q: "Can I book more than one newspaper together?",
    a: "Yes. Packages marked as a pair cover two papers in one booking, which is usually better value than booking each paper separately.",
  },
];

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export default function MatrimonialPage() {
  const packages = getMatrimonialGroups().flatMap((group) => group.packages);

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
          }),
          faqJsonLd(MATRIMONIAL_FAQS),
        ]}
      />

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="section-kicker">Matrimonial newspaper ads</p>
          <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold text-ink sm:text-5xl">
            Book a matrimonial ad in leading newspapers
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
            Choose a ready-made package below — no city-wise forms. Every package shows the
            newspapers included and the per-ad rate. Write your bride wanted or groom wanted ad,
            approve the proof and pay online.
          </p>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#packages" className="btn-primary">
              View packages →
            </a>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="text-sm font-semibold text-maroon hover:underline"
            >
              Need help? Call {SITE.phone}
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[
              { title: "Sunday editions", text: "Matrimonial classifieds usually publish on Sunday." },
              { title: "Free drafting", text: "Our desk helps write or refine the ad wording." },
              { title: "Proof after print", text: "Get the e-paper page after publication." },
            ].map((item) => (
              <div key={item.title} className="rounded-xl border border-line bg-paper px-4 py-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-maroon">
                  {item.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div id="packages" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-4">
          <div>
            <p className="section-kicker">Packages</p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink sm:text-4xl">
              Matrimonial ad packages
            </h2>
          </div>
          <p className="text-xs text-charcoal">
            {packages.length} packages · rate + 5% GST
          </p>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <article
              key={pkg.id}
              className="flex h-full flex-col rounded-xl border border-line bg-white p-5 transition hover:-translate-y-0.5 hover:border-maroon/40 hover:shadow-[0_16px_36px_rgba(26,27,30,0.08)]"
            >
              <div className="flex flex-wrap items-center gap-2">
                {pkg.bestSeller ? (
                  <span className="bg-maroon px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                    Best seller
                  </span>
                ) : null}
                {pkg.tag ? (
                  <span className="border border-maroon/40 bg-maroon/8 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.08em] text-maroon">
                    {pkg.tag}
                  </span>
                ) : null}
              </div>

              <h3 className="mt-3 font-display text-lg leading-snug text-ink">{pkg.label}</h3>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                {pkg.papers.map((paper) => (
                  <span
                    key={paper.slug}
                    className="inline-flex h-9 w-28 shrink-0 items-center justify-center overflow-hidden"
                  >
                    <NewspaperLogo paper={paper} className="h-9 w-28 object-contain" />
                  </span>
                ))}
              </div>

              <p className="mt-3 text-xs text-charcoal">
                {pkg.unit} · {pkg.city} edition
              </p>

              <div className="mt-auto flex items-end justify-between gap-3 pt-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal">
                    Package rate
                  </p>
                  <p className="font-display text-2xl font-semibold text-maroon">
                    {pkg.rate ? inr(pkg.rate) : "On request"}
                  </p>
                </div>
                <Link
                  href={
                    pkg.rate
                      ? `/matrimonial/book?city=${encodeURIComponent(pkg.city)}&papers=${pkg.slugs.join(",")}`
                      : "/contact"
                  }
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Book now
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>

      <section className="border-y border-line bg-white/80">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
          <p className="section-kicker">How it works</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">
            Three steps from package to print
          </h2>
          <ol className="mt-8 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Pick your package",
                text: "Choose the city and newspaper package above. The package shows exactly which papers and editions are included.",
              },
              {
                title: "Write your ad",
                text: "Fill in the bride or groom details, your contact number and the release date. The desk can polish the wording for you.",
              },
              {
                title: "Pay and publish",
                text: "Review the proof and pay online. We confirm the publishing date on WhatsApp and send the e-paper page after print.",
              },
            ].map((step, i) => (
              <li key={step.title} className="border-l-2 border-maroon pl-5">
                <p className="font-display text-sm font-semibold text-maroon">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-2 font-display text-xl text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-charcoal">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="section-kicker">Questions</p>
        <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
          Matrimonial ad booking FAQ
        </h2>
        <div className="mt-6 divide-y divide-line border-y border-line">
          {MATRIMONIAL_FAQS.map((faq) => (
            <details key={faq.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-ink sm:text-base [&::-webkit-details-marker]:hidden">
                {faq.q}
                <span className="mt-0.5 shrink-0 text-maroon transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 pr-8 text-sm leading-relaxed text-charcoal">{faq.a}</p>
            </details>
          ))}
        </div>
        <p className="mt-6 text-sm text-charcoal">
          Need a newspaper that is not listed? Call the desk on{" "}
          <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-maroon">
            {SITE.phone}
          </a>{" "}
          or{" "}
          <Link href="/contact" className="font-semibold text-maroon hover:underline">
            send an enquiry
          </Link>
          . {SITE.hours}.
        </p>
      </section>
    </>
  );
}
