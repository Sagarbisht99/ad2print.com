"use client";

import Link from "next/link";
import { useState } from "react";
import type { Newspaper } from "@/lib/data";

export function NewspaperLogo({
  paper,
  className,
}: {
  paper: Newspaper;
  className?: string;
}) {
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
        className={className ?? "block max-h-10 max-w-full object-contain"}
        onError={() => setBroken(true)}
      />
    );
  }

  return (
    <span
      className={
        className
          ? `inline-flex items-center justify-center rounded text-xs font-bold text-white ${className}`
          : "inline-flex h-10 min-w-10 items-center justify-center rounded px-2.5 text-xs font-bold text-white"
      }
      style={{ background: paper.color || "#6D6E71" }}
    >
      {paper.abbr || paper.name.slice(0, 2).toUpperCase()}
    </span>
  );
}

export function NewspaperCard({ paper }: { paper: Newspaper }) {
  const meta = paper.region
    ? `${paper.language} · ${paper.region}`
    : paper.language;
  const cityPreview = paper.cities.slice(0, 3).join(", ");

  return (
    <Link
      href={`/newspapers/${paper.slug}`}
      className="group flex h-full flex-col border border-line bg-white p-4 text-inherit no-underline transition hover:-translate-y-0.5 hover:border-maroon/35 hover:shadow-[0_12px_28px_rgba(46,47,50,0.08)]"
    >
      <div className="flex h-10 w-22 shrink-0 items-center justify-start">
        <NewspaperLogo paper={paper} />
      </div>
      <div className="mt-4 min-w-0 flex-1">
        <p className="text-base font-extrabold leading-tight tracking-tight text-ink group-hover:text-maroon">
          {paper.name}
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-charcoal">{meta}</p>
        <p className="mt-3 text-sm leading-relaxed text-charcoal">
          {cityPreview}
          {paper.cities.length > 3 ? " and more editions" : ""}
        </p>
      </div>
      <p className="mt-4 text-sm font-semibold text-maroon">
        View newspaper <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
      </p>
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
