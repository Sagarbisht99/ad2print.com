import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BookingSteps } from "@/components/name-change/BookingSteps";
import { NewspaperPicker } from "@/components/name-change/NewspaperPicker";
import {
  getNameChangeCities,
  getNameChangeCityFromSlug,
  getNewspapersByCity,
  slugifyCity,
} from "@/lib/data";
import { breadcrumbJsonLd, pageMeta, serviceJsonLd, webPageJsonLd } from "@/lib/seo";
import { SITE } from "@/lib/site";

type Props = { params: Promise<{ city: string }> };

export async function generateStaticParams() {
  return getNameChangeCities().map((city) => ({ city: slugifyCity(city) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city: slug } = await params;
  const city = getNameChangeCityFromSlug(slug);
  if (!city) return { title: "Choose newspaper" };
  return pageMeta({
    title: `Name Change Newspaper Ad in ${city}`,
    description: `Choose newspapers for a change of name notice in ${city}. Pick English or regional papers, then compose your advertisement.`,
    path: `/name-change/${slug}`,
    image: "/ads/name-change-banner.png",
    imageAlt: `Change of name newspaper ad booking for ${city}`,
    keywords: [
      `name change newspaper ad ${city}`,
      `change of name ${city}`,
      `naam parivartan ${city}`,
      `name change classified ${city}`,
      `passport name change ad ${city}`,
    ],
  });
}

export default async function NameChangeCityPage({ params }: Props) {
  const { city: slug } = await params;
  const city = getNameChangeCityFromSlug(slug);
  if (!city) notFound();

  const papers = getNewspapersByCity(city);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Name change newspaper ad", path: "/name-change" },
            { name: city, path: `/name-change/${slug}` },
          ]),
          webPageJsonLd({
            path: `/name-change/${slug}`,
            name: `Name Change Newspaper Ad in ${city}`,
            description: `Select newspapers in ${city} for a change of name classified notice.`,
            image: "/ads/name-change-banner.png",
          }),
          serviceJsonLd({
            name: `Change of Name newspaper advertisement in ${city}`,
            description: `Book a name change classified in ${city} newspapers, with drafting and publication proof.`,
            path: `/name-change/${slug}`,
          }),
        ]}
      />

      <div className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <BookingSteps current={2} citySlug={slug} />
          <p className="text-sm text-charcoal">
            Help{" "}
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="font-semibold text-maroon">
              {SITE.phone}
            </a>{" "}
            / WhatsApp
          </p>
        </div>
      </div>

      <nav aria-label="Breadcrumb" className="border-b border-line bg-white/70">
        <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1.5 px-4 py-3 text-xs text-charcoal sm:px-6 sm:text-sm">
          <li>
            <Link href="/" className="hover:text-maroon">
              Home
            </Link>
          </li>
          <li aria-hidden className="text-line">
            /
          </li>
          <li>
            <Link href="/name-change" className="hover:text-maroon">
              Name change
            </Link>
          </li>
          <li aria-hidden className="text-line">
            /
          </li>
          <li className="font-medium text-ink">
            <span aria-current="page">{city}</span>
          </li>
        </ol>
      </nav>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-sm text-charcoal">
          Choose a newspaper in {city}. The desk confirms the booking before print.
        </p>
        {papers.length === 0 ? (
          <p className="mt-8 text-sm text-charcoal">
            No newspapers listed for {city} yet.{" "}
            <Link href="/contact" className="font-semibold text-maroon hover:underline">
              Contact the desk
            </Link>{" "}
            and we will book the edition you need.
          </p>
        ) : (
          <div className="mt-5">
            <NewspaperPicker city={city} papers={papers} />
          </div>
        )}
      </div>
    </>
  );
}
