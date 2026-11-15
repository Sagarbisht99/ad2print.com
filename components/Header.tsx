"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { getCategoriesOrdered } from "@/lib/data";
import { getCategoryHref } from "@/lib/category-routes";
import { SITE } from "@/lib/site";
import { EnquiryHanger } from "@/components/EnquiryHanger";
import { FaClock, FaEnvelope, FaPhoneAlt, FaWhatsapp } from "react-icons/fa";

const links = [
  { href: "/newspaper-classified", label: "Classified ads" },
  { href: "/newspapers", label: "Newspapers" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  const pathOnly = href.split("?")[0].split("#")[0];
  if (pathOnly === "/") return pathname === "/";
  return pathname === pathOnly || pathname.startsWith(`${pathOnly}/`);
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const categories = getCategoriesOrdered();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="hidden border-b border-maroon/20 bg-[linear-gradient(90deg,#8a0a1f_0%,#a80d27_45%,#c8102e_100%)] text-[11px] leading-tight text-white sm:block sm:text-[12px] md:text-[13px]">
        <div className="mx-auto flex max-w-7xl flex-col gap-1.5 px-3 py-1.5 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3 text-white/95">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-white/80" aria-hidden />
              280+ newspapers · every Indian language
            </span>
            <span className="hidden items-center gap-1.5 md:inline-flex">
              <FaClock className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" aria-hidden />
              Book by 5 PM — next-day print where available
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 md:justify-end md:gap-5">
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 font-medium text-white/95 transition hover:text-white"
            >
              <FaPhoneAlt className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" aria-hidden />
              <span>{SITE.phone}</span>
            </a>
            <a
              href={`mailto:${SITE.email}`}
              className="hidden items-center gap-1.5 font-medium text-white/95 transition hover:text-white lg:inline-flex"
            >
              <FaEnvelope className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" aria-hidden />
              <span className="break-all">{SITE.email}</span>
            </a>
          </div>
        </div>
      </div>

      <EnquiryHanger className="absolute right-8 top-[calc(100%-18px)] hidden w-26 lg:block" />
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:h-[4.5rem] sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
          aria-label="AD2PRINT home"
        >
          <Image
            src="/logo.png"
            alt="AD2PRINT"
            width={473}
            height={92}
            className="h-8 w-auto max-w-[150px] object-contain min-[560px]:h-9 min-[560px]:max-w-none sm:h-10"
            priority
          />
        </Link>

        <nav className="mx-auto hidden items-center gap-0.5 xl:flex" aria-label="Main navigation">
          <Link
            href="/"
            className={`rounded-full px-3 py-2 text-sm font-medium transition-all ${
              isActive(pathname, "/")
                ? "bg-maroon/5 text-maroon"
                : "text-slate-deep hover:bg-maroon hover:text-white"
            }`}
          >
            Home
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setCatsOpen(true)}
            onMouseLeave={() => setCatsOpen(false)}
          >
            <button
              type="button"
              className={`rounded-full px-3 py-2 text-sm font-medium transition-all ${
                pathname.startsWith("/categories")
                  ? "bg-maroon/5 text-maroon"
                  : "text-slate-deep hover:bg-maroon hover:text-white"
              }`}
              onClick={() => setCatsOpen((value) => !value)}
              aria-expanded={catsOpen}
            >
              Categories
            </button>
            {catsOpen ? (
              <div className="absolute left-0 top-full z-50 mt-0 w-[22rem] overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-[0_22px_40px_rgba(26,27,30,0.12)]">
                <div className="grid grid-cols-2 gap-0.5">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={getCategoryHref(cat.slug)}
                      onClick={() => setCatsOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-left text-[13px] transition hover:bg-paper-2 hover:text-maroon ${
                        pathname === getCategoryHref(cat.slug) ? "text-maroon" : "text-ink"
                      }`}
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/categories"
                  onClick={() => setCatsOpen(false)}
                  className="mt-1 block border-t border-line px-3 py-2.5 text-sm font-semibold text-maroon"
                >
                  View all categories →
                </Link>
              </div>
            ) : null}
          </div>

          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-2 text-sm font-medium transition-all ${
                isActive(pathname, link.href)
                  ? "bg-maroon/5 text-maroon"
                  : "text-slate-deep hover:bg-maroon hover:text-white"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-1.5 min-[400px]:gap-2 xl:ml-0">
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp AD2PRINT"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#25D366]/30 bg-[#25D366]/10 text-[#0b6b37] transition hover:bg-[#25D366] hover:text-white sm:inline-flex"
          >
            <FaWhatsapp className="h-5 w-5" aria-hidden />
          </a>

          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-2 rounded-full bg-maroon px-3 py-2 text-white shadow-[0_8px_18px_rgba(200,16,46,0.28)] transition hover:bg-maroon-deep sm:px-4"
          >
            <FaPhoneAlt className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden font-display text-sm font-semibold tracking-tight min-[560px]:inline">
              {SITE.phone}
            </span>
            <span className="hidden font-display text-sm font-semibold tracking-tight min-[420px]:inline">
              Call
            </span>
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-maroon/40 hover:text-maroon xl:hidden"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex w-4 flex-col gap-1">
              <span className={`h-0.5 bg-current transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`h-0.5 bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 bg-current transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <div className="max-h-[80vh] overflow-y-auto border-t border-line bg-white px-4 py-4 xl:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-semibold text-ink hover:bg-paper-2"
            >
              Home
            </Link>
            <Link
              href="/categories"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-semibold text-ink hover:bg-paper-2"
            >
              All categories
            </Link>
            <div className="grid grid-cols-2 gap-1 pl-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={getCategoryHref(cat.slug)}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-2 py-2 text-xs text-charcoal hover:bg-paper-2 hover:text-maroon"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-2.5 text-sm text-ink hover:bg-paper-2"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${SITE.phone.replace(/\s/g, "")}`}
              onClick={() => setOpen(false)}
              className="btn-primary mt-3 w-full"
            >
              24×7 · {SITE.phone}
            </a>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
