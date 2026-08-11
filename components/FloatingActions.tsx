"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { FaChevronUp, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";
import { SITE } from "@/lib/site";

export function FloatingActions() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <>
      {/* Left: Call + WhatsApp */}
      <div className="fixed left-0 top-1/2 z-[60] flex -translate-y-1/2 flex-col gap-2">
        <a
          href={`tel:${SITE.phone.replace(/\s/g, "")}`}
          aria-label="Call us"
          title="Call us"
          className="flex h-12 w-12 items-center justify-center rounded-r-md bg-maroon text-white shadow-[2px_4px_14px_rgba(178,31,45,0.35)] transition hover:w-[3.25rem] hover:bg-maroon-deep"
        >
          <FaPhoneAlt className="h-[18px] w-[18px]" aria-hidden />
        </a>
        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp us"
          title="WhatsApp us"
          className="flex h-12 w-12 items-center justify-center rounded-r-md bg-[#25D366] text-white shadow-[2px_4px_14px_rgba(37,211,102,0.35)] transition hover:w-[3.25rem] hover:bg-[#1ebe57]"
        >
          <FaWhatsapp className="h-6 w-6" aria-hidden />
        </a>
      </div>

      {/* Right: Call Back tab */}
      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setSent(false);
        }}
        className="fixed right-0 top-1/2 z-[60] flex h-36 w-11 -translate-y-1/2 flex-col items-center justify-center gap-2 rounded-l-md bg-maroon text-white shadow-[-2px_4px_14px_rgba(178,31,45,0.35)] transition hover:w-12 hover:bg-maroon-deep"
        aria-label="Request a call back"
      >
        <FaPhoneAlt className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="rotate-180 text-[12px] font-semibold tracking-[0.2em] [writing-mode:vertical-rl]">
          Call Back
        </span>
      </button>

      {/* Bottom right query bar */}
      <Link
        href="/contact"
        className="fixed bottom-5 right-5 z-[60] hidden max-w-[260px] items-center gap-2 rounded-lg bg-slate-deep px-4 py-3 text-sm font-semibold !text-white shadow-lg transition hover:bg-ink sm:flex"
      >
        <FaPhoneAlt className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span>Fill Query or Call {SITE.phone.replace("+91 ", "")}</span>
      </Link>

      {/* Scroll to top */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-5 left-5 z-[60] flex h-11 w-11 items-center justify-center rounded-full bg-maroon text-white shadow-lg transition hover:bg-maroon-deep"
          aria-label="Scroll to top"
        >
          <FaChevronUp className="h-4 w-4" aria-hidden />
        </button>
      )}

      {/* Call Back modal */}
      {open && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/45 p-4">
          <div className="absolute inset-0" onClick={() => setOpen(false)} aria-hidden />
          <div className="relative w-full max-w-md rounded-lg border border-line bg-white p-6 shadow-xl">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-charcoal hover:bg-paper-2"
              aria-label="Close"
            >
              ×
            </button>

            {sent ? (
              <div className="py-6 text-center">
                <p className="font-display text-2xl text-maroon">Request received</p>
                <p className="mt-3 text-sm text-charcoal">
                  Our desk will call you back shortly during working hours.
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mt-6 rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold !text-white hover:bg-maroon-deep"
                >
                  Close
                </button>
              </div>
            ) : (
              <>
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-maroon/10 text-maroon">
                  <FaPhoneAlt className="h-4 w-4" aria-hidden />
                </div>
                <h2 className="font-display text-2xl text-ink">Request a call back</h2>
                <p className="mt-2 text-sm text-charcoal">
                  Share your number — AD2PRINT will call you about rates and booking.
                </p>
                <form onSubmit={onSubmit} className="mt-5 space-y-4">
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-semibold text-ink">Name</span>
                    <input
                      required
                      className="w-full rounded-md border border-line px-3 py-2.5 outline-none focus:ring-2 focus:ring-maroon/30"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-semibold text-ink">Phone</span>
                    <input
                      required
                      type="tel"
                      className="w-full rounded-md border border-line px-3 py-2.5 outline-none focus:ring-2 focus:ring-maroon/30"
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1.5 block font-semibold text-ink">What do you need?</span>
                    <select className="w-full rounded-md border border-line px-3 py-2.5 outline-none focus:ring-2 focus:ring-maroon/30">
                      <option>Classified ad</option>
                      <option>Display ad</option>
                      <option>Name change / notice</option>
                      <option>Matrimonial</option>
                      <option>Other</option>
                    </select>
                  </label>
                  <button
                    type="submit"
                    className="w-full rounded-full bg-maroon py-3 text-sm font-semibold !text-white hover:bg-maroon-deep"
                  >
                    Request call back
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
