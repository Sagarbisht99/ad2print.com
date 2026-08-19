import type { Metadata } from "next";
import Link from "next/link";
import { getCategories, getNewspapers } from "@/lib/data";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({
  title: "HTML Sitemap",
  description:
    "Complete sitemap of AD2PRINT — newspapers, ad categories, contact, and legal pages for newspaper ad booking.",
  path: "/sitemap",
});

export default function SitemapPage() {
  const categories = getCategories();
  const newspapers = [...getNewspapers()].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Index</p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">Sitemap</h1>
      <p className="mt-4 max-w-2xl text-lg text-charcoal">
        Every public page on AD2PRINT, grouped so you can jump to a paper, category, or company page.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-2xl text-ink">Main pages</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { href: "/", label: "Home" },
            { href: "/categories", label: "Categories" },
            { href: "/newspapers", label: "Newspapers" },
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/disclaimer", label: "Disclaimer" },
            { href: "/sitemap", label: "Sitemap" },
          ].map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="text-sm text-maroon hover:underline">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-line pt-10">
        <h2 className="font-display text-2xl text-ink">Ad categories</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <Link href={`/categories/${cat.slug}`} className="text-sm text-maroon hover:underline">
                {cat.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12 border-t border-line pt-10">
        <h2 className="font-display text-2xl text-ink">Newspapers</h2>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {newspapers.map((paper) => (
            <li key={paper.slug}>
              <Link href={`/newspapers/${paper.slug}`} className="text-sm text-maroon hover:underline">
                {paper.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
