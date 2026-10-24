"use client";

import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { SITE } from "@/lib/site";

export function FloatingActions() {
  return (
    <div className="fixed bottom-14 right-4 z-[60] flex flex-col gap-3">
      <a
        href={`https://wa.me/${SITE.whatsapp}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp us"
        title="WhatsApp us"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_8px_22px_rgba(37,211,102,0.45)] transition hover:scale-105 hover:bg-[#1ebe57]"
      >
        <FaWhatsapp className="h-6 w-6" aria-hidden />
      </a>
      <a
        href={`tel:${SITE.phone.replace(/\s/g, "")}`}
        aria-label="Call us"
        title="Call us"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-maroon text-white shadow-[0_8px_22px_rgba(178,31,45,0.45)] transition hover:scale-105 hover:bg-maroon-deep"
      >
        <FaPhoneAlt className="h-5 w-5" aria-hidden />
      </a>
    </div>
  );
}
