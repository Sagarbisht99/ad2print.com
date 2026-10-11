"use client";

import Image from "next/image";
import Link from "next/link";
import { CategoryTrigger } from "@/components/CategoryTrigger";

const SECTION_IMAGE = "/ads/name-change-section.png";

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
              <Image
                src={SECTION_IMAGE}
                alt="Examples of change-of-name notices published in newspapers"
                width={274}
                height={296}
                sizes="(max-width: 1024px) 100vw, 560px"
                className="mx-auto h-auto max-h-[560px] w-full rounded-xl object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
