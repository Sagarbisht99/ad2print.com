"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { slugifyCity } from "@/lib/data";

export function CityTextList({ cities }: { cities: { city: string; count: number }[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter(({ city }) => city.toLowerCase().includes(q));
  }, [cities, query]);

  return (
    <section id="cities" className="border-b border-line bg-white">
      <div className="border-b border-line bg-paper-2/80">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-sm font-semibold text-maroon">
            Help / WhatsApp — search a city, then pick a newspaper
          </p>
          <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm sm:max-w-md sm:flex-row sm:items-center sm:gap-3">
            <span className="shrink-0 font-medium text-ink">Search your city</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search your city…"
              className="w-full border border-line bg-white px-3 py-2 text-sm outline-none ring-maroon/30 focus:ring-2"
            />
          </label>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">Select city for advertising</h2>
        <p className="mt-2 max-w-2xl text-sm text-charcoal">
          Name-change notices run in the city edition your office asks for. Choose a city below —
          you will pick the newspaper next, then compose the notice.
        </p>

        {filtered.length === 0 ? (
          <p className="mt-8 text-sm text-charcoal">No city matches “{query}”.</p>
        ) : (
          <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {filtered.map(({ city, count }) => (
              <li key={city}>
                <Link
                  href={`/name-change/${slugifyCity(city)}`}
                  className="text-sm font-semibold text-maroon hover:underline"
                >
                  {city}
                  <span className="ml-1 font-normal text-charcoal">({count})</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
