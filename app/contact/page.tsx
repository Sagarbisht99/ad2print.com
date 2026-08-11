"use client";

import { FormEvent, useState } from "react";
import { SITE } from "@/lib/site";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Contact</p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Talk to the booking desk</h1>
      <p className="mt-4 max-w-2xl text-lg text-charcoal">
        Questions on rates, editions, or wording? Reach us by phone, WhatsApp, or the form below.
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <div className="border-l-2 border-maroon pl-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-charcoal">Phone</p>
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="mt-1 block font-display text-2xl text-ink hover:text-maroon"
            >
              {SITE.phone}
            </a>
          </div>
          <div className="border-l-2 border-maroon pl-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-charcoal">Email</p>
            <a
              href={`mailto:${SITE.email}`}
              className="mt-1 block font-display text-2xl text-ink hover:text-maroon"
            >
              {SITE.email}
            </a>
          </div>
          <div className="border-l-2 border-maroon pl-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-charcoal">WhatsApp</p>
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 block font-display text-2xl text-ink hover:text-maroon"
            >
              Message us
            </a>
          </div>
          <div className="border-l-2 border-maroon pl-5">
            <p className="text-sm font-semibold uppercase tracking-wider text-charcoal">Office</p>
            <p className="mt-1 font-display text-2xl text-ink">{SITE.address}</p>
          </div>
        </div>

        {sent ? (
          <div className="border border-maroon/30 bg-white/80 p-8">
            <h2 className="font-display text-2xl text-maroon">Message sent</h2>
            <p className="mt-3 text-charcoal">We&apos;ll get back to you shortly during desk hours.</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5 border border-line bg-white/70 p-6 sm:p-8">
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-ink">Name</span>
              <input
                required
                className="w-full rounded-sm border border-line bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-maroon/30"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-ink">Phone or email</span>
              <input
                required
                className="w-full rounded-sm border border-line bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-maroon/30"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-semibold text-ink">Message</span>
              <textarea
                required
                rows={5}
                className="w-full rounded-sm border border-line bg-white px-3 py-3 outline-none focus:ring-2 focus:ring-maroon/30"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-maroon px-6 py-3.5 text-sm font-semibold !text-white hover:bg-maroon-deep"
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
