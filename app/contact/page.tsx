"use client";

import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { EnquiryForm } from "@/components/EnquiryForm";
import { SITE } from "@/lib/site";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Contact</p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Contact AD2PRINT</h1>
      <p className="mt-4 max-w-2xl text-lg text-charcoal">
        Tell us your name, mobile, email, and message. Or call and WhatsApp the booking desk
        directly.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <aside className="space-y-5">
          <div className="rounded-xl border border-line bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">Phone</p>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="mt-2 inline-flex items-center gap-2 font-display text-2xl text-ink hover:text-maroon"
            >
              <FaPhoneAlt className="h-4 w-4 text-maroon" aria-hidden />
              {SITE.phone}
            </a>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">WhatsApp</p>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 font-display text-2xl text-ink hover:text-maroon"
            >
              <FaWhatsapp className="h-5 w-5 text-[#25D366]" aria-hidden />
              {SITE.phone}
            </a>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">Email</p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-2 block font-display text-2xl text-ink hover:text-maroon"
            >
              {SITE.email}
            </a>
          </div>
          <div className="rounded-xl border border-line bg-white p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-charcoal">Office</p>
            <p className="mt-2 font-display text-xl leading-snug text-ink">{SITE.address}</p>
            <p className="mt-3 text-sm text-charcoal">{SITE.hours}</p>
          </div>
        </aside>

        <div className="rounded-xl border border-line bg-white p-6 sm:p-8">
          <h2 className="font-display text-2xl text-ink">Send a message</h2>
          <p className="mt-2 text-sm text-charcoal">
            Fill in name, mobile, email, and your message. We reply during desk hours.
          </p>
          <div className="mt-6">
            <EnquiryForm source="contact" submitLabel="Send message" />
          </div>
        </div>
      </div>
    </div>
  );
}
