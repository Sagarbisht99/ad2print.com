"use client";

import Image from "next/image";
import Link from "next/link";
import { CategoryTrigger } from "@/components/CategoryTrigger";

const SECTION_IMAGE = "/ads/change-of-name-hero.png";

const SAMPLE_ADS = [
  {
    header: "Name change",
    headerClass: "bg-maroon text-white",
    bodyClass: "bg-white",
    text: "I, Aarav Mehta S/o Rajesh Mehta, resident of Flat 00, Example Nagar, Sample City - 000000, have changed my name to Aarav Malhotra and shall hereafter be known as Aarav Malhotra for all purposes.",
  },
  {
    header: "Name change",
    headerClass: "bg-ink text-white",
    bodyClass: "bg-[#eef2f6]",
    text: "I, Kavita Sharma D/o Mahesh Sharma, resident of Flat 00, Example Nagar, Sample City - 000000, declare that my father's name was incorrectly printed in my identity records. The correct name is Mahesh Sharma.",
  },
  {
    header: "Name change",
    headerClass: "bg-maroon text-white",
    bodyClass: "bg-[#f3f3f3] border border-maroon/50",
    text: "I, Rohan Verma S/o Amit Verma, resident of Flat 00, Example Nagar, Sample City - 000000, have changed the name of my minor son Kabir Verma to Kiaan Verma. He shall hereafter be known as Kiaan Verma for all purposes.",
  },
  {
    header: "Name change",
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
    <section id="change-of-name" className="relative overflow-hidden border-b border-line bg-[linear-gradient(135deg,#fffdfb_0%,#f5f0ee_45%,#f2e7e7_100%)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(178,31,45,0.12),transparent_38%)]" aria-hidden />
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-maroon/20 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-maroon shadow-sm">
              <span className="h-2 w-2 rounded-full bg-maroon" aria-hidden />
              Popular notice
            </p>

            <h2 className="mt-5 font-display text-[2.1rem] leading-[1.04] text-ink sm:text-[3rem] lg:text-[3.5rem]">
              Change of Name
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-charcoal sm:text-lg">
              The notice most people book once in a lifetime — for passport, bank, Aadhaar, or
              gazette updates. AD2PRINT writes the standard wording so the paper accepts it the
              first time.
            </p>

            <ul className="mt-7 space-y-3">
              {POINTS.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-ink sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-maroon" aria-hidden />
                  {point}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/name-change" className="btn-primary shadow-[0_10px_28px_rgba(178,31,45,0.18)]">
                Change my name
              </Link>
              <CategoryTrigger slug="change-of-name" className="btn-ghost">
                Quick enquiry
              </CategoryTrigger>
            </div>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-maroon/12 via-transparent to-ink/8 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-[1.4rem] border border-white/70 bg-white/65 p-3 shadow-[0_24px_60px_rgba(26,27,30,0.12)] backdrop-blur-[2px]">
              <div className="mb-3 flex items-center justify-between gap-2 rounded-xl border border-line bg-white/80 px-3 py-2 text-[11px] font-medium text-charcoal">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
                  Gazette-ready wording
                </span>
                <span className="text-maroon">Accepted by papers</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {SAMPLE_ADS.slice(0, 4).map((ad, index) => (
                  <div
                    key={ad.text}
                    className={`overflow-hidden rounded-xl border border-line ${ad.bodyClass} ${
                      index === 2 ? "sm:translate-y-2" : ""
                    }`}
                  >
                    <div className={`px-3 py-2 text-[10px] font-bold uppercase tracking-[0.14em] ${ad.headerClass}`}>
                      {ad.header}
                    </div>
                    <p className="px-3 py-3 text-[11px] leading-relaxed text-ink">
                      {ad.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-paper-2 px-3 py-2.5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-maroon">
                    Published in
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ink">City & national editions</p>
                </div>
                <div className="hidden h-10 w-10 items-center justify-center rounded-full bg-maroon/10 text-lg text-maroon sm:flex">
                  ✓
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl border border-line bg-white/70 px-3 py-3 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border border-line bg-paper-2">
                  <Image
                    src={SECTION_IMAGE}
                    alt="Change of Name sample"
                    fill
                    sizes="40px"
                    className="object-contain p-1"
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-maroon">
                    Fastest route
                  </p>
                  <p className="text-sm font-semibold text-ink">Passport & Aadhaar ready</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
