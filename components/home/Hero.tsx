"use client";

import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-line">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #faf8f5 0%, #f3efe9 42%, #f7f0ef 72%, #f2e8e9 100%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-maroon/[0.07] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-[22rem] w-[22rem] rounded-full bg-maroon/[0.09] blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/2 bg-gradient-to-l from-maroon/[0.06] to-transparent lg:block"
        aria-hidden
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-8 lg:py-20">
        <div className="max-w-xl">
          <p className="animate-rise inline-flex items-center gap-2 rounded-full border border-maroon/20 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-maroon shadow-sm backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-maroon" aria-hidden />
            Most booked · Change of Name
          </p>

          <p className="animate-rise mt-6 font-display text-[clamp(3.2rem,7vw,5.4rem)] leading-[0.8] tracking-[-0.06em] text-maroon">
            AD2PRINT
          </p>

          <div className="animate-sweep mt-4 h-1.5 w-24 bg-maroon" />

          <h1 className="animate-rise-delay mt-7 max-w-xl font-display text-[2.05rem] leading-[1.02] text-ink sm:text-[2.7rem] lg:text-[3.2rem]">
            Book your
            <span className="relative mx-2 inline-block text-maroon">
              name change
              <span
                className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-maroon/15 sm:h-4"
                aria-hidden
              />
            </span>
            ad with drafting, proof, and city-wise placement.
          </h1>

          <p className="animate-rise-delay-2 mt-4 max-w-lg text-base leading-relaxed text-charcoal sm:text-lg">
            Publish in the right newspaper edition for passports, banks, Aadhaar, and official
            records — with clear drafting and proof after publication.
          </p>

          <div className="animate-rise-delay-2 mt-9 flex flex-wrap items-center gap-3">
            <Link
              href="/name-change"
              className="btn-primary shadow-[0_10px_28px_rgba(178,31,45,0.28)] transition hover:-translate-y-0.5"
            >
              Change my name
            </Link>
            <Link href="/contact" className="btn-ghost">
              Talk to the desk
            </Link>
          </div>

          <div className="animate-rise-delay-2 mt-7 flex flex-wrap gap-2.5 text-sm text-charcoal/80">
            {[
              "280+ papers",
              "Hindi & English drafts",
              "Proof after print",
            ].map((item) => (
              <span
                key={item}
                className="inline-flex items-center rounded-full border border-line bg-white/70 px-2.5 py-1.5"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="animate-fade relative mx-auto w-full max-w-md lg:max-w-lg">
          <div
            className="pointer-events-none absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-maroon/20 via-transparent to-ink/10 blur-2xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -right-3 top-8 hidden h-24 w-24 border border-maroon/25 sm:block"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -left-4 bottom-10 hidden h-16 w-16 bg-maroon/10 sm:block"
            aria-hidden
          />

          <div className="hero-float relative overflow-hidden rounded-[1.5rem] border border-white/70 bg-white/65 p-3 shadow-[0_24px_60px_rgba(26,27,30,0.14)] backdrop-blur-[2px]">
            <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-line bg-white/85 px-3 py-2 text-[11px] font-medium text-charcoal">
              <span className="inline-flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" aria-hidden />
                Desk support active
              </span>
              <span className="text-maroon">Same day</span>
            </div>

            <div className="rounded-[1rem] border border-line bg-paper p-2">
              <Image
                src="/ads/hero.png"
                alt="Change of Name - Your hassle-free name change starts here at www.ad2print.in"
                width={1024}
                height={1051}
                priority
                unoptimized
                className="mx-auto h-auto max-h-[400px] w-full object-contain sm:max-h-[460px] lg:max-h-[500px]"
              />
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-paper-2 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-maroon">
                  Drafting
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">Included in plan</p>
              </div>
              <div className="rounded-xl border border-line bg-paper-2 p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-maroon">
                  Proof
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">Sent after print</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
