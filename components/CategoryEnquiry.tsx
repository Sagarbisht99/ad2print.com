"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { EnquiryForm } from "@/components/EnquiryForm";
import { getCategories } from "@/lib/data";

type Ctx = {
  openCategory: (slug: string) => void;
  openEnquiry: () => void;
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
  const [enquiryOpen, setEnquiryOpen] = useState(false);
  const categories = getCategories();
  const selected = useMemo(
    () => categories.find((c) => c.slug === slug) ?? null,
    [categories, slug],
  );

  const openCategory = useCallback((next: string) => setSlug(next), []);
  const openEnquiry = useCallback(() => setEnquiryOpen(true), []);
  const close = useCallback(() => {
    setSlug(null);
    setEnquiryOpen(false);
  }, []);

  const anyOpen = Boolean(selected) || enquiryOpen;

  useEffect(() => {
    if (!anyOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [anyOpen, close]);

  return (
    <CategoryEnquiryContext.Provider value={{ openCategory, openEnquiry }}>
      {children}
      {selected ? <CategoryEnquiryModal category={selected.name} onClose={close} /> : null}
      {enquiryOpen ? <GeneralEnquiryModal onClose={close} /> : null}
    </CategoryEnquiryContext.Provider>
  );
}

function GeneralEnquiryModal({ onClose }: { onClose: () => void }) {
  return (
    <EnquiryModalShell onClose={onClose} labelledBy="enquiry-modal-title">
      <h3 id="enquiry-modal-title" className="pr-8 font-display text-xl text-ink">
        Enquiry now
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-charcoal">
        Tell us what you want to publish. Share the newspaper, city and wording if you have it — the
        desk replies with the rate and next steps.
      </p>
      <div className="mt-5">
        <EnquiryForm
          compact
          source="contact"
          submitLabel="Send enquiry"
          defaultMessage="I want to enquire about a newspaper advertisement."
        />
      </div>
    </EnquiryModalShell>
  );
}

function CategoryEnquiryModal({
  category,
  onClose,
}: {
  category: string;
  onClose: () => void;
}) {
  return (
    <EnquiryModalShell onClose={onClose} labelledBy="category-enquiry-modal-title">
      <h3 id="category-enquiry-modal-title" className="pr-8 font-display text-xl text-ink">
        Enquire for {category}
      </h3>
      <p className="mt-1.5 text-sm text-charcoal">
        Name, mobile, email, and message — we reply with the paper, wording, and next steps.
      </p>
      <div className="mt-5">
        <EnquiryForm
          key={category}
          compact
          source="category"
          submitLabel="Send enquiry"
          categoryName={category}
          defaultMessage={`I want to book a ${category} ad.`}
        />
      </div>
    </EnquiryModalShell>
  );
}

function EnquiryModalShell({
  children,
  onClose,
  labelledBy,
}: {
  children: ReactNode;
  onClose: () => void;
  labelledBy: string;
}) {
  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/55 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
        aria-label="Close enquiry form"
      />
      <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-xl border border-line bg-white p-6 shadow-2xl sm:p-7">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-lg text-charcoal transition hover:bg-paper-2"
          aria-label="Close"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
