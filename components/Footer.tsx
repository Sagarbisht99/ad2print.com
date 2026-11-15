import Image from "next/image";
import Link from "next/link";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import { getCategoryHref } from "@/lib/category-routes";
import {
  getCategoriesOrdered,
  getNameChangeCities,
  slugifyCity,
} from "@/lib/data";
import { getPopularNewspapers } from "@/lib/newspaper-content";
import { SITE } from "@/lib/site";

const explore = [
  { href: "/", label: "Home" },
  { href: "/newspaper-classified", label: "Newspaper classified ads" },
  { href: "/recruitment", label: "Recruitment ads in Delhi" },
  { href: "/obituary", label: "Obituary ads in Delhi" },
  { href: "/property", label: "Property ads" },
  { href: "/lost-and-found", label: "Lost & found ads" },
  { href: "/categories", label: "All services & categories" },
  { href: "/newspapers", label: "Newspaper directory" },
  { href: "/#rates", label: "Rates & cut-off times" },
  { href: "/#faq", label: "FAQ" },
  { href: "/sitemap", label: "HTML sitemap" },
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
  const ordered = getCategoriesOrdered();
  const popular = ordered.slice(0, 6);
  const remaining = ordered.slice(6);
  const nameChangeCities = getNameChangeCities();
  const footerCities = [
    "Delhi",
    "Mumbai",
    "Bangalore",
    "Hyderabad",
    "Chennai",
    "Kolkata",
    "Pune",
    "Ahmedabad",
    "Jaipur",
    "Lucknow",
  ].filter((city) => nameChangeCities.includes(city));
  const footerPapers = getPopularNewspapers(8);

  return (
    <footer className="mt-auto border-t-4 border-maroon bg-ink text-paper">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-6 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="bg-white px-2 py-1.5">
              <Image
                src="/logo.png"
                alt="AD2PRINT"
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

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="section-kicker !text-maroon-soft">Explore</h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              {explore.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-kicker !text-maroon-soft">Popular services</h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              {popular.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={getCategoryHref(category.slug)}
                    className="transition-colors hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="section-kicker !text-maroon-soft">More services</h3>
            <ul className="mt-4 space-y-2 text-sm text-paper/70">
              {remaining.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={getCategoryHref(category.slug)}
                    className="transition-colors hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/matrimonial" className="font-medium text-maroon-soft hover:text-white">
                  Matrimonial packages
                </Link>
              </li>
              <li>
                <Link href="/tender-notice" className="font-medium text-maroon-soft hover:text-white">
                  Tender &amp; court notices
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="section-kicker !text-maroon-soft">Contact</h3>
            <div className="mt-4 space-y-3 text-sm text-paper/80">
              <a
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-2 transition hover:text-white"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-maroon-soft">
                  <FaPhoneAlt className="h-3 w-3" aria-hidden="true" />
                </span>
                <span className="text-xs">{SITE.phone}</span>
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-2 transition hover:text-white"
              >
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
              <Link
                href="/contact"
                className="btn-primary mt-3 inline-block !bg-maroon px-4 py-1.5 text-xs"
              >
                Contact desk
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-paper/50">
            Company &amp; legal
          </h3>
          <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-paper/60">
            {company.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-6 border-t border-white/10 pt-6 sm:grid-cols-2">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-paper/50">
              Name change by city
            </h3>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-paper/60">
              {footerCities.map((city) => (
                <li key={city}>
                  <Link
                    href={`/name-change/${slugifyCity(city)}`}
                    className="transition-colors hover:text-white"
                  >
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-[0.16em] text-paper/50">
              Popular newspapers
            </h3>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs text-paper/60">
              {footerPapers.map((paper) => (
                <li key={paper.slug}>
                  <Link
                    href={`/newspapers/${paper.slug}`}
                    className="transition-colors hover:text-white"
                  >
                    {paper.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <p className="text-[11px] leading-relaxed text-paper/60">
            AD2PRINT is a private newspaper advertising agency and is not affiliated with any
            government department. We only facilitate the booking and publication of newspaper
            advertisements and do not issue, create, modify or process government documents such as
            Passports, PAN Cards, Aadhaar Cards or Gazette Notifications.{" "}
            <Link
              href="/disclaimer"
              className="underline decoration-paper/30 underline-offset-4 transition hover:text-white"
            >
              Read full disclaimer
            </Link>
            .
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5 text-xs text-paper/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>
            © {new Date().getFullYear()} {SITE.name}. All rights reserved.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <p>{SITE.address}</p>
            <p className="flex flex-wrap items-center gap-1.5 text-[11px] text-paper/60">
              <span className="text-maroon-soft" aria-hidden="true">
                ❤️
              </span>
              <span>Created by</span>
              <a
                href="https://weblign.in/"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-paper/30 underline-offset-4 transition hover:text-white"
              >
                weblign.in
              </a>
              <span>&amp;</span>
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
