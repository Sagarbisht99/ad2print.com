import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BookingSteps } from "@/components/name-change/BookingSteps";
import { NoticeBuilder } from "@/components/name-change/NoticeBuilder";
import {
  getCities,
  getCityFromSlug,
  getNameChangeSelection,
  slugifyCity,
} from "@/lib/data";
import { breadcrumbJsonLd, pageMeta } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ papers?: string }>;
};

export async function generateStaticParams() {
  return getCities().map((city) => ({ city: slugifyCity(city) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getCityFromSlug(slug);
  if (!city) return { title: "Compose advertisement" };
  return pageMeta({
    title: `Compose Name Change Ad in ${city}`,
    description: `Fill your change of name details for ${city} newspapers. Live English or Hindi preview, then send the draft to AD2PRINT.`,
    path: `/name-change/${slug}/compose`,
    noIndex: true,
  });
}

export default async function NameChangeComposePage({ params, searchParams }: Props) {
  const { city: slug } = await params;
  const city = getCityFromSlug(slug);
  if (!city) notFound();

  const query = await searchParams;
  const slugs = (query.papers ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  const selection = getNameChangeSelection(slugs);

  if (!selection) {
    redirect(`/name-change/${slug}`);
  }

  const cities = getCities();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Name change newspaper ad", path: "/name-change" },
          { name: city, path: `/name-change/${slug}` },
          { name: "Compose advertisement", path: `/name-change/${slug}/compose` },
        ])}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <BookingSteps current={3} citySlug={slug} />
          <p className="text-sm text-charcoal">
            Need help? Call{" "}
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-maroon">
              {SITE.phone}
            </a>
          </p>
        </div>
      </div>

      <nav aria-label="Breadcrumb" className="border-b border-line bg-white/70">
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-4 py-3 text-xs text-charcoal sm:px-6 sm:text-sm">
          <li>
            <Link href="/name-change" className="hover:text-maroon">
              Name change
            </Link>
          </li>
          <li aria-hidden className="text-line">
            /
          </li>
          <li>
            <Link href={`/name-change/${slug}`} className="hover:text-maroon">
              {city}
            </Link>
          </li>
          <li aria-hidden className="text-line">
            /
          </li>
          <li className="font-medium text-ink">
            <span aria-current="page">Compose ad</span>
          </li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="section-kicker">Step 3 · {city}</p>
        <h1 className="mt-2 font-display text-2xl text-ink sm:text-4xl">
          Compose your advertisement
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
          Fill the same name-change fields. The preview updates as you type. Your selected paper
          stays on the right so the desk already knows the edition.
        </p>
        <div className="mt-10">
          <NoticeBuilder
            cities={cities}
            booking={{
              city,
              papers: selection.papers,
              label: selection.label,
              unit: selection.unit,
            }}
          />
        </div>
      </div>
    </>
  );
}
