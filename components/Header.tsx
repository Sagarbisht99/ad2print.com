"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCategoryEnquiry } from "@/components/CategoryEnquiry";
import { getCategories } from "@/lib/data";
import { SITE } from "@/lib/site";
import { EnquiryHanger } from "@/components/EnquiryHanger";
import { FaPhoneAlt } from "react-icons/fa";

const links = [
  { href: "/name-change", label: "Change of name" },
  { href: "/newspapers", label: "Newspapers" },
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
    <header className="sticky top-0 z-50 border-b border-line bg-paper/90 backdrop-blur-md">
      <EnquiryHanger className="absolute right-8 top-[calc(100%-18px)] hidden w-26 lg:block" />
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:h-17 sm:gap-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          onClick={() => setOpen(false)}
          aria-label="AD2PRINT home"
        >
          <Image
            src="/logo.png"
            alt="AD2PRINT"
            width={220}
            height={186}
            className="h-9 w-auto object-contain sm:h-11"
            priority
          />
          <span className="hidden font-display text-xl tracking-tight text-maroon min-[400px]:inline sm:text-2xl">
            {SITE.name}
          </span>
        </Link>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setCatsOpen(true)}
            onMouseLeave={() => setCatsOpen(false)}
          >
            <button
              type="button"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                pathname.startsWith("/categories")
                  ? "text-maroon"
                  : "text-slate-deep hover:text-maroon"
              }`}
              onClick={() => setCatsOpen((v) => !v)}
            >
              Categories
            </button>
            {catsOpen && (
              <div className="absolute left-0 top-full z-50 w-72 border border-line bg-white p-1.5 shadow-lg">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      openCategory(cat.slug);
                      setCatsOpen(false);
                    }}
                    className="block w-full px-3 py-2 text-left text-sm text-ink hover:bg-paper-2 hover:text-maroon"
                  >
                    {cat.name}
                  </button>
                ))}
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
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive(pathname, link.href)
                  ? "text-maroon"
                  : "text-slate-deep hover:text-maroon"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2">
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
            className="inline-flex h-10 w-10 items-center justify-center border border-line text-ink lg:hidden"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex w-4 flex-col gap-1">
              <span className={`h-0.5 bg-ink transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`h-0.5 bg-ink transition ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 bg-ink transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
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
              className="px-2 py-2.5 text-sm font-semibold text-ink"
            >
              Categories
            </Link>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="px-2 py-2.5 text-sm text-ink"
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
