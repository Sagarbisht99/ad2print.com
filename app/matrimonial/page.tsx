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
  const groups = getMatrimonialGroups();
  const packageCount = groups.reduce((total, group) => total + group.packages.length, 0);

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
            {packageCount} packages · rate + 5% GST
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

                        <p className="mt-3 text-center text-[12px] leading-relaxed text-charcoal">
                          {pkg.label}
                        </p>
                        <p className="mt-1.5 text-center text-[11px] leading-relaxed text-charcoal/85">
                          {pkg.cities}
                        </p>

                        <div className="mt-auto pt-4">
                          <div className="rounded-md border border-line bg-white px-3 pb-3 pt-2 text-center">
                            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-charcoal">
                              Cost (Per Ad)
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
                text: "Choose the named package above. Each package shows the newspapers and the cities where it is published.",
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
