"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FaSearch } from "react-icons/fa";
import type { Newspaper } from "@/lib/data";
import { getLanguageCounts, getLanguageLabel } from "@/lib/newspaper-content";
import { NewspaperLogo } from "@/components/NewspaperWall";

export function NewspaperDirectory({
  papers,
  initialQuery = "",
  initialLanguage = "All",
  scrollable = false,
  maxHeight = 620,
}: {
  papers: Newspaper[];
  initialQuery?: string;
  initialLanguage?: string;
  scrollable?: boolean;
  maxHeight?: number;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [language, setLanguage] = useState(initialLanguage);
  const languageCounts = useMemo(() => getLanguageCounts(), []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return papers
      .filter((paper) => language === "All" || paper.language === language)
      .filter((paper) => {
        if (!needle) return true;
        return (
          paper.name.toLowerCase().includes(needle) ||
          paper.language.toLowerCase().includes(needle) ||
          paper.region.toLowerCase().includes(needle) ||
          paper.cities.some((city) => city.toLowerCase().includes(needle))
        );
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [papers, query, language]);

  const grid = (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {filtered.map((paper) => (
        <NewspaperDirectoryCard key={paper.slug} paper={paper} />
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          <LanguagePill
            active={language === "All"}
            onClick={() => setLanguage("All")}
            label={`All (${papers.length})`}
          />
          {languageCounts.map(({ language: item, count }) => (
            <LanguagePill
              key={item}
              active={language === item}
              onClick={() => setLanguage(item)}
              label={`${getLanguageLabel(item)} (${count})`}
            />
          ))}
        </div>

        <label className="relative block w-full lg:w-72">
          <span className="sr-only">Search newspapers</span>
          <FaSearch
            className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate"
            aria-hidden
          />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search a newspaper or city…"
            className="h-11 w-full rounded-xl border border-line bg-white pl-9 pr-3 text-sm text-ink shadow-sm outline-none transition placeholder:text-slate focus:border-maroon/50 focus:ring-2 focus:ring-maroon/15"
          />
        </label>
      </div>

      <p className="mt-5 text-xs font-medium uppercase tracking-[0.14em] text-charcoal">
        {filtered.length} {filtered.length === 1 ? "newspaper" : "newspapers"}
        {language !== "All" ? ` in ${getLanguageLabel(language)}` : ""}
        {query ? ` matching “${query}”` : ""}
      </p>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-xl border border-line bg-white px-4 py-10 text-center text-sm text-charcoal">
          No newspaper matches that search. Try a shorter spelling, clear the language filter, or{" "}
          <Link href="/contact" className="font-semibold text-maroon hover:underline">
            ask the desk
          </Link>
          .
        </p>
      ) : scrollable ? (
        <div className="mt-4 overflow-y-auto overscroll-contain pr-1" style={{ maxHeight }}>
          {grid}
        </div>
      ) : (
        <div className="mt-4">{grid}</div>
      )}
    </div>
  );
}

function LanguagePill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-2 text-xs font-semibold transition sm:text-[13px] ${
        active
          ? "border-ink bg-ink text-white"
          : "border-line bg-white text-ink hover:border-maroon/40 hover:text-maroon"
      }`}
    >
      {label}
    </button>
  );
}

function NewspaperDirectoryCard({ paper }: { paper: Newspaper }) {
  return (
    <Link
      href={`/newspapers/${paper.slug}`}
      className="group flex h-full flex-col rounded-xl border border-line bg-white p-4 transition duration-200 hover:-translate-y-0.5 hover:border-maroon/35 hover:shadow-[0_14px_30px_rgba(26,26,26,0.08)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex h-10 w-24 shrink-0 items-center">
          <NewspaperLogo paper={paper} />
        </div>
        <div className="text-right">
          <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate">Editions</p>
          <p className="font-display text-base leading-tight text-ink">{paper.cities.length}</p>
        </div>
      </div>

      <div className="mt-4 min-w-0 flex-1">
        <p className="text-[15px] font-extrabold leading-tight tracking-tight text-ink group-hover:text-maroon">
          {paper.name}
        </p>
        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-charcoal">
          {paper.language} · {paper.region}
        </p>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate">
          {paper.cities.slice(0, 4).join(", ")}
          {paper.cities.length > 4 ? " and more" : ""}
        </p>
      </div>

      <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-maroon">
        View rates &amp; book
        <span className="transition group-hover:translate-x-0.5" aria-hidden>
          →
        </span>
      </span>
    </Link>
  );
}
