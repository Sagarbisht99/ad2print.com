"use client";

import { useCategoryEnquiry } from "@/components/CategoryEnquiry";
import { getCategories } from "@/lib/data";

export function CategoryMarquee() {
  const categories = getCategories();
  const loop = [...categories, ...categories];
  const { openCategory } = useCategoryEnquiry();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[55] border-t border-maroon/30 bg-maroon">
      <div className="overflow-hidden py-2.5">
        <div className="pointer-events-auto flex w-max animate-marquee hover:[animation-play-state:paused]">
          {loop.map((cat, i) => (
            <button
              key={`${cat.slug}-${i}`}
              type="button"
              onClick={() => openCategory(cat.slug)}
              className="mx-4 shrink-0 text-[13px] font-semibold tracking-wide text-white/90 transition hover:text-white"
              tabIndex={i < categories.length ? 0 : -1}
              aria-hidden={i >= categories.length}
            >
              {cat.name}
              <span className="ml-4 text-white/35">/</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
