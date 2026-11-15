"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaArrowRight, FaCheckCircle, FaRegNewspaper } from "react-icons/fa";
import { getCategoryHref } from "@/lib/category-routes";
import { slugifyCity } from "@/lib/data";
import { SITE } from "@/lib/site";

type Option = { slug: string; name: string };

export function HomeHero({
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
      document.getElementById("category-select")?.focus();
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
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(200,16,46,0.075),transparent_44%),radial-gradient(circle_at_8%_92%,rgba(200,16,46,0.05),transparent_38%)]"
        aria-hidden
      />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pb-12 pt-10 sm:px-6 sm:pb-16 sm:pt-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-20 lg:pt-16">
        <div className="max-w-2xl">
          <p className="inline-flex items-center gap-2 rounded-full bg-maroon/[0.07] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-maroon sm:text-xs">
            <FaRegNewspaper className="h-3.5 w-3.5" aria-hidden />
            Instant online booking · 280+ papers · every language
          </p>

          <h1 className="mt-6 font-display text-[2.45rem] leading-[1.02] tracking-[-0.045em] text-ink sm:text-[3.4rem] lg:text-[3.9rem]">
            Book Newspaper Ads Instantly
            <br className="hidden sm:block" />{" "}
            <span className="whitespace-nowrap">online —</span>{" "}
            <span className="text-maroon">at the lowest cost!</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal sm:text-lg">
            AD2PRINT is the online booking desk for classified and display ads in 280+ Indian
            newspapers — matrimonial, name change, property, recruitment, statutory and more, in
            any city and any language.
          </p>

          <form
            onSubmit={submit}
            className="mt-8 grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-stretch"
            aria-label="Start a newspaper ad booking"
          >
            <label className="sr-only" htmlFor="category-select">
              Select ad category
            </label>
            <select
              id="category-select"
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

            <label className="sr-only" htmlFor="city-select">
              Select city
            </label>
            <select
              id="city-select"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              className="h-[54px] w-full appearance-none rounded-xl border border-line bg-white px-4 text-sm font-medium text-ink shadow-sm outline-none transition focus:border-maroon/50 focus:ring-2 focus:ring-maroon/15"
            >
              <option value="">Select city</option>
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

          <p className="mt-3 text-xs text-slate">
            Pick a category to see formats, newspapers and the live rate route. No payment until
            you approve the proof.
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm">
            {[
              "280+ newspapers",
              "Free drafting & translation",
              "Proof after print",
            ].map((item) => (
              <li key={item} className="inline-flex items-center gap-2 text-charcoal">
                <FaCheckCircle className="h-4 w-4 shrink-0 text-maroon" aria-hidden />
                <span className="font-medium">{item}</span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm text-charcoal">
            Prefer to talk?{" "}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="font-semibold text-maroon underline decoration-maroon/25 underline-offset-4 hover:decoration-maroon"
            >
              {SITE.phone}
            </a>{" "}
            · desk open 9 AM – 9 PM, all days.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
          <NewspaperCollage />
        </div>
      </div>
    </section>
  );
}

function NewspaperCollage() {
  return (
    <div className="relative mx-auto w-full max-w-[500px] pb-10 pt-3">
      <div
        className="absolute left-6 top-9 h-[88%] w-[76%] -rotate-6 rounded-sm border border-line bg-paper-2 shadow-[0_18px_42px_rgba(26,26,26,0.1)]"
        aria-hidden
      />

      <div className="relative mx-auto w-[84%] max-w-[340px] rotate-[1.5deg]">
        <Image
          src="https://www.releasemyad.com/assets/microsite/assets/news-samples/toi-front-page.png?v=e55dd17b"
          alt="Times of India front page shown as a sample Indian newspaper for booking classified and display ads with AD2PRINT"
          width={298}
          height={468}
          priority
          unoptimized
          className="h-auto w-full rounded-sm border border-line object-cover shadow-[0_26px_60px_rgba(26,26,26,0.2)]"
        />
      </div>

      <div className="absolute -bottom-1 right-0 w-[185px] rotate-3 rounded-lg border border-line bg-white p-3 shadow-[0_16px_36px_rgba(26,26,26,0.16)] sm:right-2">
        <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-maroon">
          280+ papers
        </p>
        <p className="mt-1 text-[11px] font-semibold text-ink">Every Indian language</p>
        <div className="mt-2 flex flex-wrap gap-1">
          {["English", "हिन्दी", "தமிழ்", "বাংলা", "मराठी", "ગુજરાતી"].map((language) => (
            <span
              key={language}
              className="rounded-full border border-line bg-paper px-1.5 py-0.5 text-[8px] font-medium text-charcoal"
            >
              {language}
            </span>
          ))}
        </div>
      </div>

      <div className="absolute -left-1 bottom-16 hidden rotate-[-4deg] rounded-lg border border-line bg-white px-3 py-2 shadow-[0_14px_30px_rgba(26,26,26,0.12)] sm:block">
        <p className="text-[8px] font-bold uppercase tracking-[0.16em] text-slate">Next-day print</p>
        <p className="mt-0.5 text-[11px] font-semibold text-ink">Book by 5 PM</p>
      </div>
    </div>
  );
}
