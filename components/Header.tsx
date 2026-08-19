"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useCategoryEnquiry } from "@/components/CategoryEnquiry";
import { getCategories } from "@/lib/data";
import { SITE } from "@/lib/site";

const links = [
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
    <header className="sticky top-0 z-50 border-b border-line/60 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center gap-3 px-4 sm:h-[5rem] sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 sm:gap-3"
          onClick={() => setOpen(false)}
          aria-label="AD2PRINT home"
        >
          <Image
            src="/logo.png"
            alt=""
            width={220}
            height={186}
            className="h-12 w-auto object-contain sm:h-14"
            priority
          />
          <span className="font-display text-lg tracking-tight text-maroon sm:text-xl">AD2PRINT</span>
        </Link>

        <nav className="ml-auto hidden min-w-0 items-center lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setCatsOpen(true)}
            onMouseLeave={() => setCatsOpen(false)}
          >
            <button
              type="button"
              className={`whitespace-nowrap px-2.5 py-2 text-[13px] font-medium transition-colors ${
                pathname.startsWith("/categories")
                  ? "font-semibold text-maroon"
                  : "text-slate-deep hover:text-maroon"
              }`}
              onClick={() => setCatsOpen((v) => !v)}
            >
              Categories
            </button>
            {catsOpen && (
              <div className="absolute left-0 top-full z-50 w-72 rounded-xl border border-line bg-white p-2 shadow-[0_16px_40px_rgba(46,47,50,0.12)]">
                {categories.map((cat) => (
                  <button
                    key={cat.slug}
                    type="button"
                    onClick={() => {
                      openCategory(cat.slug);
                      setCatsOpen(false);
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-maroon/8 hover:text-maroon"
                  >
                    {cat.name}
                  </button>
                ))}
                <Link
                  href="/categories"
                  onClick={() => setCatsOpen(false)}
                  className="mt-1 block rounded-lg px-3 py-2 text-sm font-semibold text-maroon hover:bg-maroon/8"
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
              className={`whitespace-nowrap px-2.5 py-2 text-[13px] font-medium transition-colors ${
                isActive(pathname, link.href)
                  ? "font-semibold text-maroon"
                  : "text-slate-deep hover:text-maroon"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-3">
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            aria-label="WhatsApp us"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white"
          >
            <FaWhatsapp className="h-5 w-5" aria-hidden />
          </a>
          <Link
            href="/contact"
            className="hidden rounded-full bg-maroon px-4 py-2 text-[13px] font-semibold !text-white hover:bg-maroon-deep sm:inline-flex"
          >
            Contact us
          </Link>
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink lg:hidden"
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
        <div className="max-h-[80vh] overflow-y-auto border-t border-line bg-white px-4 py-3 lg:hidden">
          <nav className="flex flex-col">
            <Link
              href="/categories"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2.5 text-sm font-semibold text-ink hover:bg-maroon/8 hover:text-maroon"
            >
              Categories
            </Link>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2.5 text-sm text-ink hover:bg-maroon/8 hover:text-maroon"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-maroon px-3 py-2.5 text-center text-sm font-semibold !text-white"
            >
              Contact us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
