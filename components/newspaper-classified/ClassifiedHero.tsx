"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowRight, FaCheckCircle, FaRegClock, FaRegNewspaper } from "react-icons/fa";
import { getCategoryHref } from "@/lib/category-routes";
import { slugifyCity } from "@/lib/data";

type Option = { slug: string; name: string };

export function ClassifiedHero({
  categories,
  cities,
}: {
  categories: Option[];
  cities: string[];
}) {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!category) {
      document.getElementById("classified-category")?.focus();
      return;
    }

    const params = new URLSearchParams();
    if (city) params.set("city", slugifyCity(city));
    const query = params.toString();
    const href = getCategoryHref(category);

    if (category === "change-of-name" && city) {
      router.push(`/name-change/${slugifyCity(city)}`);
      return;
    }

    const separator = href.includes("?") ? "&" : "?";
    router.push(`${href}${query ? `${separator}${query}` : ""}`);
  }

  return (
    <section className="relative isolate overflow-hidden border-b border-line bg-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(200,16,46,0.07),transparent_42%),radial-gradient(circle_at_5%_88%,rgba(200,16,46,0.05),transparent_36%)]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14 lg:pb-20 lg:pt-16">
        <div className="order-2 mx-auto w-full max-w-[460px] lg:order-1">
          <div className="relative mx-auto w-full max-w-[430px] pb-10 pt-3">
            <div
              className="absolute left-5 top-8 h-[90%] w-[82%] -rotate-3 rounded-sm border border-line bg-paper-2 shadow-[0_18px_42px_rgba(26,26,26,0.1)]"
              aria-hidden
            />
            <div className="relative rotate-[-1deg] overflow-hidden rounded-sm border border-line bg-white shadow-[0_26px_60px_rgba(26,26,26,0.18)]">
              <Image
                src="/ads/classified-page.png"
                alt="Sample newspaper classified page showing matrimonial, property, recruitment, public notice, lost and found and vehicle classifieds"
                width={760}
                height={1120}
                priority
                sizes="(max-width: 640px) 88vw, 430px"
                className="h-auto w-full"
              />
            </div>

            <div className="absolute -bottom-1 right-0 w-[180px] rotate-2 rounded-lg border border-line bg-white p-3 shadow-[0_16px_36px_rgba(26,26,26,0.16)] sm:right-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-maroon">
                280+ papers
              </p>
              <p className="mt-1 text-[11px] font-semibold text-ink">Every Indian language</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {["English", "हिन्दी", "தமிழ்", "বাংলা", "मराठी", "ગુજરાતી"].map(
                  (language) => (
                    <span
                      key={language}
                      className="rounded-full border border-line bg-paper px-1.5 py-0.5 text-[8px] font-medium text-charcoal"
                    >
                      {language}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="order-1 max-w-2xl lg:order-2">
          <p className="inline-flex items-center gap-2 rounded-full bg-maroon/[0.07] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-maroon sm:text-xs">
            <FaRegNewspaper className="h-3.5 w-3.5" aria-hidden />
            Classified ads · instant online booking
          </p>

          <h1 className="mt-6 font-display text-[2.4rem] leading-[1.03] tracking-[-0.04em] text-ink sm:text-[3.3rem] lg:text-[3.8rem]">
            Book classified ads in any newspaper instantly
            <span className="text-maroon"> — at the lowest cost.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal sm:text-lg">
            AD2PRINT is the online booking desk for newspaper classified ads in 280+ Indian
            papers — name change, matrimonial, property, recruitment, obituary, lost &amp; found,
            public notices and more. Pick a category and city, send the wording, and the desk
            confirms the rate before you pay.
          </p>

          <form
            onSubmit={submit}
            className="mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-stretch"
            aria-label="Start a newspaper classified ad booking"
          >
            <label className="sr-only" htmlFor="classified-category">
              Select ad category
            </label>
            <select
              id="classified-category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="h-[54px] w-full appearance-none rounded-xl border border-line bg-white px-4 text-sm font-medium text-ink shadow-sm outline-none transition focus:border-maroon/50 focus:ring-2 focus:ring-maroon/15"
            >
              <option value="">Select category</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="classified-city">
              Select city
            </label>
            <select
              id="classified-city"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="h-[54px] w-full appearance-none rounded-xl border border-line bg-white px-4 text-sm font-medium text-ink shadow-sm outline-none transition focus:border-maroon/50 focus:ring-2 focus:ring-maroon/15"
            >
              <option value="">Select city (optional)</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="inline-flex h-[54px] items-center justify-center gap-2 rounded-xl bg-maroon px-7 text-sm font-bold text-white shadow-[0_10px_24px_rgba(200,16,46,0.28)] transition hover:-translate-y-0.5 hover:bg-maroon-deep"
            >
              GO <FaArrowRight className="h-3.5 w-3.5" aria-hidden />
            </button>
          </form>

          <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate">
            <span className="inline-flex items-center gap-1.5">
              <FaRegClock className="h-3.5 w-3.5 text-maroon" aria-hidden />
              Book by 5 PM — runs in tomorrow&apos;s paper where available
            </span>
            <span>No payment until you approve the proof.</span>
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {[
              "280+ newspapers",
              "Free drafting & translation",
              "e-paper proof after print",
            ].map((item) => (
              <li key={item} className="inline-flex items-center gap-2 text-charcoal">
                <FaCheckCircle className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

