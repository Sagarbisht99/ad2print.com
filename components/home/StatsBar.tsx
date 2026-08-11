"use client";

import { getNewspapers, type Newspaper } from "@/lib/data";

const MARQUEE_SLUGS = [
  "times-of-india",
  "the-hindu",
  "hindustan-times",
  "tribune",
  "indian-express",
  "economic-times",
  "deccan-chronicle",
  "telegraph",
  "mint",
  "business-standard",
  "mirror",
  "mid-day",
  "deccan-herald",
  "new-indian-express",
  "financial-express",
];

function LogoItem({ paper }: { paper: Newspaper }) {
  return (
    <div className="flex h-14 w-[140px] shrink-0 items-center justify-center px-4 sm:h-16 sm:w-[160px]">
      {paper.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={paper.logo}
          alt={paper.name}
          loading="lazy"
          decoding="async"
          className="max-h-10 max-w-full object-contain opacity-90 transition hover:opacity-100 sm:max-h-11"
        />
      ) : (
        <span className="text-sm font-extrabold tracking-tight text-slate-deep/70">
          {paper.abbr || paper.name}
        </span>
      )}
    </div>
  );
}

export function StatsBar() {
  const bySlug = new Map(getNewspapers().map((p) => [p.slug, p]));
  const papers = MARQUEE_SLUGS.map((s) => bySlug.get(s)).filter(
    (p): p is Newspaper => Boolean(p),
  );
  const loop = [...papers, ...papers];

  return (
    <section className="border-y border-line bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-charcoal sm:text-xs">
          Trusted to book in 280+ newspapers — national &amp; every regional language
        </p>
      </div>

      <div className="relative mt-6 overflow-hidden pb-8 sm:mt-8 sm:pb-10">
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-paper-2 to-transparent sm:w-20"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-paper-2 to-transparent sm:w-20"
          aria-hidden
        />

        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {loop.map((p, i) => (
            <LogoItem key={`${p.slug}-${i}`} paper={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
