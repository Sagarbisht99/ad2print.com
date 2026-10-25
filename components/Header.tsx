"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCategoryEnquiry } from "@/components/CategoryEnquiry";
import { getCategories } from "@/lib/data";
import { SITE } from "@/lib/site";
import { EnquiryHanger } from "@/components/EnquiryHanger";
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";

const links = [
  { href: "/#faq", label: "FAQ" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  const pathOnly = href.split("?")[0];
  return pathname === pathOnly || (pathOnly !== "/" && pathname.startsWith(`${pathOnly}/`));
}

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);
  const categories = getCategories();
  const { openCategory } = useCategoryEnquiry();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/95 backdrop-blur-md">
      <div className="hidden border-b border-maroon/20 bg-[linear-gradient(90deg,#8a0a1f_0%,#a80d27_45%,#c8102e_100%)] text-[11px] leading-tight text-white sm:block sm:text-[12px] md:text-[13px]">
        <div className="mx-auto flex max-w-7xl flex-col gap-1.5 px-3 py-1.5 sm:px-6 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2 text-white/95 md:justify-start">
            <span className="inline-flex items-center gap-1.5">
              <FaPhoneAlt className="h-3 w-3 shrink-0 md:h-3.5 md:w-3.5" aria-hidden />
              <span>Available 24×7</span>
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
              className="inline-flex items-center gap-1.5 font-medium text-white/95 transition hover:text-white"
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
            className="h-9 w-auto object-contain sm:h-10"
            priority
          />
        </Link>

        <nav className="mx-auto hidden items-center gap-1 lg:flex">
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
              onClick={() => setCatsOpen((v) => !v)}
            >
              Categories
            </button>
            {catsOpen && (
              <div className="absolute left-0 top-full z-50 mt-0 w-72 overflow-hidden rounded-xl border border-line bg-white p-1.5 shadow-[0_22px_40px_rgba(26,27,30,0.12)]">
                {categories.map((cat) =>
                  cat.slug === "change-of-name" ? (
                    <Link
                      key={cat.slug}
                      href="/#name-change"
                      onClick={() => setCatsOpen(false)}
                      className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-ink transition hover:bg-paper-2 hover:text-maroon"
                    >
                      {cat.name}
                    </Link>
                  ) : (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => {
                        openCategory(cat.slug);
                        setCatsOpen(false);
                      }}
                      className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-ink transition hover:bg-paper-2 hover:text-maroon"
                    >
                      {cat.name}
                    </button>
                  ),
                )}
                <Link
                  href="/categories"
                  onClick={() => setCatsOpen(false)}
                  className="mt-1 block border-t border-line px-3 py-2.5 text-sm font-semibold text-maroon"
                >
                  View all categories →
                </Link>
              </div>
            )}
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

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-0">
          <a
            href={`tel:${SITE.phone.replace(/\s/g, "")}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-maroon px-2.5 py-1.5 text-white shadow-[0_8px_18px_rgba(178,31,45,0.28)] transition hover:bg-maroon-deep sm:gap-2.5 sm:px-4 sm:py-2"
          >
            <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] font-extrabold tracking-wide text-maroon sm:px-2 sm:text-[11px]">
              24×7
            </span>
            <FaPhoneAlt className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
            <span className="hidden font-display text-sm font-semibold tracking-tight min-[520px]:inline sm:text-base">
              {SITE.phone}
            </span>
          </a>

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-maroon/40 hover:text-maroon lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-4 flex-col gap-1">
              <span className={`h-0.5 bg-current transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`h-0.5 bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 bg-current transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      {open && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-line bg-white px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            <Link
              href="/categories"
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-semibold text-ink hover:bg-paper-2"
            >
              Categories
            </Link>
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
      )}
    </header>
  );
}
