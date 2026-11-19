"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import { NewspaperLogo } from "@/components/NewspaperWall";
import type { LostFoundPackage } from "@/lib/lost-found";
import { BookEnquiryButton } from "@/components/BookEnquiryButton";

type SortId = "popularity" | "price-asc" | "price-desc";

const SORT_OPTIONS: { id: SortId; label: string }[] = [
  { id: "popularity", label: "Sort by: Popularity" },
  { id: "price-asc", label: "Price – Low to High" },
  { id: "price-desc", label: "Price – High to Low" },
];

export function LostFoundCards({ packages }: { packages: LostFoundPackage[] }) {
  const [city, setCity] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortId>("popularity");

  const cities = useMemo(() => {
    const seen = new Map<string, number>();
    for (const pkg of packages) {
      seen.set(pkg.city, (seen.get(pkg.city) ?? 0) + 1);
    }
    return [...seen.entries()].map(([city, count]) => ({ city, count }));
  }, [packages]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    let rows = packages;
    if (city !== "all") rows = rows.filter((pkg) => pkg.city === city);
    if (q) {
      rows = rows.filter(
        (pkg) =>
          pkg.name.toLowerCase().includes(q) ||
          pkg.city.toLowerCase().includes(q),
      );
    }
    if (sort === "price-asc") rows = [...rows].sort((a, b) => (a.rate ?? 0) - (b.rate ?? 0));
    else if (sort === "price-desc") rows = [...rows].sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0));
    return rows;
  }, [packages, city, query, sort]);

  return (
    <div>
      <div
        className="relative"
        role="search"
      >
        <FaSearch
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate"
          aria-hidden
        />
        <input
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search newspaper or city (e.g. Times of India, Patna, Chennai)..."
          aria-label="Search lost & found packages by newspaper or city"
          className="h-11 w-full rounded-xl border border-line bg-white pl-10 pr-3 text-sm text-ink outline-none placeholder:text-charcoal/70 focus:border-maroon/50 focus:ring-2 focus:ring-maroon/15"
        />
      </div>

      <div
        role="tablist"
        aria-label="Filter by city"
        className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          role="tab"
          aria-selected={city === "all"}
          onClick={() => setCity("all")}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-[13px] ${
            city === "all"
              ? "border-maroon bg-maroon text-white"
              : "border-line bg-white text-charcoal hover:border-maroon/40 hover:text-maroon"
          }`}
        >
          All · {packages.length}
        </button>
        {cities.map(({ city: itemCity, count }) => (
          <button
            key={itemCity}
            type="button"
            role="tab"
            aria-selected={city === itemCity}
            onClick={() => setCity(city === itemCity ? "all" : itemCity)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold transition sm:text-[13px] ${
              city === itemCity
                ? "border-maroon bg-maroon text-white"
                : "border-line bg-white text-charcoal hover:border-maroon/40 hover:text-maroon"
            }`}
          >
            {itemCity} · {count}
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
            <div className="flex h-20 items-center justify-center gap-2 border-b border-line bg-paper-2/30 px-3 pt-3">
              <NewspaperLogo
                paper={pkg.papers[0]}
                className="max-h-12 max-w-[8rem] object-contain"
              />
            </div>
            <div className="px-3 pt-3">
              <h2 className="line-clamp-2 min-h-[2.5rem] font-display text-[13px] font-bold leading-snug text-ink">
                {pkg.name}
              </h2>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-maroon">
                {pkg.city}
              </p>
              <p className="mt-2 font-display text-xl font-bold text-maroon">
                {pkg.rate ? `₹${pkg.rate.toLocaleString("en-IN")}` : "On request"}
                <span className="mt-0.5 block text-[9px] font-sans font-semibold uppercase tracking-[0.14em] text-slate">
                  First 5 lines
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
              <BookEnquiryButton
                message={`I want to book the lost & found package: ${pkg.name} — ${pkg.label}${pkg.rate ? ` (₹${pkg.rate.toLocaleString("en-IN")})` : ""}. Please share the next steps.`}
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-maroon px-2 py-2 text-[11px] font-bold text-white transition hover:bg-maroon-deep"
              >
                Book now <FaArrowRight className="h-3 w-3" aria-hidden />
              </BookEnquiryButton>
            </div>
          </article>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-line bg-paper px-6 py-8 text-center text-sm text-charcoal">
          No match — try another city or newspaper name.
        </p>
      ) : null}
    </div>
  );
}
