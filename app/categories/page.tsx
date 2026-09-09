import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { CategoryTrigger } from "@/components/CategoryTrigger";
import { JsonLd } from "@/components/JsonLd";
import { getCategories } from "@/lib/data";
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
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Categories", path: "/categories" },
        ])}
      />
      <p className="section-kicker">Categories</p>
      <h1 className="mt-3 font-display text-4xl text-ink sm:text-6xl">What type of ad?</h1>
      <p className="mt-5 max-w-2xl text-lg text-charcoal">
        Pick a category to enquire. Sample layouts below show text classified, classified display,
        and main display.
      </p>

      <div className="mt-12 grid gap-0 border-y border-line md:grid-cols-3">
        {adTypes.map((type) => (
          <Link
            key={type.slug}
            href="/contact"
            className="group border-line bg-white p-5 transition hover:bg-paper-2 md:border-r md:last:border-r-0"
          >
            <div className="bg-paper-2 p-4">
              <Image
                src={type.image}
                alt={`Sample ${type.name}`}
                width={234}
                height={166}
                unoptimized
                className="mx-auto h-auto w-full max-w-[220px] object-contain"
              />
            </div>
            <p className="mt-4 font-display text-xl text-ink group-hover:text-maroon">{type.name}</p>
            <p className="mt-1 text-sm text-charcoal">{type.short}</p>
          </Link>
        ))}
      </div>

      <h2 className="mt-16 font-display text-3xl text-ink sm:text-4xl">Browse by category</h2>
      <p className="mt-3 text-charcoal">Tap a category to open details and the enquiry form.</p>
      <div className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {categories.map((cat) => (
          <CategoryTrigger
            key={cat.slug}
            slug={cat.slug}
            className="group relative flex flex-col items-start border border-line bg-white p-4 text-left transition duration-200 hover:-translate-y-1 hover:border-maroon/45 hover:shadow-[0_16px_36px_rgba(178,31,45,0.1)] sm:p-5"
          >
            {cat.popular ? (
              <span className="absolute right-3 top-3 text-[10px] font-bold uppercase tracking-[0.14em] text-maroon">
                Popular
              </span>
            ) : null}
            <span
              className="flex h-12 w-12 items-center justify-center transition duration-200 group-hover:scale-105 sm:h-14 sm:w-14"
              style={{ background: `${cat.tint}18`, color: cat.tint }}
            >
              <CategoryIcon name={cat.icon} className="h-6 w-6 sm:h-7 sm:w-7" />
            </span>
            <span className="mt-4 font-display text-base leading-snug text-ink group-hover:text-maroon sm:text-lg">
              {cat.name}
            </span>
            <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-charcoal sm:text-sm">
              {cat.short}
            </span>
            <span className="mt-auto pt-4 text-xs font-semibold text-maroon sm:text-sm">
              Enquire
              <span className="ml-1 inline-block transition group-hover:translate-x-0.5">→</span>
            </span>
          </CategoryTrigger>
        ))}
      </div>
    </div>
  );
}
