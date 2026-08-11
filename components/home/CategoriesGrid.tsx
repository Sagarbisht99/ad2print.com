import Link from "next/link";
import { CategoryIcon } from "@/components/CategoryIcon";
import { formatPrice, getCategories } from "@/lib/data";

export function CategoriesGrid() {
  const categories = getCategories();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-maroon">Categories</p>
      <h2 className="mt-3 font-display text-3xl text-ink sm:text-4xl">What are you booking?</h2>
      <p className="mt-3 max-w-2xl text-charcoal">
        From name change and matrimonial to property, vehicles, recruitment, and full statutory
        notices — pick a category to see indicative pricing and start a booking.
      </p>
      <div className="mt-10 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/categories/${cat.slug}`}
            className="group flex gap-4 border-b border-line pb-6 transition hover:border-maroon/50"
          >
            <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-sm bg-maroon/10 text-maroon transition group-hover:bg-maroon group-hover:text-white">
              <CategoryIcon name={cat.icon} />
            </span>
            <span>
              <span className="block font-display text-lg text-ink group-hover:text-maroon">
                {cat.name}
              </span>
              <span className="mt-1 block text-sm text-charcoal">{cat.short}</span>
              <span className="mt-2 block text-xs font-medium text-slate">
                From {formatPrice(cat.fromPrice)}
              </span>
            </span>
          </Link>
        ))}
      </div>
      <div className="mt-10">
        <Link
          href="/categories"
          className="text-sm font-semibold text-maroon underline-offset-4 hover:underline"
        >
          Open full category directory →
        </Link>
      </div>
    </section>
  );
}
