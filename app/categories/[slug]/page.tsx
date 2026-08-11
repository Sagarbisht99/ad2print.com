import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryIcon } from "@/components/CategoryIcon";
import { NewspaperWall } from "@/components/NewspaperWall";
import { formatPrice, getCategories, getCategory, getNewspapers } from "@/lib/data";
import { AD_TYPES } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getCategories().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return { title: "Category" };
  return {
    title: `${cat.name} Ads`,
    description: cat.description,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const papers = [...getNewspapers()]
    .sort((a, b) => (b.copies ?? 0) - (a.copies ?? 0))
    .slice(0, 8);
  const adTypes = AD_TYPES;
  const subtypes = "subtypes" in cat ? (cat.subtypes as string[] | undefined) : undefined;

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Link href="/categories" className="text-sm font-medium text-maroon hover:underline">
        ← All categories
      </Link>

      <div className="mt-6 flex items-start gap-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-sm bg-maroon text-white">
          <CategoryIcon name={cat.icon} className="h-7 w-7" />
        </span>
        <div>
          <h1 className="font-display text-4xl text-ink sm:text-5xl">{cat.name}</h1>
          <p className="mt-3 max-w-2xl text-lg text-charcoal">{cat.description}</p>
          <p className="mt-4 text-sm text-ink">
            Indicative from{" "}
            <span className="font-semibold text-maroon">{formatPrice(cat.fromPrice)}</span> — exact
            rate depends on paper and edition.
          </p>
        </div>
      </div>

      <div className="mt-12 border-t border-line pt-10">
        <h2 className="font-display text-2xl text-ink">Sample ad formats</h2>
        <p className="mt-2 text-sm text-charcoal">
          See how {cat.name.toLowerCase()} ads typically look as text classified, classified display,
          or main display.
        </p>
        <div className="mt-6 grid gap-5 sm:grid-cols-3">
          {adTypes.map((type) => (
            <Link
              key={type.slug}
              href={`/book?category=${cat.slug}&type=${type.slug}`}
              className="group overflow-hidden border border-line bg-white transition hover:border-maroon/50"
            >
              <div className="bg-paper-2 p-3">
                <Image
                  src={type.image}
                  alt={`Sample ${type.name}`}
                  width={234}
                  height={166}
                  unoptimized
                  className="mx-auto h-auto w-full max-w-[234px] object-contain"
                />
              </div>
              <div className="border-t border-line px-4 py-3">
                <p className="font-display text-sm text-ink group-hover:text-maroon">{type.name}</p>
                <p className="text-xs text-charcoal">From {formatPrice(type.fromPrice)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {subtypes && subtypes.length > 0 && (
        <div className="mt-12 border-t border-line pt-10">
          <h2 className="font-display text-2xl text-ink">Common notice types</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {subtypes.map((s) => (
              <li key={s} className="border-l-2 border-maroon/40 pl-4 text-charcoal">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-12 border-t border-line pt-10">
        <h2 className="font-display text-2xl text-ink">Popular papers for this booking</h2>
        <div className="mt-6 rounded-xl border border-line bg-paper-2/50 p-4">
          <NewspaperWall papers={papers} maxHeight={360} />
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/book?category=${cat.slug}`}
            className="rounded-sm bg-maroon px-6 py-3.5 text-sm font-semibold text-white hover:bg-maroon-deep"
          >
            Book {cat.name}
          </Link>
          <Link
            href="/newspapers"
            className="rounded-sm border border-line px-6 py-3.5 text-sm font-semibold text-ink hover:border-maroon hover:text-maroon"
          >
            Browse all newspapers
          </Link>
        </div>
      </div>
    </div>
  );
}
