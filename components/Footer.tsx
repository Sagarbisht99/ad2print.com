import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";
import { CategoryTrigger } from "@/components/CategoryTrigger";
import { getPopularCategories } from "@/lib/data";
import { SITE } from "@/lib/site";

const explore = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categories" },
  { href: "/newspapers", label: "Newspapers" },
  { href: "/sitemap", label: "Sitemap" },
];

const company = [
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
];

const legal = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/disclaimer", label: "Disclaimer" },
];

export function Footer() {
  const cats = getPopularCategories().slice(0, 6);

  return (
    <footer className="mt-auto border-t border-line bg-slate-deep text-paper">
      <div className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="mb-4 inline-block rounded-xl bg-white px-3 py-2">
              <Image
                src="/logo.png"
                alt="AD2PRINT"
                width={200}
                height={170}
                className="h-16 w-auto object-contain sm:h-[4.5rem]"
              />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-paper/70">{SITE.tagline}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="rounded-full border border-white/15 px-4 py-2 text-sm text-paper/90 transition hover:border-white/40 hover:text-white"
              >
                {SITE.phone}
              </a>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white"
              >
                <FaWhatsapp className="h-4 w-4" aria-hidden />
                WhatsApp
              </a>
            </div>
            <p className="mt-4 text-xs text-paper/45">{SITE.hours}</p>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wide text-white">Explore</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/75">
              {explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wide text-white">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/75">
              {company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a href={`mailto:${SITE.email}`} className="transition hover:text-white">
                  {SITE.email}
                </a>
              </li>
              <li className="text-paper/55">{SITE.address}</li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wide text-white">Popular</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/75">
              {cats.map((c) => (
                <li key={c.slug}>
                  <CategoryTrigger slug={c.slug} className="text-left transition hover:text-white">
                    {c.name}
                  </CategoryTrigger>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-sm font-semibold tracking-wide text-white">Legal</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-paper/75">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="transition hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/contact"
              className="mt-6 inline-flex rounded-full bg-maroon px-4 py-2.5 text-sm font-semibold !text-white transition hover:bg-maroon-deep"
            >
              Contact us
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-paper/50 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            {legal.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-paper/80">
                {l.label}
              </Link>
            ))}
            <Link href="/sitemap" className="hover:text-paper/80">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
