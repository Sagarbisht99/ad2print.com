import Image from "next/image";
import Link from "next/link";
import { CategoryTrigger } from "@/components/CategoryTrigger";
import { getPopularCategories } from "@/lib/data";
import { SITE } from "@/lib/site";

const explore = [
  { href: "/", label: "Home" },
  { href: "/name-change", label: "Change my name" },
  { href: "/categories", label: "Categories" },
  { href: "/newspapers", label: "Newspapers" },
  { href: "/sitemap", label: "Sitemap" },
];

const company = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

const legal = [
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  const cats = getPopularCategories().slice(0, 6);

  return (
    <footer className="mt-auto border-t-4 border-maroon bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="bg-white px-2 py-1.5">
                <Image
                  src="/logo.png"
                  alt=""
                  width={160}
                  height={136}
                  className="h-12 w-auto object-contain"
                />
              </span>
              <span className="font-display text-2xl text-white">{SITE.name}</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-paper/65">{SITE.tagline}</p>
            <div className="mt-6 flex flex-wrap gap-3 text-sm">
              <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="text-paper/90 hover:text-white">
                {SITE.phone}
              </a>
              <span className="text-paper/30">·</span>
              <a href={`mailto:${SITE.email}`} className="text-paper/90 hover:text-white">
                {SITE.email}
              </a>
            </div>
            <p className="mt-3 text-xs text-paper/40">{SITE.hours}</p>
          </div>

          <div>
            <h3 className="section-kicker !text-maroon-soft">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/70">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-kicker !text-maroon-soft">Popular</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/70">
              {cats.map((c) => (
                <li key={c.slug}>
                  <CategoryTrigger slug={c.slug} className="text-left hover:text-white">
                    {c.name}
                  </CategoryTrigger>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-kicker !text-maroon-soft">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/70">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-primary mt-6 !bg-maroon">
              Contact desk
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-paper/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <p>{SITE.address}</p>
            <p className="flex items-center gap-1.5">
              <span className="text-maroon-soft" aria-hidden="true">
                ♥
              </span>
              Done by{" "}
              <a
                href="https://weblign.in"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-paper/30 underline-offset-4 transition hover:text-white"
              >
                weblign.in
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
