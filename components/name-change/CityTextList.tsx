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


      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
       <div className="flex items-center gap-2">
  <svg className="w-4 h-4 fill-gray-900 shrink-0" viewBox="0 0 24 24">
    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
  </svg>
  <a href="tel:+917982936243" className="text-gray-900 font-bold text-base hover:underline no-underline">
  Need Help Call:- 7982936243
</a>
</div>
        <h2 className="font-display text-xl font-bold text-ink sm:text-3xl">
          Book your Name Change Ad in 4 easy steps
        </h2>
       
        <div className="border-b border-line ">
          <div className="mx-auto flex max-w-7xl items-center justify-between py-3">
            <label className="flex min-w-0 flex-1 flex-col gap-1 text-sm sm:max-w-md sm:flex-row sm:items-center sm:gap-3">
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search your city…"
                className="w-full border border-line bg-white px-3 py-2 text-sm outline-none ring-maroon/30 focus:ring-2 rounded-xl"
              />
            </label>
          </div>
        </div>
        <ol className="mt-4 flex flex-wrap items-center gap-2 sm:mt-5 sm:gap-3">
          {[
            "Choose city",
            "Select newspaper",
            "Fill details",
            "Pay online",
          ].map((step, i) => (
            <li key={step} className="flex items-center gap-2 sm:gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-line bg-paper-2/60 px-3 py-1.5 text-[13px] font-semibold text-ink sm:gap-2.5 sm:px-4 sm:py-2 sm:text-sm">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-maroon text-[10px] font-bold text-white sm:h-6 sm:w-6 sm:text-xs">
                  {i + 1}
                </span>
                {step}
              </span>
              {i < 3 ? <span className="hidden text-charcoal sm:inline" aria-hidden>→</span> : null}
            </li>
          ))}
        </ol>

        {filtered.length === 0 ? (
          <p className="mt-8 text-sm text-charcoal">No city matches “{query}”.</p>
        ) : (
          <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:mt-8 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
            {filtered.map((city) => (
              <li key={city}>
                <Link
                  href={`/name-change/${slugifyCity(city)}`}
                  className="flex items-center gap-2.5 border border-line bg-white px-2.5 py-2 transition hover:bg-paper-2 sm:gap-3 sm:px-3 sm:py-2.5 rounded-xl"
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
