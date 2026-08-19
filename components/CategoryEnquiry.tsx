"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { CategoryIcon } from "@/components/CategoryIcon";
import { EnquiryForm } from "@/components/EnquiryForm";
import { formatPrice, getCategories, type Category } from "@/lib/data";

type Ctx = {
  openCategory: (slug: string) => void;
};

const CategoryEnquiryContext = createContext<Ctx | null>(null);

export function useCategoryEnquiry() {
  const ctx = useContext(CategoryEnquiryContext);
  if (!ctx) {
    throw new Error("useCategoryEnquiry must be used inside CategoryEnquiryProvider");
  }
  return ctx;
}

export function CategoryEnquiryProvider({ children }: { children: ReactNode }) {
  const [slug, setSlug] = useState<string | null>(null);
  const categories = getCategories();
  const selected = useMemo(
    () => categories.find((c) => c.slug === slug) ?? null,
    [categories, slug],
  );

  const openCategory = useCallback((next: string) => setSlug(next), []);
  const close = useCallback(() => setSlug(null), []);

  return (
    <CategoryEnquiryContext.Provider value={{ openCategory }}>
      {children}
      {selected ? <CategoryEnquiryModal category={selected} onClose={close} /> : null}
    </CategoryEnquiryContext.Provider>
  );
}

function CategoryEnquiryModal({
  category,
  onClose,
}: {
  category: Category;
  onClose: () => void;
}) {
  const tint = category.tint;
  const highlights = category.highlights;
  const subtypes = "subtypes" in category ? category.subtypes : undefined;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-line bg-white shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full text-charcoal hover:bg-paper-2"
          aria-label="Close"
        >
          ×
        </button>

        <div className="grid gap-0 lg:grid-cols-2">
          <div className="border-b border-line p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <div
              className="flex h-16 w-16 items-center justify-center rounded-full"
              style={{ background: `${tint}18`, color: tint }}
            >
              <CategoryIcon name={category.icon} className="h-8 w-8" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-maroon">
              Ad category
            </p>
            <h2 className="mt-2 font-display text-3xl text-ink">{category.name}</h2>
            <p className="mt-3 text-sm leading-relaxed text-charcoal">{category.description}</p>
            <p className="mt-4 text-sm font-semibold text-maroon">
              From {formatPrice(category.fromPrice)}
            </p>
            <ul className="mt-5 space-y-2.5">
              {highlights.map((h) => (
                <li key={h} className="flex gap-2.5 text-sm text-ink">
                  <span className="mt-0.5 text-maroon">✓</span>
                  {h}
                </li>
              ))}
            </ul>
            {subtypes ? (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-charcoal">
                  Typical notices
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {subtypes.map((s) => (
                    <span
                      key={s}
                      className="rounded-full border border-line bg-paper-2 px-2.5 py-1 text-[11px] text-slate-deep"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="font-display text-xl text-ink">Enquire for {category.name}</h3>
            <p className="mt-1.5 text-sm text-charcoal">
              Name, mobile, email, and message — we reply with rate and draft.
            </p>
            <div className="mt-5">
              <EnquiryForm
                key={category.slug}
                compact
                source="category"
                submitLabel="Send enquiry"
                categoryName={category.name}
                defaultMessage={`I want to book a ${category.name} ad.`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
