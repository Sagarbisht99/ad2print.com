import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { formatPrice, getCategories } from "@/lib/data";
import { AD_TYPES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ad Categories",
  description:
    "Browse newspaper ad categories — matrimonial, property, name change, recruitment, and more. See real sample ad formats.",
};

export default function CategoriesPage() {
  const categories = getCategories();
  const adTypes = AD_TYPES;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
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
            href={`/book?type=${type.slug}`}
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
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group border border-line bg-white p-6 transition hover:border-maroon/50"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-sm bg-maroon/8 text-maroon transition group-hover:bg-maroon group-hover:text-white">
              <CategoryIcon name={cat.icon} className="h-6 w-6" />
            </span>
            <h3 className="mt-4 font-display text-xl text-ink group-hover:text-maroon">{cat.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-charcoal">{cat.short}</p>
            <p className="mt-4 text-sm font-semibold text-maroon">From {formatPrice(cat.fromPrice)}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
