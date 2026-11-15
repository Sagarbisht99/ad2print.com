import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BookingSteps } from "@/components/name-change/BookingSteps";
import { CityImageGrid } from "@/components/name-change/CityImageGrid";
import { NewspaperPicker } from "@/components/name-change/NewspaperPicker";
import {
  getNameChangeCities,
  getNameChangeCityFromSlug,
  getNewspapersByCity,
  slugifyCity,
} from "@/lib/data";
import { cityDisplayName, getCityImage } from "@/lib/city-images";
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
    image: "/ads/hero.png",
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
  const displayCity = cityDisplayName(city);
  const cityImage = getCityImage(city);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Name change newspaper ad", path: "/change-my-name" },
            { name: city, path: `/name-change/${slug}` },
          ]),
          webPageJsonLd({
            path: `/name-change/${slug}`,
            name: `Name Change Newspaper Ad in ${city}`,
            description: `Select newspapers in ${city} for a change of name classified notice.`,
            image: "/ads/hero.png",
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

      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10">
          <nav aria-label="Breadcrumb" className="text-xs text-charcoal sm:text-sm">
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="hover:text-maroon">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-line">
                /
              </li>
              <li>
                <Link href="/change-my-name" className="hover:text-maroon">
                  Change my name
                </Link>
              </li>
              <li aria-hidden className="text-line">
                /
              </li>
              <li className="font-medium text-ink">
                <span aria-current="page">{displayCity}</span>
              </li>
            </ol>
          </nav>

          <div className="mt-7 grid gap-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-maroon">
                Name change notice · {displayCity}
              </p>
              <h1 className="mt-4 max-w-2xl font-display text-3xl leading-[1.05] text-ink sm:text-5xl">
                Name Change Newspaper Ad in {displayCity}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-charcoal sm:text-base">
                Choose a newspaper in {displayCity} for your change-of-name notice. Pick a single
                paper or an English + regional pair, and the desk confirms the wording, rate and
                publication date before print.
              </p>
              <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-charcoal sm:text-sm">
                <li>{papers.length} newspapers listed</li>
                <li>English + regional</li>
                <li>Free drafting</li>
                <li>e-paper proof</li>
              </ul>
            </div>

            <figure className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-line bg-ink">
              {cityImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={cityImage}
                  alt={`${displayCity} city`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span
                  className="absolute inset-0 bg-[linear-gradient(135deg,#8a0a1f_0%,#c8102e_55%,#1a1b1e_100%)]"
                  aria-hidden
                />
              )}
              <span
                className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(20,21,24,0.8)_100%)]"
                aria-hidden
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
                <span className="font-display text-xl font-semibold text-white sm:text-2xl">
                  {displayCity}
                </span>
                <span className="rounded-full border border-white/25 bg-black/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-white/90">
                  City edition
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
        <p className="text-sm text-charcoal">
          Choose a newspaper in {displayCity}. The desk confirms the booking before print.
        </p>
        {papers.length === 0 ? (
          <p className="mt-8 text-sm text-charcoal">
            No newspapers listed for {displayCity} yet.{" "}
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

      <CityImageGrid
        cities={getNameChangeCities()}
        exclude={city}
        limit={10}
        eyebrow="More city editions"
        title="Name-change ads in other cities"
        description={`Not in ${displayCity}? Pick another city edition to see its newspapers and one-paper or two-paper combinations.`}
      />
    </>
  );
}
