"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FaArrowRight } from "react-icons/fa";
import { NewspaperLogo } from "@/components/NewspaperWall";
import type { ObituaryPackage } from "@/lib/obituary";

type SortId = "popularity" | "price-asc" | "price-desc";

const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "popularity", label: "Sort by: Popularity" },
  { id: "price-asc", label: "Price – Low to High" },
  { id: "price-desc", label: "Price – High to Low" },
];

export function ObituaryCards({ packages }: { packages: ObituaryPackage[] }) {
  const [active, setActive] = useState<string>("all");
  const [sort, setSort] = useState<SortId>("popularity");

  const tabs = useMemo(() => {
    const seen = new Map<string, string>();
    for (const pkg of packages) {
      if (!seen.has(pkg.papers[0].slug)) seen.set(pkg.papers[0].slug, pkg.papers[0].name);
    }
    return [...seen.entries()].map(([slug, name]) => ({ slug, name }));
  }, [packages]);

  const visible = useMemo(() => {
    let rows =
      active === "all"
        ? packages
        : packages.filter((pkg) => pkg.papers.some((paper) => paper.slug === active));
    if (sort === "price-asc") rows = [...rows].sort((a, b) => (a.rate ?? 0) - (b.rate ?? 0));
    else if (sort === "price-desc") rows = [...rows].sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0));
    return rows;
  }, [active, packages, sort]);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter by newspaper"
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          role="tab"
          aria-selected={active === "all"}
          onClick={() => setActive("all")}
          className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-[13px] ${
            active === "all"
              ? "border-maroon bg-maroon text-white shadow-[0_6px_16px_rgba(200,16,46,0.25)]"
              : "border-line bg-white text-charcoal hover:border-maroon/40 hover:text-maroon"
          }`}
        >
          All
        </button>
        {tabs.map((tab) => (
          <button
            key={tab.slug}
            type="button"
            role="tab"
            aria-selected={active === tab.slug}
            onClick={() => setActive(active === tab.slug ? "all" : tab.slug)}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-[13px] ${
              active === tab.slug
                ? "border-maroon bg-maroon text-white shadow-[0_6px_16px_rgba(200,16,46,0.25)]"
                : "border-line bg-white text-charcoal hover:border-maroon/40 hover:text-maroon"
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-slate">
          {visible.length} of {packages.length} packages
        </p>
        <label className="text-[11px] font-medium text-charcoal">
          <span className="sr-only">Sort packages</span>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as SortId)}
            className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs font-medium text-ink outline-none focus:border-maroon/50"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {visible.map((pkg) => (
          <article
            key={pkg.id}
            className="flex h-full flex-col overflow-hidden rounded-xl border border-line bg-white text-center transition hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(26,27,30,0.12)]"
          >
            <div className="flex h-20 items-center justify-center gap-2 px-3 pt-3">
              {pkg.papers.slice(0, 2).map((paper) => (
                <NewspaperLogo
                  key={paper.slug}
                  paper={paper}
                  className="max-h-12 max-w-[5.5rem] object-contain"
                />
              ))}
            </div>

            <div className="border-t border-line px-3 pt-3">
              <h2 className="line-clamp-2 min-h-[2.5rem] font-display text-[13px] font-bold leading-snug text-ink">
                {pkg.papers[0].name}
                {pkg.papers.length > 1 ? (
                  <>
                    {" + "}
                    {pkg.papers[1].name}
                  </>
                ) : null}
                {" — "}
                {pkg.size} Cm{pkg.bw ? " (B/w)" : ""}
              </h2>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-charcoal">
                {pkg.papers.length > 1 ? "Two papers" : pkg.papers[0].language} · Delhi NCR
              </p>
              <p className="mt-2 font-display text-xl font-bold text-maroon">
                {pkg.rate ? `₹${pkg.rate.toLocaleString("en-IN")}` : "On request"}
                <span className="mt-0.5 block text-[9px] font-sans font-semibold uppercase tracking-[0.14em] text-slate">
                  {pkg.unit} · Size {pkg.size} cm · +5% GST
                </span>
              </p>
            </div>

            <div className="mt-auto grid grid-cols-2 gap-2 p-3 pt-3">
              <Link
                href={`/newspapers/${pkg.papers[0]?.slug}`}
                className="inline-flex items-center justify-center rounded-lg border border-ink bg-ink px-2 py-2 text-[11px] font-semibold text-white transition hover:bg-charcoal"
              >
                Edition Detail
              </Link>
              <Link
                href={`/obituary/book?pkg=${encodeURIComponent(pkg.id)}`}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-maroon px-2 py-2 text-[11px] font-bold text-white transition hover:bg-maroon-deep"
              >
                Book now <FaArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line bg-paper px-6 py-8 text-center text-sm text-charcoal">
          No packages for this paper — tap All to see everything.
        </p>
      ) : null}
    </div>
  );
}
