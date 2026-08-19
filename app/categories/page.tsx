import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryTrigger } from "@/components/CategoryTrigger";
import { JsonLd } from "@/components/JsonLd";
import { formatPrice, getCategories } from "@/lib/data";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { AD_TYPES } from "@/lib/site";

export const metadata: Metadata = pageMeta({
  title: "Newspaper Ad Categories",
  description:
    "Browse newspaper ad categories — matrimonial, property, name change, recruitment, public notice, and more. See formats and start an enquiry.",
  path: "/categories",
  keywords: [
    "newspaper ad categories",
    "matrimonial ads",
    "name change notice",
    "property classifieds",
  ],
});

export default function CategoriesPage() {
  const categories = getCategories();
  const adTypes = AD_TYPES;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
        ])}
      />
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Categories</p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-5xl">What type of ad?</h1>
      <p className="mt-4 max-w-2xl text-lg text-charcoal">
        Pick a category to see typical pricing and start booking. Below are real sample layouts for
        text classified, classified display, and main display ads.
      </p>

      {/* Format samples from releasemyad-style assets */}
      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {adTypes.map((type) => (
          <Link
            key={type.slug}
            href="/contact"
            className="group overflow-hidden border border-line bg-white transition hover:border-maroon/50"
          >
            <div className="bg-paper-2 p-3">
              <Image
                src={type.image}
                alt={`Sample ${type.name}`}
                width={234}
                height={166}
                unoptimized
                className="mx-auto h-auto w-full max-w-[234px] object-contain transition group-hover:scale-[1.02]"
              />
            </div>
            <div className="border-t border-line px-4 py-3">
              <p className="font-display text-base text-ink group-hover:text-maroon">{type.name}</p>
              <p className="mt-0.5 text-xs text-charcoal">{type.short}</p>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mt-14 font-display text-2xl text-ink">Browse by category</h2>
      <p className="mt-2 text-sm text-charcoal">Tap a category to open details and the enquiry form.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categories.map((cat) => (
          <CategoryTrigger
            key={cat.slug}
            slug={cat.slug}
            className="group rounded-xl border border-line bg-white p-6 text-left transition hover:-translate-y-0.5 hover:border-maroon/50 hover:shadow-[0_12px_28px_rgba(46,47,50,0.08)]"
          >
            <span
              className="inline-flex h-14 w-14 items-center justify-center rounded-full"
              style={{ background: `${cat.tint}18`, color: cat.tint }}
            >
              <CategoryIcon name={cat.icon} className="h-7 w-7" />
            </span>
            <h3 className="mt-4 font-display text-xl text-ink group-hover:text-maroon">{cat.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal">{cat.short}</p>
            <p className="mt-4 text-sm font-semibold text-maroon">From {formatPrice(cat.fromPrice)}</p>
          </CategoryTrigger>
        ))}
      </div>
    </div>
  );
}
