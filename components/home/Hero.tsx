"use client";

import Image from "next/image";
import Link from "next/link";
import { useCategoryEnquiry } from "@/components/CategoryEnquiry";
import { HeroTypewriter } from "@/components/home/HeroTypewriter";
import { getPopularCategories } from "@/lib/data";

export function Hero() {
  const popular = getPopularCategories().slice(0, 6);
  const { openCategory } = useCategoryEnquiry();

  return (
    <section className="overflow-hidden border-b border-line bg-white">
      <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:py-16">
        <div className="max-w-xl">
          <span className="animate-rise inline-flex items-center rounded-full bg-maroon/10 px-3.5 py-1.5 text-xs font-semibold text-maroon sm:text-sm">
            Instant online booking · 280+ papers · every language
          </span>

          <h1 className="animate-rise-delay mt-6 font-display text-[2rem] leading-[1.15] tracking-tight text-ink sm:text-4xl md:text-[2.75rem] lg:text-[3.1rem]">
            Book Newspaper Ads Instantly online —{" "}
            <HeroTypewriter />
          </h1>

          <p className="animate-rise-delay-2 mt-5 text-base leading-relaxed text-charcoal sm:text-lg">
            Name change, matrimonial, property, obituary, public notice and more — in any newspaper,
            any city, any language. We write and translate it for you, and prove it ran.
          </p>

          <div className="animate-rise-delay-2 mt-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-charcoal">
              Popular categories — tap to enquire
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popular.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => openCategory(cat.slug)}
                  className="rounded-full border border-line bg-paper-2 px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-maroon hover:bg-maroon hover:!text-white"
                >
                  {cat.name}
                </button>
              ))}
              <a
                href="#categories"
                className="rounded-full border border-maroon/30 px-3 py-1.5 text-xs font-semibold text-maroon hover:bg-maroon/5"
              >
                All categories ↓
              </a>
            </div>
          </div>

          <div className="animate-rise-delay-2 mt-8 flex flex-wrap gap-3">
            <Link
              href="/categories"
              className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-6 py-3.5 text-sm font-semibold !text-white shadow-sm transition hover:bg-maroon-deep"
            >
              Book Classified Ad →
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 rounded-full border border-maroon bg-white px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-maroon/5"
            >
              Contact us →
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[360px] lg:max-w-none lg:justify-self-end">
          <div className="relative mx-auto w-fit">
            <div
              className="absolute -right-3 top-4 h-[92%] w-[88%] rotate-[7deg] rounded-sm bg-slate/20"
              aria-hidden
            />
            <div
              className="absolute -right-1.5 top-2 h-[95%] w-[94%] rotate-[3.5deg] rounded-sm bg-white shadow-md"
              aria-hidden
            />
            <Image
              src="/ads/toi-front-page.png"
              alt="Sample newspaper front page with a display advertisement"
              width={298}
              height={468}
              priority
              className="relative z-[1] h-auto w-[min(78vw,300px)] rotate-[1deg] object-contain shadow-[0_24px_60px_rgba(46,47,50,0.2)] animate-fade lg:w-[320px]"
            />
            <div className="absolute bottom-4 right-0 z-[2] w-[min(90%,220px)] rounded-xl border border-line bg-white p-3.5 shadow-[0_12px_30px_rgba(46,47,50,0.14)] sm:bottom-6 sm:-right-2 sm:w-[230px]">
              <p className="text-sm font-semibold text-ink">280+ papers, every language</p>
              <div className="mt-2.5 flex flex-wrap gap-x-2.5 gap-y-1 text-[13px] text-charcoal">
                <span>English</span>
                <span>हिन्दी</span>
                <span>मराठी</span>
                <span>தமிழ்</span>
                <span>বাংলা</span>
                <span>తెలుగు</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
