import Link from "next/link";
import { FAQS } from "@/lib/content";

export function FaqSection({ limit }: { limit?: number }) {
  const items = limit ? FAQS.slice(0, limit) : FAQS;

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">FAQ</p>
      <h2 className="mt-3 font-display text-3xl text-ink">What advertisers ask first</h2>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="cursor-pointer list-none font-display text-lg text-ink [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                {item.q}
                <span className="text-maroon transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal">{item.a}</p>
          </details>
        ))}
      </div>
      {limit ? (
        <Link
          href="/faq"
          className="mt-8 inline-block text-sm font-semibold text-maroon underline-offset-4 hover:underline"
        >
          Open FAQ page →
        </Link>
      ) : null}
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="bg-maroon text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 md:flex-row md:items-center">
        <div>
          <h2 className="font-display text-3xl sm:text-4xl">See your rate and book in minutes.</h2>
          <p className="mt-3 max-w-lg text-white/85">
            Real price up front · we can write it · runs next day if you book by cutoff.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/book"
            className="rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-maroon transition hover:bg-paper-2"
          >
            Get my rate
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/45 px-6 py-3.5 text-sm font-semibold !text-white transition hover:bg-white/10"
          >
            Talk to us
          </Link>
        </div>
      </div>
    </section>
  );
}
