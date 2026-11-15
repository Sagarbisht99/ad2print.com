"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { FaSearch, FaWhatsapp } from "react-icons/fa";
import { cityDisplayName, getCityImage } from "@/lib/city-images";
import { slugifyCity } from "@/lib/data";
import { SITE } from "@/lib/site";

export function NameChangeCityPicker({ cities }: { cities: string[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const items = useMemo(() => {
    if (!q) return cities;
    return cities.filter(
      (city) =>
        city.toLowerCase().includes(q) ||
        cityDisplayName(city).toLowerCase().includes(q),
    );
  }, [cities, q]);

  return (
    <section id="cities" className="scroll-mt-24 border-b border-line bg-white">
      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-1.5 px-4 py-2.5 text-xs text-slate sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6">
          <p className="font-medium">
            Need help?{" "}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="font-bold text-maroon hover:underline"
            >
              Call {SITE.phone}
            </a>
          </p>
          <p className="text-charcoal">
            Steps: Choose your city → Choose newspaper → Fill your details → Pay online
          </p>
        </div>
      </div>

      <div className="bg-paper-2/70">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
          <label
            htmlFor="city-search"
            className="hidden shrink-0 text-xs font-bold uppercase tracking-[0.08em] text-charcoal sm:block"
          >
            Search your city
          </label>
          <div className="relative w-full sm:max-w-xs">
            <FaSearch
              className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate"
              aria-hidden
            />
            <input
              id="city-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search your city..."
              autoComplete="off"
              className="h-10 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-sm text-ink outline-none transition focus:border-maroon/50 focus:ring-2 focus:ring-maroon/15"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10">
        <h1 className="font-display text-2xl tracking-[-0.02em] text-ink sm:text-4xl">
          Book your Name Change Ad in 4 easy steps
        </h1>
        <p className="mt-2 text-sm text-charcoal sm:text-base">
          Choose city → Select newspaper → Fill details → Pay online
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 sm:pb-16">
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((city) => {
              const image = getCityImage(city);
              const name = cityDisplayName(city);

              return (
                <Link
                  key={city}
                  href={`/name-change/${slugifyCity(city)}`}
                  className="group flex items-center gap-3 rounded-xl border border-line bg-white p-2 shadow-sm transition hover:border-maroon/40 hover:shadow-[0_14px_30px_rgba(200,16,46,0.12)]"
                  aria-label={`Book a name change ad in ${name}`}
                >
                  {image ? (
                    // Remote city photos come from several hosts; plain img keeps the list light.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={image}
                      alt={`${name} city`}
                      width={112}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-20 shrink-0 rounded-lg border border-line object-cover object-center sm:h-16 sm:w-28"
                    />
                  ) : (
                    <span
                      className="h-14 w-20 shrink-0 rounded-lg bg-[linear-gradient(135deg,#8a0a1f_0%,#c8102e_55%,#1a1b1e_100%)] sm:h-16 sm:w-28"
                      aria-hidden
                    />
                  )}
                  <span className="min-w-0">
                    <span className="block font-display text-sm font-semibold leading-snug text-maroon transition group-hover:text-maroon-deep sm:text-base">
                      {name}
                    </span>
                    <span className="mt-0.5 hidden text-[10px] font-medium uppercase tracking-[0.1em] text-slate sm:block">
                      View papers →
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-line bg-paper px-6 py-12 text-center">
            <p className="text-sm text-charcoal">
              No city matches &ldquo;{query}&rdquo;. Try a nearby metro or call the desk.
            </p>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[#0b6b37]/25 bg-white px-4 py-2.5 text-sm font-semibold text-[#0b6b37] hover:border-[#0b6b37]/50"
            >
              <FaWhatsapp className="h-4 w-4" aria-hidden /> Ask the desk on WhatsApp
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
