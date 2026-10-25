import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { CategoryTrigger } from "@/components/CategoryTrigger";
import { getPopularCategories } from "@/lib/data";
import { SITE } from "@/lib/site";

const explore = [
  { href: "/", label: "Home" },
  { href: "/#name-change", label: "Change my name" },
  { href: "/categories", label: "Categories" },
  { href: "/sitemap", label: "Sitemap" },
];

const company = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
  { href: "/terms", label: "Terms" },
  { href: "/refund", label: "Refund & Cancellation" },
  { href: "/privacy", label: "Privacy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  const cats = getPopularCategories().slice(0, 5);

  return (
    <footer className="mt-auto border-t-4 border-maroon bg-ink text-paper">
      {/* Brand Bar */}
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="bg-white px-2 py-1.5">
              <Image
                src="/logo.png"
                alt=""
                width={160}
                height={146}
                className="h-10 w-auto object-contain"
              />
            </span>
          </Link>
          <p className="max-w-md text-xs text-paper/65">{SITE.tagline}</p>
          <div className="text-xs text-paper/70">
            <p className="font-medium text-paper/85">GSTIN: {SITE.gstin}</p>
            <p className="text-paper/60">{SITE.hours}</p>
          </div>
        </div>
      </div>

      {/* 4 Lists in exact SAME ROW */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          
          {/* List 1: Explore */}
          <div>
            <h3 className="section-kicker !text-maroon-soft">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* List 2: Popular Categories */}
          <div>
            <h3 className="section-kicker !text-maroon-soft">Popular</h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              {cats.map((c) => (
                <li key={c.slug}>
                  <CategoryTrigger slug={c.slug} className="text-left hover:text-white transition-colors">
                    {c.name}
                  </CategoryTrigger>
                </li>
              ))}
            </ul>
          </div>

          {/* List 3: Company & Legal */}
          <div>
            <h3 className="section-kicker !text-maroon-soft">Company</h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* List 4: Contact */}
          <div>
            <h3 className="section-kicker !text-maroon-soft">Contact</h3>
            <div className="mt-4 space-y-3 text-sm text-paper/80">
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="flex items-center gap-2 transition hover:text-white">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-maroon-soft">
                  <FaPhoneAlt className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-xs">{SITE.phone}</span>
              </a>
              <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 transition hover:text-white">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-maroon-soft">
                  <FaEnvelope className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-xs">{SITE.email}</span>
              </a>
              <div className="flex items-start gap-2">
                <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10 text-maroon-soft">
                  <FaMapMarkerAlt className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-xs leading-relaxed text-paper/80">{SITE.address}</span>
              </div>
              <Link href="/contact" className="btn-primary mt-3 inline-block !bg-maroon px-4 py-1.5 text-xs">
                Contact desk
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <p>{SITE.address}</p>
            <p className="flex flex-wrap items-center gap-1.5 text-[11px] text-paper/60">
              <span className="text-maroon-soft" aria-hidden="true">❤️</span>
              <span>Created by</span>
              <a
                href="https://weblign.in/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-paper/30 underline-offset-4 transition hover:text-white"
              >
                weblign.in
              </a>
              <span>&</span>
              <a
                href="https://codewithsagar.online/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-paper/30 underline-offset-4 transition hover:text-white"
              >
                codewithsagar.online
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}