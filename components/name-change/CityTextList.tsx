"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CITY_IMAGES } from "@/lib/city-images";
import { slugifyCity } from "@/lib/data";

export function cityLabel(city: string) {
  return city === "Delhi" ? "Delhi NCR" : city;
}

export function CityTextList({ cities }: { cities: string[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter((city) => city.toLowerCase().includes(q) || cityLabel(city).toLowerCase().includes(q));
  }, [cities, query]);

  return (
    <section id="cities" className="border-b border-line bg-white">
      <div className="border-b border-line bg-paper-2/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
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

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">
          Book your Name Change Ad in 4 easy steps
        </h2>
        <p className="mt-2 max-w-2xl text-sm font-medium text-charcoal">
          Choose city → Select newspaper → Fill details → Pay online
        </p>

        {filtered.length === 0 ? (
          <p className="mt-8 text-sm text-charcoal">No city matches “{query}”.</p>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            {filtered.map((city) => (
              <li key={city}>
                <Link
                  href={`/name-change/${slugifyCity(city)}`}
                  className="flex items-center gap-2.5 border border-line bg-white px-2.5 py-2 transition hover:bg-paper-2 sm:gap-3 sm:px-3 sm:py-2.5"
                >
                  <span className="inline-flex h-14 w-24 shrink-0 overflow-hidden rounded-md bg-paper-2 sm:h-16 sm:w-28">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        CITY_IMAGES[city] ||
                        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                      }
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="min-w-0 truncate font-semibold text-maroon">{cityLabel(city)}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
