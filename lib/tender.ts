import tenderPackages from "@/data/tender-packages.json";
import { getNewspapersBySlugs, slugifyCity, type Newspaper } from "@/lib/data";

type RawPackage = {
  slugs: string[];
  label: string;
  size: string;
  bestSeller?: boolean;
  tag?: string;
  rate?: number;
};

type RawGroup = {
  city: string;
  title: string;
  packages: RawPackage[];
};

export type TenderPackage = {
  id: string;
  city: string;
  slugs: string[];
  label: string;
  papers: Newspaper[];
  unit: string;
  size: string;
  bestSeller: boolean;
  tag?: string;
  rate?: number;
};

export type TenderGroup = {
  city: string;
  title: string;
  slug: string;
  packages: TenderPackage[];
};

const GROUPS = tenderPackages as RawGroup[];

function toPackage(city: string, row: RawPackage): TenderPackage | null {
  const papers = getNewspapersBySlugs(row.slugs);
  if (papers.length !== row.slugs.length) return null;

  return {
    id: `${slugifyCity(city)}-${papers.map((paper) => paper.slug).join("-")}`,
    city,
    slugs: papers.map((paper) => paper.slug),
    label: row.label,
    papers,
    unit:
      papers.length <= 1 ? "Per ad" : papers.length === 2 ? "Both ads" : `${papers.length} ads`,
    size: row.size,
    bestSeller: Boolean(row.bestSeller),
    tag: row.tag ?? (papers.length === 1 ? papers[0].language : undefined),
    rate: row.rate,
  };
}

export function getTenderGroups(): TenderGroup[] {
  return GROUPS.map((group) => ({
    city: group.city,
    title: group.title,
    slug: slugifyCity(group.title),
    packages: group.packages
      .map((row) => toPackage(group.city, row))
      .filter((row): row is TenderPackage => Boolean(row)),
  })).filter((group) => group.packages.length > 0);
}

export function getTenderPackages(city: string): TenderPackage[] {
  return getTenderGroups().find((group) => group.city === city)?.packages ?? [];
}

/**
 * Resolves a tender/public-notice package on the server so the payable amount
 * always comes from our own data, never from the client.
 */
export function getTenderSelection(slugs: string[], city?: string) {
  const cityName = city?.trim();
  if (!cityName || slugs.length === 0) return null;

  const papers = getNewspapersBySlugs(slugs);
  if (papers.length !== new Set(slugs).size) return null;

  const selected = papers.map((paper) => paper.slug).sort().join("|");
  const pkg = getTenderPackages(cityName).find(
    (row) => [...row.slugs].sort().join("|") === selected,
  );
  if (!pkg || !pkg.rate || pkg.rate <= 0) return null;

  return {
    city: cityName,
    papers,
    label: pkg.label,
    unit: pkg.unit,
    size: pkg.size,
    rate: pkg.rate,
    bestSeller: pkg.bestSeller,
    tag: pkg.tag,
  };
}
