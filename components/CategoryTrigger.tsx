"use client";

import { useCategoryEnquiry } from "@/components/CategoryEnquiry";

export function CategoryTrigger({
  slug,
  className,
  children,
}: {
  slug: string;
  className?: string;
  children: React.ReactNode;
}) {
  const { openCategory } = useCategoryEnquiry();
  return (
    <button type="button" onClick={() => openCategory(slug)} className={className}>
      {children}
    </button>
  );
}
