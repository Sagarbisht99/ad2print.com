import Image from "next/image";
import Link from "next/link";
import { AD_TYPES } from "@/lib/site";

export function AdFormats() {
  return (
    <section className="border-b border-line">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <p className="section-kicker">Formats</p>
        <h2 className="mt-3 max-w-xl font-display text-3xl text-ink sm:text-5xl">
          Three ways to run an ad
        </h2>
        <p className="mt-4 max-w-xl text-charcoal">
          Match format to how the ad should look — from plain text notices to main-page display.
        </p>

        <div className="mt-12 space-y-0 border-y border-line">
          {AD_TYPES.map((type, i) => (
            <div
              key={type.slug}
              className={`grid items-center gap-8 py-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 ${
                i > 0 ? "border-t border-line" : ""
              }`}
            >
              <div className={`${i % 2 === 1 ? "lg:order-2" : ""}`}>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-maroon">
                  {type.badge}
                </p>
                <h3 className="mt-2 font-display text-3xl text-ink sm:text-4xl">{type.name}</h3>
                <p className="mt-2 text-base font-medium text-slate-deep">{type.short}</p>
                <p className="mt-4 max-w-lg text-sm leading-relaxed text-charcoal">
                  {type.description}
                </p>
                <Link href="/contact" className="btn-ghost mt-6">
                  Enquire for this format
                </Link>
              </div>
              <div className={`bg-paper-2 p-6 sm:p-8 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                <Image
                  src={type.image}
                  alt={`Sample ${type.name} ads`}
                  width={468}
                  height={332}
                  unoptimized
                  className="mx-auto h-auto w-full max-w-md object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
