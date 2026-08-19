"use client";

import { CategoryIcon } from "@/components/CategoryIcon";
import { useCategoryEnquiry } from "@/components/CategoryEnquiry";
import { getCategories } from "@/lib/data";

export function CategoryMarquee() {
  const categories = getCategories();
  const loop = [...categories, ...categories];
  const { openCategory } = useCategoryEnquiry();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[55] border-t border-white/10 bg-ink/95">
      <div className="overflow-hidden py-2">
        <div className="pointer-events-auto flex w-max animate-marquee hover:[animation-play-state:paused]">
          {loop.map((cat, i) => (
            <button
              key={`${cat.slug}-${i}`}
              type="button"
              onClick={() => openCategory(cat.slug)}
              className="mx-1.5 inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[13px] font-semibold text-white transition hover:border-white hover:bg-maroon"
              tabIndex={i < categories.length ? 0 : -1}
              aria-hidden={i >= categories.length}
            >
              <CategoryIcon name={cat.icon} className="h-3.5 w-3.5" />
              {cat.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
