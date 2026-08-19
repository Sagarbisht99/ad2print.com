"use client";

import { CategoryIcon } from "@/components/CategoryIcon";
import { useCategoryEnquiry } from "@/components/CategoryEnquiry";
import { formatPrice, getCategories } from "@/lib/data";

export function CategoriesGrid({
  heading = "Select an ad category",
  intro,
}: {
  heading?: string;
  intro?: string;
}) {
  const categories = getCategories();
  const { openCategory } = useCategoryEnquiry();

  return (
    <section id="categories" className="border-y border-line bg-paper-2">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-maroon">
          Book by category
        </p>
        <h2 className="mt-3 text-center font-display text-3xl uppercase tracking-tight text-ink sm:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-charcoal">
          {intro ??
            "Tap a category to see details and send an enquiry. Name, mobile, email, and message — we quote and draft for you."}
        </p>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => openCategory(cat.slug)}
              className="group rounded-xl border border-line bg-white px-3 py-6 text-center shadow-[0_1px_0_rgba(46,47,50,0.04)] transition hover:-translate-y-0.5 hover:border-maroon/40 hover:shadow-[0_12px_28px_rgba(46,47,50,0.1)]"
            >
              <span
                className="mx-auto flex h-16 w-16 items-center justify-center rounded-full transition group-hover:scale-105"
                style={{ background: `${cat.tint}18`, color: cat.tint }}
              >
                <CategoryIcon name={cat.icon} className="h-8 w-8" />
              </span>
              <span className="mt-3 block text-sm font-bold text-ink group-hover:text-maroon">
                {cat.name}
              </span>
              <span className="mt-1 block text-[11px] leading-snug text-charcoal">{cat.short}</span>
              <span className="mt-2 block text-[11px] font-semibold text-maroon">
                From {formatPrice(cat.fromPrice)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
