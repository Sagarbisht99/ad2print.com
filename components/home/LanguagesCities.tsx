 "use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { NewspaperWall } from "@/components/NewspaperWall";
import { getCities, getLanguages, getNewspapers } from "@/lib/data";

export function LanguagesCities() {
  const languages = getLanguages();
  const cities = getCities().slice(0, 12);

  return (
    <section className="border-y border-line bg-paper-2/70">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="section-kicker">Languages</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Publish where readers buy</h2>
            <p className="mt-3 text-charcoal">
              Regional language dailies often outperform big English nationals for local response
              ads. We book across these languages and more.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {languages.map((l) => (
                <span
                  key={l}
                  className="rounded-sm border border-line bg-white px-3 py-1.5 text-sm text-slate-deep"
                >
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div>
            <p className="section-kicker">Cities</p>
            <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">Editions across India</h2>
            <p className="mt-3 text-charcoal">
              Rates and readership change by edition. Pick the city that covers your town — or ask
              us which paper wins for your category.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link
                  key={c}
                  href={`/newspapers?q=${encodeURIComponent(c)}`}
                  className="rounded-sm border border-line bg-white px-3 py-1.5 text-sm text-slate-deep transition hover:border-maroon hover:text-maroon"
                >
                  {c}
                </Link>
              ))}
            </div>
            <Link
              href="/newspapers"
              className="mt-6 inline-block text-sm font-semibold text-maroon hover:underline"
            >
              Browse all newspapers →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export function NewspapersPreview() {
  const newspapers = [...getNewspapers()].sort(
    (a, b) => (b.copies ?? 0) - (a.copies ?? 0),
  );

  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return newspapers;

    return newspapers.filter((n) => {
      const nameMatch = n.name.toLowerCase().includes(q);
      const cityMatch = n.cities.some((c) => c.toLowerCase().includes(q));
      const regionMatch = (n.region ?? "").toLowerCase().includes(q);
      return nameMatch || cityMatch || regionMatch;
    });
  }, [newspapers, query]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-kicker">Newspapers</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-5xl">
            National & regional titles
          </h2>
          <p className="mt-3 max-w-2xl text-charcoal">
            Logos, language, region, and circulation — tap a paper to start booking.
          </p>
        </div>
        <Link
          href="/newspapers"
          className="text-sm font-semibold text-maroon hover:underline"
        >
          View all newspapers →
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search paper or city…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-line bg-white px-4 py-3 text-sm outline-none ring-maroon/30 focus:ring-2"
        />
        {query.trim() ? (
          <p className="text-sm text-charcoal">
            <span className="font-semibold text-ink">{filtered.length}</span> results
          </p>
        ) : null}
      </div>

      <div className="mt-8 rounded-xl border border-line bg-paper-2/50 p-4 sm:p-5">
        <NewspaperWall papers={filtered} maxHeight={620} />
      </div>
    </section>
  );
}
