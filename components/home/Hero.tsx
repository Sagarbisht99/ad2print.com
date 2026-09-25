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

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:py-20">
        <div className="max-w-xl">
          <p className="animate-rise inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-maroon">
            <span className="h-px w-8 bg-maroon" aria-hidden />
            Most booked · Change of Name
          </p>

          <p className="animate-rise mt-5 font-display text-[clamp(3rem,9vw,6.2rem)] leading-[0.88] tracking-tight text-maroon">
            AD2PRINT
          </p>

          <div className="animate-sweep mt-5 h-1.5 w-28 bg-maroon" />

          <h1 className="animate-rise-delay mt-8 font-display text-[1.75rem] leading-[1.12] text-ink sm:text-[2.35rem] lg:text-[2.7rem]">
            Publish your{" "}
            <span className="relative inline-block text-maroon">
              Change of Name
              <span
                className="absolute inset-x-0 bottom-1 -z-10 h-3 bg-maroon/15 sm:h-3.5"
                aria-hidden
              />
            </span>{" "}
            ad — drafting included, proof after print.
          </h1>

          <p className="animate-rise-delay-2 mt-5 max-w-lg text-base leading-relaxed text-charcoal sm:text-lg">
            Passport, bank, Aadhaar, and gazette-ready wording. We draft the notice, place it in
            the right edition, and send publication proof.
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

          <p className="animate-rise-delay-2 mt-8 text-sm text-charcoal/80">
            <span className="font-semibold text-ink">280+ papers</span>
            <span className="mx-2 text-line">·</span>
            Drafting included
            <span className="mx-2 text-line">·</span>
            Proof after print
          </p>
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

          <div className="hero-float relative overflow-hidden border border-white/70 bg-white/40 p-2 shadow-[0_24px_60px_rgba(26,27,30,0.14)] backdrop-blur-[2px] sm:p-3">
            <Image
              src="/ads/change-of-name-hero.png"
              alt="Change of Name - Your hassle-free name change starts here at www.ad2print.in"
              width={1024}
              height={1051}
              priority
              unoptimized
              className="mx-auto h-auto max-h-[400px] w-full object-contain sm:max-h-[460px] lg:max-h-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
