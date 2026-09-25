"use client";

import Image from "next/image";
import Link from "next/link";
import { CategoryTrigger } from "@/components/CategoryTrigger";

const SECTION_IMAGE = "/ads/change-of-name-hero.png";

const SAMPLE_ADS = [
  {
    header: "Change of Name",
    headerClass: "bg-maroon text-white",
    bodyClass: "bg-white",
    text: "I, hitherto known as Anuj S/o Pawan Kumar R/o H.No.1492, Gali No.4-B, Swatantra Nagar, Narela, Delhi-110040 have changed my name and shall hereafter be known as Anuj Kumar for all purposes.",
  },
  {
    header: "Name Change",
    headerClass: "bg-ink text-white",
    bodyClass: "bg-[#eef2f6]",
    text: "I, Savitri D/o Amar Singh W/o Bhoop Singh R/o H.No. G-82, Punjabi Colony, Narela, Delhi-110040, do hereby declare that the name of my father has been wrongly written in my PAN Card as Umar Singh. The actual name of my father is Amar Singh.",
  },
  {
    header: "Change of Name",
    headerClass: "bg-maroon text-white",
    bodyClass: "bg-[#f3f3f3] border border-maroon/50",
    text: "I, Lekhraj Singh S/o Ajit Singh R/o RZ-119A/120B, Gali No.8A, DD-House, Kailashpuri Extension, Palam Colony, Palam Village, South West Delhi-110045, have changed the name of my minor son Shashwat Singh aged 11 years and he shall hereafter be known as Leyaansh Singh.",
  },
  {
    header: "Name Change",
    headerClass: "bg-ink text-white",
    bodyClass: "bg-[#e8edf2]",
    text: "I, Sheik Jenia Hasseen W/o Mohibur Biswas R/o N-137, N-Block, Gali No.1, Narayan Nagar, Laxmi Nagar, Delhi-110092 declare that my name has been wrongly written as S K Jenia Hasseen in my 10th and 12th Certificates, SK Jenia Hassen and SK. Jenia Hassen in my Graduation and Post Graduation Certificates respectively. The correct name is Sheik Jenia Hasseen, which may be amended accordingly.",
  },
];

const POINTS = [
  "Passport, PAN, bank, Aadhaar & gazette-ready wording",
  "We draft and translate the notice for you",
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
                How a name-change notice looks in print
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
