"use client";

import Link from "next/link";
import { useState } from "react";
import type { Newspaper } from "@/lib/data";

function formatCardCopies(copies: number) {
  if (!copies || copies <= 0) return null;
  return `${(copies / 100000).toFixed(1)}L`;
}

export function NewspaperLogo({ paper }: { paper: Newspaper }) {
  const [broken, setBroken] = useState(false);
  const hasLogo = Boolean(paper.logo) && !broken;

  if (hasLogo) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={paper.logo}
        alt={paper.name}
        loading="lazy"
        decoding="async"
        className="block max-h-10 max-w-full object-contain"
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <span
      className="inline-flex h-10 min-w-10 items-center justify-center rounded px-2.5 text-xs font-bold text-white"
      style={{ background: paper.color || "#6D6E71" }}
    >
      {paper.abbr || paper.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function NewspaperCard({ paper }: { paper: Newspaper }) {
  const copies = formatCardCopies(paper.copies ?? 0);
  const meta = paper.region
    ? `${paper.language} · ${paper.region}`
    : paper.language;

  return (
    <Link
      href={`/newspapers/${paper.slug}`}
      className="group flex items-center gap-3 rounded-lg border border-line bg-white px-4 py-3 text-inherit no-underline transition hover:border-maroon/35 hover:shadow-[0_6px_20px_rgba(46,47,50,0.07)]"
    >
      <div className="flex h-10 w-[88px] shrink-0 items-center justify-start">
        <NewspaperLogo paper={paper} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-extrabold leading-tight tracking-tight text-ink group-hover:text-maroon">
          {paper.name}
        </p>
        <p className="mt-0.5 text-[11px] text-charcoal">{meta}</p>
      </div>
      {copies ? (
        <div className="shrink-0 text-right">
          <p className="text-[8px] font-bold tracking-[0.08em] text-charcoal">COPIES</p>
          <p className="text-[14.5px] font-extrabold leading-none text-ink">{copies}</p>
        </div>
      ) : null}
    </Link>
  );
}

export function NewspaperWall({
  papers,
  maxHeight = 620,
}: {
  papers: Newspaper[];
  maxHeight?: number;
}) {
  if (papers.length === 0) {
    return (
      <p className="px-1 py-8 text-[14.5px] text-charcoal">
        No newspaper matches that. Try a shorter spelling, or clear the language filter.
      </p>
    );
  }

  return (
    <div className="overflow-y-auto overscroll-contain" style={{ maxHeight }}>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {papers.map((p) => (
          <NewspaperCard key={p.slug} paper={p} />
        ))}
      </div>
    </div>
  );
}
