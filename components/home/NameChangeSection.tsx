"use client";

import Image from "next/image";
import Link from "next/link";
import { CategoryTrigger } from "@/components/CategoryTrigger";

const SECTION_IMAGE = "/ads/change-of-name-hero.png";

const SAMPLE_ADS = [
  {
    header: "Public Notice",
    headerClass: "bg-maroon text-white",
    bodyClass: "bg-white",
    text: "I, Aarav Mehta S/o Rajesh Mehta, resident of Flat 00, Example Nagar, Sample City - 000000, have changed my name to Aarav Malhotra and shall hereafter be known as Aarav Malhotra for all purposes.",
  },
  {
    header: "Public Notice",
    headerClass: "bg-ink text-white",
    bodyClass: "bg-[#eef2f6]",
    text: "I, Kavita Sharma D/o Mahesh Sharma, resident of Flat 00, Example Nagar, Sample City - 000000, declare that my father's name was incorrectly printed in my identity records. The correct name is Mahesh Sharma.",
  },
  {
    header: "Public Notice",
    headerClass: "bg-maroon text-white",
    bodyClass: "bg-[#f3f3f3] border border-maroon/50",
    text: "I, Rohan Verma S/o Amit Verma, resident of Flat 00, Example Nagar, Sample City - 000000, have changed the name of my minor son Kabir Verma to Kiaan Verma. He shall hereafter be known as Kiaan Verma for all purposes.",
  },
  {
    header: "Public Notice",
    headerClass: "bg-ink text-white",
    bodyClass: "bg-[#e8edf2]",
    text: "It is for general information that I, Meera Kapoor W/o Nitin Kapoor, resident of Flat 00, Example Nagar, Sample City - 000000, declare that my name was incorrectly printed in my educational certificates. My correct name is Meera Kapoor.",
  },
];

const POINTS = [
  "Book in the edition your paperwork needs",
  "Publication proof after the ad runs",
];

export function NameChangeSection() {
  return (
    <section id="change-of-name" className="border-b border-line bg-white/80">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <p className="section-kicker">Popular notice</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-5xl">Change of Name</h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal sm:text-lg">
              The notice most people book once in a lifetime — for passport, bank, Aadhaar, or
              gazette updates. AD2PRINT writes the standard wording so the paper accepts it the
              first time.
            </p>

            <ul className="mt-8 space-y-3">
              {POINTS.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-ink sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 bg-maroon" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/name-change" className="btn-primary">
                Change my name
              </Link>
              <CategoryTrigger slug="change-of-name" className="btn-ghost">
                Quick enquiry
              </CategoryTrigger>
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden border border-line bg-paper-2 p-2 shadow-[0_18px_45px_rgba(26,27,30,0.08)]">
              <div className="relative aspect-square overflow-hidden bg-white">
              <Image
                src={SECTION_IMAGE}
                alt="Change of Name - Your hassle-free name change starts here at www.ad2print.in"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 40vw"
                className="object-contain object-center"
              />
              </div>
            </div>
            <p className="mt-3 text-xs text-charcoal">
              Your notice runs in the classified columns — clear, accepted wording for government
              records.
            </p>
          </div>
        </div>

        <div className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Sample ads</p>
              <h3 className="mt-2 font-display text-2xl text-ink sm:text-3xl">
                How a name-change ads looks like in print
              </h3>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {SAMPLE_ADS.map((ad) => (
              <article key={ad.text} className="overflow-hidden border border-line">
                <div className={`px-3 py-2 ${ad.headerClass}`}>
                  <p className="text-center text-[11px] font-bold uppercase tracking-[0.12em] sm:text-xs">
                    {ad.header}
                  </p>
                </div>
                <p className={`px-3.5 py-3.5 text-[12.5px] leading-relaxed text-ink sm:text-sm ${ad.bodyClass}`}>
                  {ad.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
