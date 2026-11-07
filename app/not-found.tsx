import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Page not found (404)",
  description:
    "This page does not exist. Browse newspaper ad categories, book a name change notice, or contact the AD2PRINT desk.",
  robots: { index: false, follow: false },
};

const QUICK_LINKS = [
  {
    href: "/#name-change",
    title: "Change of name ad",
    text: "Compose a name change notice and pick your city newspapers.",
  },
  {
    href: "/categories",
    title: "All categories",
    text: "Matrimonial, property, recruitment, lost & found, and more.",
  },
  {
    href: "/sitemap",
    title: "Sitemap",
    text: "Every category, city, and page on AD2PRINT in one place.",
  },
  {
    href: "/contact",
    title: "Contact the desk",
    text: "Call, WhatsApp, or email us for help with your booking.",
  },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24">
      <div className="max-w-2xl">
        <p className="section-kicker">Error 404</p>
        <p
          aria-hidden
          className="mt-4 font-display text-7xl leading-none text-maroon/15 sm:text-9xl"
        >
          404
        </p>
        <h1 className="mt-2 font-display text-4xl text-ink sm:text-5xl">
          This page could not be found
        </h1>
        <div className="mt-5 h-1 w-20 bg-maroon" />
        <p className="mt-6 text-base leading-relaxed text-charcoal">
          The link may be broken, or the page may have moved. Your newspaper ad booking is still
          safe — start from the home page or jump to one of the popular sections below.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn-primary">
            Go to home page
          </Link>
          <Link href="/#name-change" className="btn-ghost">
            Book a name change ad
          </Link>
        </div>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="group rounded-xl border border-line bg-white p-5 transition hover:border-maroon/40 hover:shadow-sm"
          >
            <p className="font-display text-lg text-ink group-hover:text-maroon">{link.title} →</p>
            <p className="mt-1.5 text-sm leading-relaxed text-charcoal">{link.text}</p>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-sm text-charcoal">
        Need help? Call{" "}
        <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-maroon">
          {SITE.phone}
        </a>{" "}
        or{" "}
        <a
          href={`https://wa.me/${SITE.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-maroon"
        >
          WhatsApp us
        </a>
        . {SITE.hours}.
      </p>
    </div>
  );
}
