import Image from "next/image";
import Link from "next/link";
import { AD_TYPES } from "@/lib/site";
import { formatPrice } from "@/lib/data";

export function AdFormats() {
  return (
    <section className="border-b border-line bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Ad formats</p>
        <h2 className="mt-3 max-w-2xl font-display text-3xl text-ink sm:text-4xl">
          Three ways to run an ad
        </h2>
        <p className="mt-3 max-w-xl text-charcoal">
          Match format to budget. Text classified for notices, classified display when you need a
          photo or logo, display when you want the main pages.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {AD_TYPES.map((type) => (
            <div key={type.slug} className="overflow-hidden border border-line bg-white">
              <div className="border-b border-line bg-paper-2 p-3">
                <Image
                  src={type.image}
                  alt={`Sample ${type.name} ads`}
                  width={234}
                  height={166}
                  unoptimized
                  className="mx-auto h-auto w-full max-w-[234px] object-contain"
                />
              </div>
              <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-maroon">
                  {type.badge}
                </p>
                <h3 className="mt-2 font-display text-2xl text-ink">{type.name}</h3>
                <p className="mt-1 text-sm font-medium text-slate-deep">{type.short}</p>
                <p className="mt-3 text-sm leading-relaxed text-charcoal">{type.description}</p>
                <ul className="mt-4 space-y-1.5 text-sm text-charcoal">
                  {type.bestFor.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-maroon">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-5 text-sm text-ink">
                  From <span className="font-semibold text-maroon">{formatPrice(type.fromPrice)}</span>
                </p>
                <Link
                  href={`/book?type=${type.slug}`}
                  className="mt-5 inline-flex items-center gap-1 rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-maroon-deep"
                >
                  Book this format →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
