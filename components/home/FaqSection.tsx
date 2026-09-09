import Link from "next/link";
import { FAQS } from "@/lib/content";

export function FaqSection({ limit }: { limit?: number }) {
  const items = limit ? FAQS.slice(0, limit) : FAQS;

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="section-kicker">FAQ</p>
      <h2 className="mt-3 max-w-xl font-display text-3xl text-ink sm:text-5xl">
        What advertisers ask first
      </h2>
      <div className="mt-10 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <details key={item.q} className="group py-5">
            <summary className="cursor-pointer list-none font-display text-lg text-ink sm:text-xl [&::-webkit-details-marker]:hidden">
              <span className="flex items-start justify-between gap-4">
                {item.q}
                <span className="mt-1 text-maroon transition group-open:rotate-45">+</span>
              </span>
            </summary>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-charcoal sm:text-base">
              {item.a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

export function CtaBand() {
  return (
    <section className="border-y border-line bg-paper-2">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-4 py-14 sm:px-6 md:flex-row md:items-end">
        <div>
          <p className="section-kicker">Ready to book</p>
          <h2 className="mt-3 max-w-xl font-display text-3xl text-ink sm:text-5xl">
            See your rate and book in minutes.
          </h2>
          <p className="mt-4 max-w-lg text-charcoal">
            Real price up front · we can write it · runs next day if you book by cutoff.
          </p>
        </div>
        <Link href="/contact" className="btn-primary">
          Contact us
        </Link>
      </div>
    </section>
  );
}
