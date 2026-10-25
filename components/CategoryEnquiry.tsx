"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { getCategories, type Category } from "@/lib/data";

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
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 p-4">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-xl border border-line bg-white p-6 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-charcoal hover:bg-paper-2"
          aria-label="Close"
        >
          ×
        </button>

        <h3 className="pr-8 font-display text-xl text-ink">Enquire for {category.name}</h3>
        <p className="mt-1.5 text-sm text-charcoal">
          Name, mobile, email, and message — we reply with the paper, wording, and next steps.
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
  );
}
