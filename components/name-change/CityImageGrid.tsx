import Link from "next/link";
import { cityDisplayName, getCityImage } from "@/lib/city-images";
import { slugifyCity } from "@/lib/data";

type Props = {
  cities: string[];
  exclude?: string;
  limit?: number;
  title?: string;
  description?: string;
  eyebrow?: string;
  id?: string;
};

/**
 * City cards with the city photo and the city name. Used on the name-change
 * landing page and on every /name-change/[city] page so the reader can move
 * to another city edition without going back to the homepage.
 */
export function CityImageGrid({
  cities,
  exclude,
  limit,
  title = "Choose your city to start the notice",
  description = "Each city page lists the newspapers available for a name-change classified, along with the standard one-paper and two-paper combinations.",
  eyebrow = "City editions",
  id = "cities",
}: Props) {
  const items = cities.filter((city) => city !== exclude).slice(0, limit ?? cities.length);

  if (items.length === 0) return null;

  return (
    <section id={id} className="scroll-mt-24 border-b border-line bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="section-kicker">{eyebrow}</p>
        <h2 className="mt-3 font-display text-2xl text-ink sm:text-4xl">{title}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-charcoal">{description}</p>

        <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {items.map((city) => {
            const image = getCityImage(city);
            const name = cityDisplayName(city);

            return (
              <Link
                key={city}
                href={`/name-change/${slugifyCity(city)}`}
                className="group relative flex aspect-[4/3] flex-col justify-end overflow-hidden rounded-xl border border-line bg-ink"
              >
                {image ? (
                  // Remote city photos come from several domains; a plain img keeps the list light.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={`${name} city`}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <span
                    className="absolute inset-0 bg-[linear-gradient(135deg,#8a0a1f_0%,#c8102e_55%,#1a1b1e_100%)]"
                    aria-hidden
                  />
                )}
                <span
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgba(20,21,24,0.82)_100%)]"
                  aria-hidden
                />
                <span className="relative p-3 sm:p-4">
                  <span className="block font-display text-sm font-semibold leading-snug text-white sm:text-base">
                    {name}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium uppercase tracking-[0.1em] text-white/75">
                    Browse papers →
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
