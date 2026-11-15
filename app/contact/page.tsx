"use client";

import { FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { EnquiryForm } from "@/components/EnquiryForm";
import { CONTACT_FAQS } from "@/lib/contact-faqs";
import { SITE } from "@/lib/site";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <p className="section-kicker">Contact</p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-6xl">
        Contact AD2PRINT — newspaper ad booking desk
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-charcoal">
        Send your name, mobile, email, and message — or call and WhatsApp directly during desk
        hours. Tell us the newspaper, city and ad wording if you have them, and the first reply can
        include the rate and next available date.
      </p>

      <div className="mt-12 grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <aside className="space-y-8 border-t border-line pt-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-charcoal">Phone</p>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="mt-2 inline-flex items-center gap-2 font-display text-2xl text-ink hover:text-maroon sm:text-3xl"
            >
              <FaPhoneAlt className="h-4 w-4 text-maroon" aria-hidden />
              {SITE.phone}
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-charcoal">WhatsApp</p>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-2 inline-flex items-center gap-2 font-display text-2xl text-ink hover:text-maroon sm:text-3xl"
            >
              <FaWhatsapp className="h-5 w-5 text-[#25D366]" aria-hidden />
              {SITE.phone}
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-charcoal">Email</p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-2 block font-display text-xl text-ink hover:text-maroon sm:text-2xl"
            >
              {SITE.email}
            </a>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-charcoal">Office</p>
            <p className="mt-2 font-display text-xl leading-snug text-ink">{SITE.address}</p>
            <p className="mt-3 text-sm text-charcoal">{SITE.hours}</p>
          </div>
        </aside>

        <div className="border border-line bg-white p-6 sm:p-10 rounded-xl">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">Send a message</h2>
          <p className="mt-2 text-sm text-charcoal">
            We reply during desk hours with next steps.
          </p>
          <div className="mt-8">
            <EnquiryForm source="contact" submitLabel="Send message" />
          </div>
        </div>
      </div>

      <section className="mt-16 border-t border-line pt-12">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className="section-kicker">Questions</p>
            <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">
              Before you contact the desk
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-charcoal">
              Most bookings are confirmed faster when you include the category, city, newspaper and
              the exact wording you want printed.
            </p>
          </div>
          <div className="divide-y divide-line border-y border-line">
            {CONTACT_FAQS.map((faq) => (
              <details key={faq.q} className="group py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-sm font-semibold text-ink sm:text-base [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="mt-0.5 shrink-0 text-maroon transition group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-charcoal">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
