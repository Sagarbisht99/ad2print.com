"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { SITE } from "@/lib/site";

const links = [
  { href: "/book", label: "Book an ad" },
  { href: "/categories", label: "Classified" },
  { href: "/newspapers", label: "Newspapers" },
  { href: "/book?type=display", label: "Display ads" },
  { href: "/faq", label: "Rates & FAQ" },
  { href: "/about", label: "About" },
];

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/logo.png"
            alt="AD2PRINT"
            width={220}
            height={186}
            className="h-14 w-auto object-contain sm:h-16"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-0.5 xl:flex">
          {links.map((link) => {
            const pathOnly = link.href.split("?")[0];
            const active =
              pathname === pathOnly ||
              (pathOnly !== "/" && pathname.startsWith(`${pathOnly}/`)) ||
              (link.href.includes("display") && pathname === "/book");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  active ? "font-semibold text-maroon" : "text-slate-deep hover:text-maroon"
                }`}
              >
                {link.label}
                {active && (
                  <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-maroon" />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <a
            href={`https://wa.me/${SITE.whatsapp}`}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-left"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#25D366] text-white">
              <FaWhatsapp className="h-5 w-5" aria-hidden />
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold text-ink">WhatsApp us</span>
              <span className="block text-xs text-charcoal">replies 24×7</span>
            </span>
          </a>
          <Link
            href="/book"
            className="rounded-full bg-maroon px-5 py-2.5 text-sm font-semibold !text-white transition hover:bg-maroon-deep hover:!text-white"
          >
            Book a newspaper ad
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink xl:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex w-5 flex-col gap-1.5">
            <span className={`h-0.5 bg-ink transition ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`h-0.5 bg-ink transition ${open ? "opacity-0" : ""}`} />
            <span className={`h-0.5 bg-ink transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-4 py-4 xl:hidden">
          <nav className="flex flex-col gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-sm px-3 py-3 text-base text-ink hover:bg-maroon/8 hover:text-maroon"
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-sm px-3 py-3 text-base text-ink"
            >
              <FaWhatsapp className="h-5 w-5 text-[#25D366]" aria-hidden />
              WhatsApp us
            </a>
            <Link
              href="/book"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-maroon px-3 py-3 text-center font-semibold !text-white"
            >
              Book a newspaper ad
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
