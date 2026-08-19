import Image from "next/image";
import Link from "next/link";
import { TESTIMONIALS } from "@/lib/content";

export function Testimonials() {
  return (
    <section className="border-y border-line bg-[#f8f6f0]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">
              Customer reviews
            </p>
            <h2 className="mt-3 max-w-xl font-display text-3xl text-ink sm:text-4xl">
              What people say after their ad runs in print
            </h2>
          </div>
          <div className="rounded-2xl border border-line bg-white px-5 py-3 shadow-sm">
            <p className="font-display text-2xl text-ink">
              4.8 <span className="text-maroon">★</span>
            </p>
            <p className="text-xs text-charcoal">Based on verified advertiser feedback</p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {TESTIMONIALS.slice(0, 2).map((t) => (
            <article
              key={t.name}
              className="flex gap-5 rounded-2xl border border-line bg-white p-6 shadow-[0_8px_24px_rgba(46,47,50,0.06)] sm:p-7"
            >
              <Image
                src={t.image}
                alt={t.name}
                width={80}
                height={80}
                className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-maroon/15 sm:h-20 sm:w-20"
              />
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-maroon">
                  {t.highlight}
                </p>
                <h3 className="mt-1.5 font-display text-xl text-ink">{t.name}</h3>
                <p className="mt-0.5 text-sm text-charcoal">
                  {t.category} · {t.city}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-3 text-sm text-maroon">
                  {"★".repeat(t.rating)}
                  <span className="text-line">{"★".repeat(5 - t.rating)}</span>
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-line bg-white shadow-[0_8px_24px_rgba(46,47,50,0.05)]">
          <div className="flex items-center justify-between border-b border-line px-5 py-4 sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">
              More verified stories
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">Rating</p>
          </div>
          <ul className="divide-y divide-line">
            {TESTIMONIALS.slice(2).map((t, i) => (
              <li
                key={t.name}
                className="flex flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex gap-4">
                  <span className="font-display text-lg text-maroon">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Image
                    src={t.image}
                    alt={t.name}
                    width={56}
                    height={56}
                    className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-maroon/10"
                  />
                  <div>
                    <p className="font-semibold text-ink">{t.name}</p>
                    <p className="text-sm text-charcoal">
                      {t.category} · {t.city}
                    </p>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal">
                      &ldquo;{t.text}&rdquo;
                    </p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-3 sm:flex-col sm:items-end">
                  <span className="text-sm font-semibold text-maroon">{t.rating}.0 ★</span>
                  <Link
                    href="/contact"
                    className="rounded-full bg-maroon px-4 py-1.5 text-xs font-semibold !text-white hover:bg-maroon-deep"
                  >
                    Contact us
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <blockquote className="mt-12 border-y border-line py-10">
          <span className="font-display text-6xl leading-none text-maroon" aria-hidden>
            “
          </span>
          <p className="-mt-6 max-w-3xl font-display text-2xl leading-snug text-ink sm:text-3xl">
            You have already decided to advertise. The only questions left are which newspaper, what
            it costs, and how soon it can run — those are the three we answer.
          </p>
          <footer className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-charcoal">
            — AD2PRINT
          </footer>
        </blockquote>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#efece4] px-6 py-6 sm:px-8">
          <div>
            <p className="font-display text-xl text-ink sm:text-2xl">
              Ready to book your newspaper ad?
            </p>
            <p className="mt-1 text-sm text-charcoal">Clear rates · draft help · proof before print</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 rounded-full bg-maroon px-5 py-3 text-sm font-semibold !text-white hover:bg-maroon-deep"
            >
              Contact us →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
