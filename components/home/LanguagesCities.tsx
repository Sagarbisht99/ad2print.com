 "use client";

import Link from "next/link";
import { getCities, getLanguages } from "@/lib/data";

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
              Pick the city that covers your town — or ask us which paper wins for your category.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {cities.map((c) => (
                <Link
                  key={c}
                  href="/#cities"
                  className="rounded-sm border border-line bg-white px-3 py-1.5 text-sm text-slate-deep transition hover:border-maroon hover:text-maroon"
                >
                  {c}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
