import { getNameChangeCities, getNameChangePackages, slugifyCity } from "@/lib/data";
import { getMatrimonialGroups } from "@/lib/matrimonial";
import { getTenderGroups } from "@/lib/tender";

export type RankingOffer = {
  id: string;
  name: string;
  detail: string;
  price: number;
  href: string;
};

export type RankingCity = {
  name: string;
  slug: string;
};

export type RankingCategory = {
  id: "matrimonial" | "change-of-name" | "tender";
  label: string;
  priceLabel: string;
  cities: RankingCity[];
  offers: Record<string, RankingOffer[]>;
  seeAll: Record<string, string>;
};

export type RankingCatalog = RankingCategory[];

const MATRIMONIAL_CITIES: { name: string; match: string }[] = [
  { name: "Delhi", match: "delhi ncr" },
  { name: "Mumbai", match: "mumbai" },
  { name: "Bangalore", match: "bangalore" },
  { name: "Kolkata", match: "kolkata" },
  { name: "Chennai", match: "chennai" },
  { name: "Hyderabad", match: "hyderabad" },
  { name: "Chandigarh", match: "chandigarh" },
  { name: "Lucknow", match: "lucknow" },
  { name: "Jaipur", match: "jaipur" },
  { name: "Pune", match: "pune" },
  { name: "Patna", match: "patna" },
  { name: "Gurugram", match: "gurgaon" },
];

const MAX_OFFERS_PER_CITY = 5;

function languagesFor(papers: { language: string }[]) {
  return [...new Set(papers.map((paper) => paper.language))].join(" + ");
}

function buildMatrimonial(): RankingCategory {
  const packages = getMatrimonialGroups().flatMap((group) => group.packages);
  const cities: RankingCity[] = [];
  const offers: Record<string, RankingOffer[]> = {};
  const seeAll: Record<string, string> = {};

  for (const city of MATRIMONIAL_CITIES) {
    const matches = packages
      .filter((pkg) => typeof pkg.rate === "number" && pkg.rate > 0)
      .filter((pkg) => {
        const listed = pkg.cities.toLowerCase();
        return listed.includes(city.match) || listed.includes("all india");
      })
      .sort((a, b) => (a.rate ?? 0) - (b.rate ?? 0))
      .slice(0, MAX_OFFERS_PER_CITY);

    if (matches.length === 0) continue;

    const slug = slugifyCity(city.name);
    cities.push({ name: city.name, slug });
    seeAll[slug] = "/matrimonial#packages";
    offers[slug] = matches.map((pkg) => ({
      id: pkg.id,
      name: pkg.papers.map((paper) => paper.name).join(" + "),
      detail: `${pkg.name} · ${languagesFor(pkg.papers)}${pkg.bestSeller ? " · Best seller" : ""}`,
      price: pkg.rate ?? 0,
      href: `/matrimonial/book?pkg=${encodeURIComponent(pkg.id)}`,
    }));
  }

  return {
    id: "matrimonial",
    label: "Matrimonial",
    priceLabel: "Text ad, from",
    cities,
    offers,
    seeAll,
  };
}

function buildNameChange(): RankingCategory {
  const cities: RankingCity[] = [];
  const offers: Record<string, RankingOffer[]> = {};
  const seeAll: Record<string, string> = {};

  for (const city of getNameChangeCities()) {
    const slug = slugifyCity(city);
    const packages = getNameChangePackages(city)
      .filter((pkg) => typeof pkg.rate === "number" && pkg.rate > 0)
      .sort((a, b) => (a.rate ?? 0) - (b.rate ?? 0))
      .slice(0, MAX_OFFERS_PER_CITY);

    if (packages.length === 0) continue;

    cities.push({ name: city, slug });
    seeAll[slug] = `/name-change/${slug}`;
    offers[slug] = packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.papers.map((paper) => paper.name).join(" + "),
      detail: `${languagesFor(pkg.papers)} · ${pkg.unit}${pkg.bestSeller ? " · Best seller" : ""}`,
      price: pkg.rate ?? 0,
      href: `/name-change/${slug}/compose?papers=${pkg.slugs.join(",")}`,
    }));
  }

  return {
    id: "change-of-name",
    label: "Change of name",
    priceLabel: "Text ad, from",
    cities,
    offers,
    seeAll,
  };
}

function buildTender(): RankingCategory {
  const groups = getTenderGroups();
  const cities: RankingCity[] = [];
  const offers: Record<string, RankingOffer[]> = {};
  const seeAll: Record<string, string> = {};

  for (const group of groups) {
    const packages = group.packages
      .filter((pkg) => typeof pkg.rate === "number" && pkg.rate > 0)
      .sort((a, b) => (a.rate ?? 0) - (b.rate ?? 0))
      .slice(0, MAX_OFFERS_PER_CITY);

    if (packages.length === 0) continue;

    cities.push({ name: group.title, slug: group.slug });
    seeAll[group.slug] = "/tender-notice#packages";
    offers[group.slug] = packages.map((pkg) => ({
      id: pkg.id,
      name: pkg.papers.map((paper) => paper.name).join(" + "),
      detail: `${pkg.size} minimum · ${languagesFor(pkg.papers)}`,
      price: pkg.rate ?? 0,
      href: `/tender-notice/book?city=${encodeURIComponent(pkg.city)}&papers=${pkg.slugs.join(",")}`,
    }));
  }

  return {
    id: "tender",
    label: "Tender & court notice",
    priceLabel: "Minimum size, from",
    cities,
    offers,
    seeAll,
  };
}

/**
 * Builds the homepage "rank the right papers" card from our own package data.
 * Nothing here is hard-coded to a third-party rate list.
 */
export function buildRankingCatalog(): RankingCatalog {
  return [buildMatrimonial(), buildNameChange(), buildTender()].filter(
    (category) => category.cities.length > 0,
  );
}
