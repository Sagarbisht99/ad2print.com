"use client";

import Link from "next/link";
import { useState } from "react";
import { FaArrowRight, FaChevronDown } from "react-icons/fa";
import type { RankingCatalog, RankingCategory } from "@/lib/paper-ranking";

function inr(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

export function PaperRanking({ catalog }: { catalog: RankingCatalog }) {
  const [categoryId, setCategoryId] = useState(catalog[0]?.id ?? "matrimonial");
  const [citySlug, setCitySlug] = useState(catalog[0]?.cities[0]?.slug ?? "");

  const category = catalog.find((item) => item.id === categoryId) ?? catalog[0];
  const city = category?.cities.find((item) => item.slug === citySlug) ?? category?.cities[0];
  const offers = city ? (category?.offers[city.slug] ?? []) : [];
  const seeAll = city ? category?.seeAll[city.slug] : undefined;

  if (!category || !city) return null;

  function changeCategory(nextId: RankingCategory["id"]) {
    const next = catalog.find((item) => item.id === nextId);
    setCategoryId(nextId);
    setCitySlug(next?.cities[0]?.slug ?? "");
  }

  return (
    <section className="border-b border-line bg-[#f7f2e7]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-14">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
            Not sure which paper?
          </p>
          <h2 className="mt-4 max-w-xl font-display text-3xl leading-[1.04] text-ink sm:text-5xl">
            Tell us the category and city — we&apos;ll rank the right papers
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-slate-deep sm:text-lg">
            We sort the options by our own desk rate, so you can compare a national daily with a
            regional paper and book the one that fits your budget.
          </p>

          <div className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
            <label className="relative block">
              <span className="sr-only">Ad category</span>
              <select
                value={categoryId}
                onChange={(event) => changeCategory(event.target.value as RankingCategory["id"])}
                className="h-[52px] w-full appearance-none rounded-xl border border-[#e4dccb] bg-white px-4 pr-10 text-sm font-semibold text-ink shadow-sm outline-none transition focus:border-maroon/50 focus:ring-2 focus:ring-maroon/15"
              >
                {catalog.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <FaChevronDown
                className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-charcoal"
                aria-hidden
              />
            </label>

            <label className="relative block">
              <span className="sr-only">City</span>
              <select
                value={city.slug}
                onChange={(event) => setCitySlug(event.target.value)}
                className="h-[52px] w-full appearance-none rounded-xl border border-[#e4dccb] bg-white px-4 pr-10 text-sm font-semibold text-ink shadow-sm outline-none transition focus:border-maroon/50 focus:ring-2 focus:ring-maroon/15"
              >
                {category.cities.map((item) => (
                  <option key={item.slug} value={item.slug}>
                    {item.name}
                  </option>
                ))}
              </select>
              <FaChevronDown
                className="pointer-events-none absolute right-4 top-1/2 h-3 w-3 -translate-y-1/2 text-charcoal"
                aria-hidden
              />
            </label>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-slate">
            Rates are our package rates and exclude 5% GST. The desk confirms the final size and
            publication date before print.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#e4dccb] bg-white shadow-[0_18px_44px_rgba(26,27,30,0.08)]">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-5 py-4 sm:px-7">
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal">
              {category.label} in {city.name}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-charcoal">
              {category.priceLabel}
            </p>
          </div>

          {offers.length === 0 ? (
            <div className="px-5 py-10 text-center sm:px-7">
              <p className="text-sm text-charcoal">
                Rates for this city are confirmed by the desk. Call us and we will quote the paper
                and edition you need.
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-maroon hover:underline"
              >
                Ask for the rate <FaArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {offers.map((offer, index) => (
                <li
                  key={offer.id}
                  className="grid grid-cols-[1.25rem_minmax(0,1fr)_auto] items-center gap-3 px-5 py-3.5 sm:grid-cols-[1.5rem_minmax(0,1fr)_auto] sm:px-7 sm:py-4"
                >
                  <span className="font-display text-xs font-semibold text-maroon sm:text-sm">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold leading-snug text-ink sm:text-[15px]">
                      {offer.name}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-relaxed text-slate sm:text-xs">
                      {offer.detail}
                    </span>
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="whitespace-nowrap font-display text-sm font-bold text-ink sm:text-base">
                      {inr(offer.price)}
                    </span>
                    <Link
                      href={offer.href}
                      className="rounded-lg bg-maroon px-3 py-1.5 text-[11px] font-bold text-white transition hover:bg-maroon-deep sm:px-4 sm:text-xs"
                    >
                      Book
                    </Link>
                  </span>
                </li>
              ))}
            </ul>
          )}

          {seeAll ? (
            <div className="border-t border-line px-5 py-5 text-center sm:px-7">
              <Link
                href={seeAll}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-maroon hover:underline"
              >
                See all papers &amp; rates for {city.name}{" "}
                <FaArrowRight className="h-3 w-3" aria-hidden />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
