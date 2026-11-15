"use client";

import type { ReactNode } from "react";
import { useCategoryEnquiry } from "@/components/CategoryEnquiry";

export function EnquiryButton({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const { openEnquiry } = useCategoryEnquiry();

  return (
    <button
      type="button"
      onClick={openEnquiry}
      className={className}
      aria-label={label}
      aria-haspopup="dialog"
    >
      {children}
    </button>
  );
}
