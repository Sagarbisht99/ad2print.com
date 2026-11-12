import matrimonialPackages from "@/data/matrimonial-packages.json";
import { getNewspapersBySlugs, slugifyCity, type Newspaper } from "@/lib/data";

type RawPackage = {
  slugs: string[];
  label: string;
  bestSeller?: boolean;
  tag?: string;
  rate?: number;
  mrp?: number;
};

type RawGroup = {
  city: string;
  title: string;
  packages: RawPackage[];
};

export type MatrimonialPackage = {
  id: string;
  city: string;
  slugs: string[];
  label: string;
  papers: Newspaper[];
  unit: string;
  bestSeller: boolean;
  tag?: string;
  rate?: number;
  mrp?: number;
};

export type MatrimonialGroup = {
  city: string;
  title: string;
  slug: string;
  packages: MatrimonialPackage[];
};

const GROUPS = matrimonialPackages as RawGroup[];

function toPackage(city: string, row: RawPackage): MatrimonialPackage | null {
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
    bestSeller: Boolean(row.bestSeller),
    tag: row.tag ?? (papers.length === 1 ? papers[0].language : undefined),
    rate: row.rate,
    mrp: row.mrp,
  };
}

/** City groups that already contain bookable packages, in display order. */
export function getMatrimonialGroups(): MatrimonialGroup[] {
  return GROUPS.map((group) => ({
    city: group.city,
    title: group.title,
    slug: slugifyCity(group.title),
    packages: group.packages
      .map((row) => toPackage(group.city, row))
      .filter((row): row is MatrimonialPackage => Boolean(row)),
  })).filter((group) => group.packages.length > 0);
}

export function getMatrimonialPackages(city: string): MatrimonialPackage[] {
  return getMatrimonialGroups().find((group) => group.city === city)?.packages ?? [];
}

/**
 * Resolves a package on the server so the payable amount always comes from our
 * own data, never from the client. A package must exist for the city.
 */
export function getMatrimonialSelection(slugs: string[], city?: string) {
  const cityName = city?.trim();
  if (!cityName || slugs.length === 0) return null;

  const papers = getNewspapersBySlugs(slugs);
  if (papers.length !== new Set(slugs).size) return null;

  const selected = papers.map((paper) => paper.slug).sort().join("|");
  const pkg = getMatrimonialPackages(cityName).find(
    (row) => [...row.slugs].sort().join("|") === selected,
  );
  if (!pkg || !pkg.rate || pkg.rate <= 0) return null;

  return {
    city: cityName,
    papers,
    label: pkg.label,
    unit: pkg.unit,
    rate: pkg.rate,
    mrp: pkg.mrp,
    bestSeller: pkg.bestSeller,
    tag: pkg.tag,
  };
}
