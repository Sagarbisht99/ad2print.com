"use client";

import type { ReactNode } from "react";
import { useCategoryEnquiry } from "@/components/CategoryEnquiry";

/**
 * Opens the enquiry popup with a pre-filled message (e.g. the package the
 * customer clicked). Used for every category that does not take online
 * payment — the desk confirms the wording, date and final amount.
 */
export function BookEnquiryButton({
  message,
  className,
  children,
  label,
}: {
  message: string;
  className?: string;
  children: ReactNode;
  label?: string;
}) {
  const { openEnquiryWith } = useCategoryEnquiry();

  return (
    <button
      type="button"
      onClick={() => openEnquiryWith(message)}
      className={className}
      aria-haspopup="dialog"
      aria-label={label}
    >
      {children}
    </button>
  );
}
