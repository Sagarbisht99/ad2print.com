"use client";

import { CategoryIcon } from "@/components/CategoryIcon";
import { useCategoryEnquiry } from "@/components/CategoryEnquiry";
import { formatPrice, getCategories } from "@/lib/data";

export function CategoriesGrid({
  heading = "What are you booking?",
  intro,
}: {
  heading?: string;
  intro?: string;
}) {
  const categories = getCategories();
  const { openCategory } = useCategoryEnquiry();

  return (
    <section id="categories" className="border-b border-line bg-paper-2/50">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="section-kicker">Categories</p>
          <h2 className="mt-3 font-display text-3xl text-ink sm:text-5xl">{heading}</h2>
          <p className="mt-4 text-charcoal">
            {intro ??
              "Tap a category to enquire. We quote the edition, draft the matter when needed, and send proof after publication."}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              type="button"
              onClick={() => openCategory(cat.slug)}
              className="group relative flex flex-col items-start border border-line bg-white p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-maroon/45 hover:shadow-[0_16px_36px_rgba(178,31,45,0.1)] sm:p-5"
            >
              {cat.popular ? (
                <span className="absolute right-3 top-3 text-[10px] font-bold uppercase tracking-[0.14em] text-maroon">
                  Popular
                </span>
              ) : null}

              <span
                className="flex h-12 w-12 items-center justify-center transition duration-200 group-hover:scale-105 sm:h-14 sm:w-14"
                style={{ background: `${cat.tint}18`, color: cat.tint }}
              >
                <CategoryIcon name={cat.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
              </span>

              <span className="mt-4 font-display text-base leading-snug text-ink group-hover:text-maroon sm:text-lg">
                {cat.name}
              </span>
              <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-charcoal sm:text-sm">
                {cat.short}
              </span>
              <span className="mt-auto pt-4 text-xs font-semibold text-maroon sm:text-sm">
                From {formatPrice(cat.fromPrice)}
                <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
